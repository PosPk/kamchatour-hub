-- NFT items metadata table
create table if not exists public.nft_items (
	id uuid primary key default gen_random_uuid(),
	user_id uuid,
	title text,
	description text,
	image_path text not null,
	image_url text,
	attributes jsonb,
	created_at timestamptz default now()
);

create index if not exists idx_nft_items_created_at on public.nft_items(created_at desc);

