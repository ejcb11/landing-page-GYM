-- Ferreira Fitness GYM - Tabla de Rutinas Personalizadas en la Nube
-- Ejecutar en Supabase > SQL Editor

create table if not exists public.routines (
  id text primary key, -- 'trainer:carlos' o 'member:FF-COLON-00842'
  target_type text not null default 'trainer', -- 'trainer' o 'member'
  trainer_id text not null, -- 'carlos', 'andrea', 'luis'
  member_id text, -- ID del socio si es personalizada, null si es general
  weekly_plan jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security (RLS)
alter table public.routines enable row level security;

-- Políticas de acceso para la app móvil y recepción
drop policy if exists "Lectura pública de rutinas" on public.routines;
create policy "Lectura pública de rutinas"
  on public.routines
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Escritura de rutinas" on public.routines;
create policy "Escritura de rutinas"
  on public.routines
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Actualización de rutinas" on public.routines;
create policy "Actualización de rutinas"
  on public.routines
  for update
  to anon, authenticated
  using (true);

drop policy if exists "Eliminación de rutinas" on public.routines;
create policy "Eliminación de rutinas"
  on public.routines
  for delete
  to anon, authenticated
  using (true);

-- Habilitar Realtime para notificación instantánea
alter publication supabase_realtime add table public.routines;
