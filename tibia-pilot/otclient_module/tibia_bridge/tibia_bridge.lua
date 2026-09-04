--[[
  Puente OTClient <-> agente.

  Es la pieza que le da ojos y manos al robot dentro del juego. Empuja el
  estado 20 veces por segundo y ejecuta las acciones que le llegan de vuelta.

  Por que asi y no leyendo la pantalla: aqui el estado ya esta estructurado.
  No hay OCR, ni reconocimiento de sprites, ni calibrar resoluciones. La vida
  se pregunta, no se mide en pixeles.

  AVISO IMPORTANTE - esto no se ha podido probar contra un cliente real.
  El API de websocket (g_http) existe en el fork mehah/otclient; en otros
  forks puede llamarse distinto o no estar. Si al cargar el modulo da error,
  el punto a mirar es `conectar()`, y el resto del fichero sirve igual.
]]

local WS_URL = "ws://127.0.0.1:8777"
local TICK_MS = 50           -- 20 Hz, el mismo ritmo que el bucle del agente
local RANGO = 7              -- casillas alrededor del jugador que reportamos

local ws = nil
local tickEvent = nil
local reconnectEvent = nil
local observadas = {}        -- acciones del HUMANO pendientes de enviar

-- Los ids del cliente para las potions. El agente habla por nombre porque el
-- nombre es lo que entiende un humano; la traduccion a id vive aqui.
local ITEMS = {
  ["health potion"]        = 266,
  ["strong health potion"] = 236,
  ["great health potion"]  = 239,
  ["mana potion"]          = 268,
  ["strong mana potion"]   = 237,
  ["great mana potion"]    = 238,
}

local DIRECCIONES = {
  north = North, south = South, east = East, west = West,
}

-- ─────────────────────────────────────────────────────────────
-- Lectura del estado
-- ─────────────────────────────────────────────────────────────

local function contarItem(itemId)
  -- findPlayerItem recorre mochila y equipo; -1 = cualquier subtipo.
  local total = 0
  for _, item in ipairs(g_game.findPlayerItems(itemId) or {}) do
    total = total + item:getCount()
  end
  return total
end

local function inventario()
  local inv = {}
  for nombre, id in pairs(ITEMS) do
    local n = contarItem(id)
    if n > 0 then inv[nombre] = n end
  end
  return inv
end

local function criaturas(jugador, pos)
  local lista = {}
  local objetivo = g_game.getAttackingCreature()
  for _, c in ipairs(g_map.getSpectatorsInRange(pos, true, RANGO, RANGO)) do
    if c ~= jugador and not c:isLocalPlayer() then
      local cp = c:getPosition()
      -- Los NPC no son ni amenaza ni objetivo: fuera del estado.
      if not c:isNpc() then
        table.insert(lista, {
          id = c:getId(),
          name = c:getName(),
          hp_pct = (c:getHealthPercent() or 100) / 100.0,
          dx = cp.x - pos.x,
          dy = cp.y - pos.y,
          dz = cp.z - pos.z,
          is_player = c:isPlayer() and not c:isLocalPlayer(),
        })
      end
    end
  end
  return lista, objetivo and objetivo:getId() or nil
end

local function leerEstado()
  local jugador = g_game.getLocalPlayer()
  if not jugador then return nil end
  local pos = jugador:getPosition()
  if not pos then return nil end

  local lista, objetivo = criaturas(jugador, pos)
  return {
    t = g_clock.millis() / 1000.0,
    hp = jugador:getHealth(),
    max_hp = jugador:getMaxHealth(),
    mana = jugador:getMana(),
    max_mana = jugador:getMaxMana(),
    x = pos.x, y = pos.y, z = pos.z,
    creatures = lista,
    inventory = inventario(),
    target_id = objetivo,
    experience = jugador:getExperience() or 0,
    connected = g_game.isOnline(),
  }
end

-- ─────────────────────────────────────────────────────────────
-- Ejecucion de acciones
-- ─────────────────────────────────────────────────────────────

local function ejecutar(accion)
  local kind = accion.kind
  local p = accion.params or {}

  if kind == "cast" then
    g_game.talk(p.words)

  elseif kind == "use_item" then
    local id = ITEMS[p.name]
    if id then g_game.useInventoryItem(id) end

  elseif kind == "attack" then
    local c = g_map.getCreatureById(p.creature_id)
    if c then g_game.attack(c) end

  elseif kind == "walk" then
    local dir = DIRECCIONES[p.direction]
    if dir then g_game.walk(dir) end

  elseif kind == "logout" then
    -- safeLogout respeta el bloqueo de combate; si no se puede, no se puede.
    g_game.safeLogout()
  end
end

-- ─────────────────────────────────────────────────────────────
-- Observacion del humano (modo grabacion)
--
-- En vez de enganchar el teclado, envolvemos las funciones del propio juego.
-- Asi da igual si la accion vino de una hotkey, del raton o de una macro:
-- todo pasa por aqui, y con la accion exacta, no con una suposicion.
-- ─────────────────────────────────────────────────────────────

local originales = {}

local function observar(nombre, fn, extraer)
  originales[nombre] = g_game[nombre]
  g_game[nombre] = function(...)
    local ok, accion = pcall(extraer, ...)
    if ok and accion then table.insert(observadas, accion) end
    return originales[nombre](...)
  end
end

local function instalarObservadores()
  observar("talk", nil, function(texto)
    return { kind = "cast", params = { words = texto } }
  end)
  observar("useInventoryItem", nil, function(itemId)
    for nombre, id in pairs(ITEMS) do
      if id == itemId then
        return { kind = "use_item", params = { name = nombre } }
      end
    end
    return nil
  end)
  observar("attack", nil, function(creature)
    if not creature then return nil end
    return { kind = "attack", params = { creature_id = creature:getId() } }
  end)
end

local function quitarObservadores()
  for nombre, fn in pairs(originales) do g_game[nombre] = fn end
  originales = {}
end

-- ─────────────────────────────────────────────────────────────
-- Transporte
-- ─────────────────────────────────────────────────────────────

local function enviar(tabla)
  if not ws then return end
  g_http.wsSend(ws, json.encode(tabla))
end

local function tick()
  if not g_game.isOnline() then return end
  local estado = leerEstado()
  if estado then enviar({ type = "state", data = estado }) end
  if #observadas > 0 then
    enviar({ type = "observed", actions = observadas })
    observadas = {}
  end
end

local function alRecibir(_, mensaje)
  local ok, msg = pcall(json.decode, mensaje)
  if not ok or type(msg) ~= "table" then return end
  if msg.type ~= "actions" then return end
  for _, accion in ipairs(msg.actions or {}) do
    -- Una accion mal formada no puede tumbar el puente entero.
    pcall(ejecutar, accion)
  end
end

local function conectar()
  ws = g_http.webSocket(WS_URL, {
    onMessage = alRecibir,
    onOpen  = function() print("[tibia_bridge] conectado al agente") end,
    onClose = function()
      ws = nil
      print("[tibia_bridge] agente caido, reintentando en 3 s")
      reconnectEvent = scheduleEvent(conectar, 3000)
    end,
    onError = function(_, err) print("[tibia_bridge] error: " .. tostring(err)) end,
  })
end

function init()
  instalarObservadores()
  conectar()
  tickEvent = cycleEvent(tick, TICK_MS)
end

function terminate()
  if tickEvent then tickEvent:cancel(); tickEvent = nil end
  if reconnectEvent then reconnectEvent:cancel(); reconnectEvent = nil end
  quitarObservadores()
  if ws then g_http.cancel(ws); ws = nil end
end
