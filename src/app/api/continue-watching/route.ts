import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface ContinueItem {
  movieId: number;
  title: string;
  poster_path: string;
  progress: number; // 0–100
  timestamp: number;
}

// In-memory store — replace with DB table in production
const store = new Map<string, ContinueItem[]>();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const items = store.get(session.user.id) ?? [];
  return NextResponse.json(items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const item: ContinueItem = await req.json();
  const existing = store.get(session.user.id) ?? [];
  const filtered = existing.filter(i => i.movieId !== item.movieId);
  store.set(session.user.id, [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, 20));

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const movieId = parseInt(new URL(req.url).searchParams.get('movieId') ?? '0');
  const existing = store.get(session.user.id) ?? [];
  store.set(session.user.id, existing.filter(i => i.movieId !== movieId));
  return NextResponse.json({ success: true });
}
