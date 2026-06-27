import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const HASURA = process.env.HASURA_URL!;
const SECRET = process.env.HASURA_ADMIN_SECRET!;

async function gql(query: string, variables?: Record<string, unknown>) {
  const res = await fetch(HASURA, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': SECRET },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });
  const json = await res.json();
  if (json.errors) console.error('[watchlist] Hasura error:', JSON.stringify(json.errors));
  return json;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, errors } = await gql(`
  query GetWatchlist {
    watchList {
      id
      movie_app_id
      poster_path: movie_poster_path
      overview
      title
      added_at
    }
  }
`);


  if (errors) return NextResponse.json({ error: errors[0].message }, { status: 500 });
  return NextResponse.json(data?.watchList ?? []);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, title, overview, poster_path } = await req.json();

  const { data, errors } = await gql(
    `mutation AddWL($id: Int!, $movie_app_id: Int!, $movie_poster_path: String!, $overview: String!, $title: String!, $added_at: timestamptz!) {
      insert_watchList(objects: { id: $id, movie_app_id: $movie_app_id, movie_poster_path: $movie_poster_path, overview: $overview, title: $title, added_at: $added_at }) {
        returning { id title }
      }
    }`,
    { id, movie_app_id: id, movie_poster_path: poster_path ?? '', overview, title, added_at: new Date().toISOString() }
  );

  if (errors) return NextResponse.json({ error: errors[0].message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = parseInt(new URL(req.url).searchParams.get('id') ?? '0');

  const { data, errors } = await gql(
  `mutation DelWL($id: Int!) {
    delete_watchList(where: { movie_app_id: { _eq: $id } }) {
      affected_rows
    }
  }`,
  { id }
);

  if (errors) return NextResponse.json({ error: errors[0].message }, { status: 500 });
  return NextResponse.json(data);
}
