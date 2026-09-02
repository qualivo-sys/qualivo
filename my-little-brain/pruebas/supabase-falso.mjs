/** Supabase falso en memoria: implementa el subconjunto de la API que usa la app. */
function coincide(fila, filtros) {
  return filtros.every(([tipo, campo, valor]) => {
    if (tipo === 'eq') return String(fila[campo]) === String(valor);
    if (tipo === 'gte') return String(fila[campo]) >= String(valor);
    if (tipo === 'in') return valor.map(String).includes(String(fila[campo]));
    return true;
  });
}

class Consulta {
  constructor(db, tabla, operacion, payload, opciones = {}) {
    this.db = db; this.tabla = tabla; this.operacion = operacion;
    this.payload = payload; this.opciones = opciones;
    this.filtros = []; this._limite = null; this._orden = null; this._single = null;
    this.db.tablas[tabla] ??= [];
  }
  select() { if (this.operacion === 'noop') this.operacion = 'select'; return this; }
  eq(campo, valor) { this.filtros.push(['eq', campo, valor]); return this; }
  gte(campo, valor) { this.filtros.push(['gte', campo, valor]); return this; }
  in(campo, valores) { this.filtros.push(['in', campo, valores]); return this; }
  order(campo, opciones = {}) { this._orden = [campo, opciones.ascending !== false]; return this; }
  limit(n) { this._limite = n; return this; }
  single() { this._single = 'single'; return this; }
  maybeSingle() { this._single = 'maybe'; return this; }

  ejecutar() {
    const filas = this.db.tablas[this.tabla];
    let resultado = null;

    if (this.operacion === 'insert') {
      const nuevas = (Array.isArray(this.payload) ? this.payload : [this.payload]).map((f) => ({
        id: f.id ?? `id-${this.db.contador++}`, creado: new Date().toISOString(), ...f,
      }));
      filas.push(...nuevas);
      this.db.registro.push({ tabla: this.tabla, op: 'insert', n: nuevas.length });
      resultado = nuevas;
    } else if (this.operacion === 'upsert') {
      const claves = (this.opciones.onConflict ?? 'id').split(',').map((c) => c.trim());
      const nuevas = (Array.isArray(this.payload) ? this.payload : [this.payload]).map((f) => {
        const indice = filas.findIndex((existente) => claves.every((c) => String(existente[c]) === String(f[c])));
        if (indice >= 0) { filas[indice] = { ...filas[indice], ...f }; return filas[indice]; }
        const fila = { id: f.id ?? `id-${this.db.contador++}`, ...f };
        filas.push(fila);
        return fila;
      });
      this.db.registro.push({ tabla: this.tabla, op: 'upsert', n: nuevas.length });
      resultado = nuevas;
    } else if (this.operacion === 'update') {
      const afectadas = filas.filter((f) => coincide(f, this.filtros));
      afectadas.forEach((f) => Object.assign(f, this.payload));
      this.db.registro.push({ tabla: this.tabla, op: 'update', n: afectadas.length });
      resultado = afectadas;
    } else if (this.operacion === 'delete') {
      const quedan = filas.filter((f) => !coincide(f, this.filtros));
      const borradas = filas.length - quedan.length;
      this.db.tablas[this.tabla] = quedan;
      this.db.registro.push({ tabla: this.tabla, op: 'delete', n: borradas });
      resultado = [];
    } else {
      resultado = filas.filter((f) => coincide(f, this.filtros));
      if (this._orden) {
        const [campo, asc] = this._orden;
        resultado = [...resultado].sort((a, b) =>
          String(a[campo] ?? '').localeCompare(String(b[campo] ?? '')) * (asc ? 1 : -1));
      }
      if (this._limite !== null) resultado = resultado.slice(0, this._limite);
    }

    if (this._single) return { data: resultado[0] ?? null, error: null };
    return { data: resultado, error: null };
  }
  then(resolver, rechazar) { return Promise.resolve(this.ejecutar()).then(resolver, rechazar); }
}

export function crearSupabaseFalso(datosIniciales = {}) {
  const db = { tablas: { ...datosIniciales }, registro: [], contador: 1 };
  return {
    db,
    from(tabla) {
      return {
        select: (...a) => new Consulta(db, tabla, 'select').select(...a),
        insert: (payload) => new Consulta(db, tabla, 'insert', payload),
        upsert: (payload, opciones) => new Consulta(db, tabla, 'upsert', payload, opciones),
        update: (payload) => new Consulta(db, tabla, 'update', payload),
        delete: () => new Consulta(db, tabla, 'delete'),
      };
    },
    storage: { from: () => ({ upload: async () => ({ error: null }) }) },
    auth: { getUser: async () => ({ data: { user: { id: 'u1' } } }) },
  };
}
