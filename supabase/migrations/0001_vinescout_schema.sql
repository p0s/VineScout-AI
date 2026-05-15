create table if not exists buyer_profiles (
  id text primary key,
  company_name text not null,
  company_type text not null,
  channels text[] not null default '{}',
  target_products text[] not null default '{}',
  target_countries text[] not null default '{}',
  preferred_deal_types text[] not null default '{}',
  budget_min_usd numeric,
  budget_max_usd numeric,
  target_china_price_tier text not null,
  risk_appetite text not null,
  timeline text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists vineyard_opportunities (
  id text primary key,
  name text not null,
  fictional_demo boolean not null default true,
  region text not null,
  country text not null,
  lat numeric not null,
  lng numeric not null,
  hectares numeric not null,
  varietals text[] not null default '{}',
  annual_production_bottles integer,
  deal_types text[] not null default '{}',
  indicative_price_usd numeric,
  investment_range_usd numeric[],
  owner_openness_score integer not null,
  export_readiness_score integer not null,
  china_premium_fit_score integer not null,
  climate_risk_score integer not null,
  harvest_risk_score integer not null,
  overall_fit_score integer not null,
  confidence integer not null,
  top_reasons text[] not null default '{}',
  red_flags text[] not null default '{}',
  due_diligence_notes text[] not null default '{}',
  contact jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists harvest_signals (
  id text primary key,
  vineyard_id text not null references vineyard_opportunities(id) on delete cascade,
  observed_at date not null,
  ndvi_proxy integer not null,
  evi_proxy integer not null,
  canopy_uniformity integer not null,
  drought_stress integer not null,
  heat_risk integer not null,
  frost_risk integer not null,
  smoke_risk integer not null,
  disease_anomaly_proxy integer not null,
  source text not null,
  notes text
);

create table if not exists evidence_items (
  id text primary key,
  opportunity_id text references vineyard_opportunities(id) on delete cascade,
  type text not null,
  source text not null,
  title text not null,
  summary text not null,
  confidence integer not null,
  observed_at timestamptz,
  url text,
  raw_text text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists deal_memos (
  id text primary key,
  opportunity_id text not null references vineyard_opportunities(id) on delete cascade,
  buyer_profile_id text not null references buyer_profiles(id) on delete cascade,
  recommendation text not null,
  markdown text not null,
  chinese_summary text not null,
  ai_model text,
  confidence integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists watch_alerts (
  id text primary key,
  opportunity_id text not null references vineyard_opportunities(id) on delete cascade,
  title text not null,
  severity text not null,
  source text not null,
  created_at timestamptz not null default now()
);

create index if not exists vineyard_opportunities_region_idx on vineyard_opportunities (region);
create index if not exists vineyard_opportunities_country_idx on vineyard_opportunities (country);
create index if not exists harvest_signals_vineyard_idx on harvest_signals (vineyard_id, observed_at desc);
create index if not exists evidence_items_opportunity_idx on evidence_items (opportunity_id, created_at desc);
create index if not exists watch_alerts_opportunity_idx on watch_alerts (opportunity_id, created_at desc);
