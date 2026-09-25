-- ============================================
-- SCHEMA AWAL: Retail + Equipment + Service
-- ============================================

-- USERS & ROLES
create table users (
  id uuid primary key references auth.users(id),
  full_name text not null,
  role text not null check (role in ('admin','staff_gudang','kurir','teknisi')),
  phone text,
  created_at timestamptz default now()
);

-- PRODUCTS (retail food & equipment, dibedakan lewat kolom category)
create table products (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('retail','equipment')),
  sku text unique not null,
  name text not null,
  description text,
  price numeric not null default 0,
  unit text default 'pcs',
  stock_qty integer not null default 0, -- dipakai untuk retail (bukan per-unit)
  low_stock_threshold integer default 5,
  created_at timestamptz default now()
);

-- SERIAL NUMBERS (khusus equipment, 1 baris = 1 unit fisik)
create table serial_numbers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) not null,
  serial_number text unique not null,
  status text not null default 'in_stock' check (status in ('in_stock','delivered','service','retired')),
  warranty_months integer default 12,
  created_at timestamptz default now()
);

-- ORDERS (retail & equipment)
create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references users(id),
  category text not null check (category in ('retail','equipment')),
  status text not null default 'pending' check (status in ('pending','confirmed','processing','delivered','cancelled')),
  total numeric not null default 0,
  created_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) not null,
  product_id uuid references products(id) not null,
  serial_number_id uuid references serial_numbers(id), -- diisi kalau kategori equipment
  qty integer not null default 1,
  price numeric not null
);

-- DELIVERIES (basis warranty untuk equipment + live tracking kurir)
create table deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) not null,
  courier_id uuid references users(id),
  status text not null default 'assigned' check (status in ('assigned','picked_up','on_the_way','delivered','failed')),
  current_lat double precision,
  current_lng double precision,
  last_location_update timestamptz,
  delivered_at timestamptz,
  proof_photo_url text,
  created_at timestamptz default now()
);

-- WARRANTY (dihitung dari deliveries.delivered_at + serial_numbers.warranty_months)
-- tidak perlu tabel terpisah, cukup view:
create view warranty_status as
select
  sn.id as serial_number_id,
  sn.serial_number,
  p.name as product_name,
  d.delivered_at,
  sn.warranty_months,
  (d.delivered_at + (sn.warranty_months || ' months')::interval) as warranty_expires_at,
  case
    when d.delivered_at is null then 'not_delivered'
    when now() <= (d.delivered_at + (sn.warranty_months || ' months')::interval) then 'active'
    else 'expired'
  end as warranty_status
from serial_numbers sn
join products p on p.id = sn.product_id
left join order_items oi on oi.serial_number_id = sn.id
left join deliveries d on d.order_id = oi.order_id;

-- SERVICE REQUESTS (bisa standalone, tidak wajib terkait order/serial number)
create table service_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references users(id),
  serial_number_id uuid references serial_numbers(id), -- nullable, standalone kalau kosong
  technician_id uuid references users(id),
  complaint text not null,
  status text not null default 'requested' check (status in ('requested','assigned','on_the_way','in_progress','completed','cancelled')),
  scheduled_at timestamptz,
  location_address text not null,
  location_lat double precision,
  location_lng double precision,
  created_at timestamptz default now()
);

-- SERVICE HISTORY / LOG per kunjungan
create table service_logs (
  id uuid primary key default gen_random_uuid(),
  service_request_id uuid references service_requests(id) not null,
  note text,
  photo_url text,
  parts_used text,
  cost numeric default 0,
  created_at timestamptz default now()
);

-- STOCK MOVEMENTS (in/out/opname, untuk retail & equipment)
create table stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) not null,
  type text not null check (type in ('in','out','opname_adjustment')),
  qty integer not null,
  note text,
  created_by uuid references users(id),
  created_at timestamptz default now()
);
 