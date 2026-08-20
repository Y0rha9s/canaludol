create table if not exists programacion (
  id uuid primary key default gen_random_uuid(),
  dia text not null check (dia in ('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo')),
  hora_inicio text not null,
  hora_fin text,
  nombre text not null,
  conductor text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table programacion enable row level security;

create policy "programacion_select_public" on programacion
  for select using (true);

create policy "programacion_write_anon" on programacion
  for all using (true) with check (true);
