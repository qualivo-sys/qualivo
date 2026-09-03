-- ═══════════════════════════════════════════════════════════════════════
--  My Little Brain · esquema completo
--  Ejecutar en Supabase → SQL Editor → New query → Run.
--  Es idempotente: se puede volver a ejecutar sin romper nada.
-- ═══════════════════════════════════════════════════════════════════════

-- ── Perfil ─────────────────────────────────────────────────────────────
create table if not exists public.perfiles (
  id                  uuid primary key references auth.users on delete cascade,
  email               text,
  nombre              text,
  sexo                text check (sexo in ('hombre','mujer')),
  edad                int  check (edad between 14 and 100),
  altura_cm           numeric(5,1),
  ocupacion           text,
  objetivo            text check (objetivo in ('perder_grasa','ganar_musculo','recomposicion','fuerza','rendimiento','energia','salud_mental')),
  objetivos_extra     text[] not null default '{}',
  nivel               text check (nivel in ('principiante','intermedio','avanzado')),
  dias_semana         int check (dias_semana between 1 and 7),
  entorno             text check (entorno in ('gimnasio','casa_mancuernas','casa_sin_material')),
  actividad           text check (actividad in ('sedentario','ligera','moderada','alta')),
  limitaciones        text[] not null default '{}',
  alergias            text[] not null default '{}',
  preferencias_comida text,
  horario_comidas     text,
  alcohol_semanal     int,
  hora_dormir         text,
  hora_despertar      text,
  zona_horaria        text not null default 'Europe/Madrid',
  plan                text not null default 'free' check (plan in ('free','pro','founder')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  onboarding          boolean not null default false,
  notas               text,
  creado              timestamptz not null default now(),
  actualizado         timestamptz not null default now()
);

-- Instalaciones anteriores: anadir las columnas de Stripe si faltan.
alter table public.perfiles add column if not exists stripe_customer_id text;
alter table public.perfiles add column if not exists stripe_subscription_id text;
create index if not exists perfiles_stripe_customer on public.perfiles (stripe_customer_id);

-- ── Cuerpo ─────────────────────────────────────────────────────────────
create table if not exists public.metricas_corporales (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  fecha       date not null,
  peso_kg     numeric(5,2),
  cuello_cm   numeric(5,1),
  pecho_cm    numeric(5,1),
  cintura_cm  numeric(5,1),
  cadera_cm   numeric(5,1),
  brazo_cm    numeric(5,1),
  muslo_cm    numeric(5,1),
  notas       text,
  creado      timestamptz not null default now(),
  unique (user_id, fecha)
);

-- ── Nutricion ──────────────────────────────────────────────────────────
create table if not exists public.comidas (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users on delete cascade,
  fecha        date not null,
  momento      text check (momento in ('desayuno','comida','cena','snack','bebida')),
  descripcion  text not null,
  kcal         int,
  proteina_g   int,
  carbos_g     int,
  grasa_g      int,
  alcohol_ud   numeric(4,1) not null default 0,
  foto_path    text,
  fuente       text not null default 'chat' check (fuente in ('chat','foto','manual')),
  confianza    text check (confianza in ('alta','media','baja')),
  creado       timestamptz not null default now()
);
create index if not exists comidas_user_fecha on public.comidas (user_id, fecha desc);

-- ── Entrenamiento ──────────────────────────────────────────────────────
create table if not exists public.planes_entreno (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  firma       text not null,
  datos       jsonb not null,
  activo      boolean not null default true,
  generado_el timestamptz not null default now()
);
create index if not exists planes_user on public.planes_entreno (user_id, generado_el desc);

create table if not exists public.entrenamientos (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  fecha      date not null,
  dia_plan   text,
  nombre     text not null,
  sensacion  int check (sensacion between 1 and 5),
  duracion_min int,
  notas      text,
  completado boolean not null default false,
  creado     timestamptz not null default now()
);
create index if not exists entrenamientos_user_fecha on public.entrenamientos (user_id, fecha desc);
-- Cardio al final de la sesion (tipo, minutos y kcal estimadas por MET).
alter table public.entrenamientos add column if not exists cardio_tipo text;
alter table public.entrenamientos add column if not exists cardio_min int;
alter table public.entrenamientos add column if not exists cardio_kcal int;

create table if not exists public.series (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users on delete cascade,
  entrenamiento_id uuid not null references public.entrenamientos on delete cascade,
  ejercicio_id     text not null,
  ejercicio_nombre text not null,
  orden            int not null default 0,
  serie            int not null default 1,
  peso_kg          numeric(6,2),
  reps             int,
  rir              int,
  hecha            boolean not null default true
);
create index if not exists series_entreno on public.series (entrenamiento_id);
create index if not exists series_user_ejercicio on public.series (user_id, ejercicio_id);

-- ── Productividad y aprendizaje ────────────────────────────────────────
create table if not exists public.foco (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  fecha       date not null,
  categoria   text not null check (categoria in ('deep_work','negocio','aprendizaje','idiomas','lectura','otro')),
  minutos     int not null check (minutos > 0),
  descripcion text,
  creado      timestamptz not null default now()
);
create index if not exists foco_user_fecha on public.foco (user_id, fecha desc);

create table if not exists public.tareas (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  titulo      text not null,
  area        text,
  prioridad   int not null default 2 check (prioridad between 1 and 3),
  fecha       date,
  completada  boolean not null default false,
  creado      timestamptz not null default now()
);
create index if not exists tareas_user on public.tareas (user_id, completada, fecha);

-- ── Habitos ────────────────────────────────────────────────────────────
create table if not exists public.habitos (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users on delete cascade,
  nombre           text not null,
  emoji            text not null default '✅',
  veces_por_semana int not null default 7 check (veces_por_semana between 1 and 7),
  activo           boolean not null default true,
  creado           timestamptz not null default now()
);

create table if not exists public.habitos_registro (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users on delete cascade,
  habito_id uuid not null references public.habitos on delete cascade,
  fecha     date not null,
  hecho     boolean not null default true,
  unique (habito_id, fecha)
);
create index if not exists habitos_registro_user_fecha on public.habitos_registro (user_id, fecha desc);

-- ── Bienestar (una fila por dia) ───────────────────────────────────────
create table if not exists public.bienestar (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users on delete cascade,
  fecha          date not null,
  animo          int check (animo between 1 and 10),
  energia        int check (energia between 1 and 10),
  estres         int check (estres between 1 and 10),
  ansiedad       int check (ansiedad between 1 and 10),
  motivacion     int check (motivacion between 1 and 10),
  sueno_horas    numeric(3,1),
  sueno_calidad  int check (sueno_calidad between 1 and 10),
  pasos          int,
  notas          text,
  creado         timestamptz not null default now(),
  unique (user_id, fecha)
);

-- ── Objetivos ──────────────────────────────────────────────────────────
create table if not exists public.objetivos (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users on delete cascade,
  area          text not null check (area in ('cuerpo','fitness','productividad','aprendizaje','mente','negocio')),
  titulo        text not null,
  detalle       text,
  metrica       text,
  valor_objetivo numeric,
  fecha_limite  date,
  estado        text not null default 'activo' check (estado in ('activo','conseguido','pausado','abandonado')),
  creado        timestamptz not null default now()
);

-- ── Memoria a largo plazo del coach ────────────────────────────────────
create table if not exists public.memoria (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  clave       text not null,
  valor       text not null,
  categoria   text not null default 'general',
  actualizado timestamptz not null default now(),
  unique (user_id, clave)
);

-- ── Chat con el coach ──────────────────────────────────────────────────
create table if not exists public.chat_mensajes (
  id      uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  rol     text not null check (rol in ('user','assistant')),
  texto   text not null,
  acciones jsonb not null default '[]'::jsonb,
  creado  timestamptz not null default now()
);
create index if not exists chat_user_creado on public.chat_mensajes (user_id, creado desc);

-- ── Gamificacion ───────────────────────────────────────────────────────
create table if not exists public.xp_eventos (
  id      uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  fecha   date not null default current_date,
  tipo    text not null,
  xp      int not null,
  motivo  text,
  creado  timestamptz not null default now()
);
create index if not exists xp_user_fecha on public.xp_eventos (user_id, fecha desc);

-- ── Revision semanal ───────────────────────────────────────────────────
create table if not exists public.revisiones (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users on delete cascade,
  semana_inicio date not null,
  contenido     jsonb not null,
  generado_el   timestamptz not null default now(),
  unique (user_id, semana_inicio)
);

-- ── Notificaciones push ────────────────────────────────────────────────
create table if not exists public.push_suscripciones (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  endpoint   text not null unique,
  p256dh     text not null,
  auth       text not null,
  navegador  text,
  creado     timestamptz not null default now()
);
create index if not exists push_user on public.push_suscripciones (user_id);

-- Registro de avisos enviados, para no repetir el mismo aviso el mismo dia.
create table if not exists public.push_envios (
  id      uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  fecha   date not null,
  tipo    text not null,
  creado  timestamptz not null default now(),
  unique (user_id, fecha, tipo)
);

-- Preferencias de avisos (horas locales y si estan activos).
alter table public.perfiles add column if not exists preferencias jsonb not null default '{}'::jsonb;

-- Objetivos de calorias y macros fijados a mano o importados de una dieta de
-- un especialista. Si existen, mandan sobre el calculo automatico.
alter table public.perfiles add column if not exists objetivos_manual jsonb;

-- ── Uso de IA (para limites por plan) ──────────────────────────────────
create table if not exists public.uso_ia (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users on delete cascade,
  mes            text not null,           -- 'YYYY-MM'
  mensajes       int not null default 0,
  tokens_entrada bigint not null default 0,
  tokens_salida  bigint not null default 0,
  actualizado    timestamptz not null default now(),
  unique (user_id, mes)
);

-- ═══════════════════════════════════════════════════════════════════════
--  Row Level Security: cada usuario solo ve y toca lo suyo.
-- ═══════════════════════════════════════════════════════════════════════
do $$
declare t text;
begin
  foreach t in array array[
    'perfiles','metricas_corporales','comidas','planes_entreno','entrenamientos','series',
    'foco','tareas','habitos','habitos_registro','bienestar','objetivos','memoria',
    'chat_mensajes','xp_eventos','revisiones','uso_ia','push_suscripciones','push_envios'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "propio_select" on public.%I', t);
    execute format('drop policy if exists "propio_insert" on public.%I', t);
    execute format('drop policy if exists "propio_update" on public.%I', t);
    execute format('drop policy if exists "propio_delete" on public.%I', t);

    if t = 'perfiles' then
      execute 'create policy "propio_select" on public.perfiles for select using (auth.uid() = id)';
      execute 'create policy "propio_insert" on public.perfiles for insert with check (auth.uid() = id)';
      execute 'create policy "propio_update" on public.perfiles for update using (auth.uid() = id) with check (auth.uid() = id)';

    -- uso_ia es el contador de consumo: el usuario puede mirarlo, no tocarlo.
    -- Si pudiera, se pondria los mensajes a cero y consumiria API gratis.
    elsif t = 'uso_ia' then
      execute 'create policy "propio_select" on public.uso_ia for select using (auth.uid() = user_id)';

    -- push_envios lo escribe solo el cron (service role); el usuario puede verlo.
    elsif t = 'push_envios' then
      execute 'create policy "propio_select" on public.push_envios for select using (auth.uid() = user_id)';

    else
      execute format('create policy "propio_select" on public.%I for select using (auth.uid() = user_id)', t);
      execute format('create policy "propio_insert" on public.%I for insert with check (auth.uid() = user_id)', t);
      execute format('create policy "propio_update" on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
      execute format('create policy "propio_delete" on public.%I for delete using (auth.uid() = user_id)', t);
    end if;
  end loop;
end $$;

-- ═══════════════════════════════════════════════════════════════════════
--  Permisos por columna en perfiles
--
--  RLS decide QUE FILAS se pueden tocar, pero no QUE COLUMNAS. Sin esto, un
--  usuario con su propio JWT puede llamar a PostgREST y ponerse plan
--  'founder' o escribirse el stripe_customer_id de otra persona. El plan y los
--  identificadores de Stripe solo los escribe el webhook (service role).
-- ═══════════════════════════════════════════════════════════════════════
revoke insert, update on public.perfiles from authenticated, anon;

grant insert (id, email, nombre) on public.perfiles to authenticated;

-- Ojo al anadir columnas nuevas que el usuario deba poder editar: hay que
-- sumarlas aqui, porque por defecto quedan sin permiso de escritura.
grant update (
  nombre, sexo, edad, altura_cm, ocupacion,
  objetivo, objetivos_extra, nivel, dias_semana, entorno, actividad,
  limitaciones, alergias, preferencias_comida, horario_comidas, alcohol_semanal,
  hora_dormir, hora_despertar, zona_horaria, onboarding, notas, actualizado, preferencias,
  objetivos_manual
) on public.perfiles to authenticated;

-- ═══════════════════════════════════════════════════════════════════════
--  Contador de uso de la IA: solo se puede sumar, nunca restar ni reiniciar
-- ═══════════════════════════════════════════════════════════════════════
create or replace function public.incrementar_uso(
  p_tokens_entrada bigint default 0,
  p_tokens_salida  bigint default 0
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Sin sesion';
  end if;

  insert into public.uso_ia (user_id, mes, mensajes, tokens_entrada, tokens_salida, actualizado)
  values (
    auth.uid(),
    to_char(now() at time zone 'utc', 'YYYY-MM'),
    1,
    greatest(coalesce(p_tokens_entrada, 0), 0),
    greatest(coalesce(p_tokens_salida, 0), 0),
    now()
  )
  on conflict (user_id, mes) do update
    set mensajes       = uso_ia.mensajes + 1,
        tokens_entrada = uso_ia.tokens_entrada + greatest(coalesce(p_tokens_entrada, 0), 0),
        tokens_salida  = uso_ia.tokens_salida + greatest(coalesce(p_tokens_salida, 0), 0),
        actualizado    = now();
end $$;

revoke all on function public.incrementar_uso(bigint, bigint) from public, anon;
grant execute on function public.incrementar_uso(bigint, bigint) to authenticated;

-- ═══════════════════════════════════════════════════════════════════════
--  Alta automatica de perfil al registrarse
-- ═══════════════════════════════════════════════════════════════════════
create or replace function public.crear_perfil()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (id, email, nombre)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_perfil();

-- ═══════════════════════════════════════════════════════════════════════
--  Almacenamiento de fotos de comida (privado, una carpeta por usuario)
-- ═══════════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values ('comidas', 'comidas', false)
on conflict (id) do nothing;

drop policy if exists "comidas_propias_select" on storage.objects;
drop policy if exists "comidas_propias_insert" on storage.objects;
drop policy if exists "comidas_propias_delete" on storage.objects;

create policy "comidas_propias_select" on storage.objects for select
  using (bucket_id = 'comidas' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "comidas_propias_insert" on storage.objects for insert
  with check (bucket_id = 'comidas' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "comidas_propias_delete" on storage.objects for delete
  using (bucket_id = 'comidas' and (storage.foldername(name))[1] = auth.uid()::text);
