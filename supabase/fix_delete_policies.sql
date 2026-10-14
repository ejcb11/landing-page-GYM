-- Ferreira Fitness GYM - Permitir que Recepción dé de baja socios en la nube.
-- Ejecutar UNA vez en Supabase > SQL Editor.
-- (Hoy el DELETE está bloqueado por Row Level Security y los socios "resucitan" al recargar.)

drop policy if exists "reception can delete members" on public.members;
create policy "reception can delete members"
  on public.members
  for delete
  to anon, authenticated
  using (true);

-- Limpieza de socios temporales de prueba
delete from public.members where id in ('FF-TEST-0000', 'FF-TEST-DEL');
