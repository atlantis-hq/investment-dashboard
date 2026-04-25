-- Investment Dashboard — initial schema
-- 7 core tables. RLS enabled, anon denied. Service-role bypasses RLS so the
-- /api/portfolio route is the only consumer.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- assets: catalog of every distinct holding
-- ---------------------------------------------------------------------------
create table assets (
  id              uuid primary key default gen_random_uuid(),
  category        text not null check (category in (
    'etf_fund','monetary','crypto','fixed_income','loan','pe','vc','real_estate'
  )),
  subcategory     text,
  name            text not null,
  ticker          text,
  quote_source    text check (quote_source is null or quote_source in (
    'yahoo','coingecko','metals','manual'
  )),
  quote_symbol    text,
  currency        text not null default 'EUR',
  status          text not null default 'active' check (status in (
    'active','closed','written_off'
  )),
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_assets_category_active on assets(category) where status = 'active';
create index idx_assets_status on assets(status);

-- ---------------------------------------------------------------------------
-- transactions: immutable monetary log
-- ---------------------------------------------------------------------------
create table transactions (
  id              uuid primary key default gen_random_uuid(),
  asset_id        uuid not null references assets(id) on delete restrict,
  type            text not null check (type in (
    'buy','sell','dividend','interest_payment','principal_payment',
    'fee','contribution','distribution','rent_received','expense','mortgage_payment'
  )),
  date            date not null,
  units           numeric(20,8),
  unit_price      numeric(20,8),
  amount          numeric(14,2) not null,
  currency        text not null default 'EUR',
  fx_rate         numeric(14,8),
  notes           text,
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

create index idx_transactions_asset on transactions(asset_id, date desc);
create index idx_transactions_date on transactions(date desc);
create index idx_transactions_type on transactions(type);

-- ---------------------------------------------------------------------------
-- quotes: cached market prices (one row per asset per day)
-- ---------------------------------------------------------------------------
create table quotes (
  asset_id        uuid not null references assets(id) on delete cascade,
  date            date not null,
  price           numeric(20,8) not null,
  source          text not null,
  fetched_at      timestamptz not null default now(),
  primary key (asset_id, date)
);

-- ---------------------------------------------------------------------------
-- valuations: manual snapshots (PE, VC, RE, illiquid funds)
-- ---------------------------------------------------------------------------
create table valuations (
  id              uuid primary key default gen_random_uuid(),
  asset_id        uuid not null references assets(id) on delete cascade,
  date            date not null,
  value           numeric(14,2) not null,
  source          text,
  notes           text,
  unique (asset_id, date)
);

create index idx_valuations_asset_recent on valuations(asset_id, date desc);

-- ---------------------------------------------------------------------------
-- loan_schedules: amortization schedule (one row per scheduled payment)
-- ---------------------------------------------------------------------------
create table loan_schedules (
  asset_id            uuid not null references assets(id) on delete cascade,
  payment_no          int not null,
  due_date            date not null,
  scheduled_principal numeric(14,2) not null,
  scheduled_interest  numeric(14,2) not null,
  paid_principal      numeric(14,2) not null default 0,
  paid_interest       numeric(14,2) not null default 0,
  paid_date           date,
  status              text not null default 'pending' check (status in (
    'pending','paid','late','default'
  )),
  primary key (asset_id, payment_no)
);

create index idx_loan_schedules_pending_due on loan_schedules(due_date) where status = 'pending';

-- ---------------------------------------------------------------------------
-- re_cashflows: monthly cashflow per real-estate property
-- ---------------------------------------------------------------------------
create table re_cashflows (
  id              uuid primary key default gen_random_uuid(),
  asset_id        uuid not null references assets(id) on delete cascade,
  month           date not null,
  rent_received   numeric(10,2) not null default 0,
  expenses        numeric(10,2) not null default 0,
  mortgage_paid   numeric(10,2) not null default 0,
  notes           text,
  unique (asset_id, month)
);

-- ---------------------------------------------------------------------------
-- portfolio_snapshots: daily total (filled by cron)
-- ---------------------------------------------------------------------------
create table portfolio_snapshots (
  date            date primary key,
  total_invested  numeric(14,2) not null,
  total_value     numeric(14,2) not null,
  by_category     jsonb not null,
  computed_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at trigger for assets
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger assets_set_updated_at
  before update on assets
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: deny anon completely. service_role bypasses RLS so the API route works.
-- When auth is added later, replace these with auth.uid() = owner_id policies.
-- ---------------------------------------------------------------------------
alter table assets              enable row level security;
alter table transactions        enable row level security;
alter table quotes              enable row level security;
alter table valuations          enable row level security;
alter table loan_schedules      enable row level security;
alter table re_cashflows        enable row level security;
alter table portfolio_snapshots enable row level security;

-- No policies created on purpose: with RLS on and no policies, anon/authenticated
-- get zero rows. Only service_role (used by /api/portfolio server-side) bypasses.
