import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Ratings are stored in localStorage on client; this route exists as the backend contract
// Replace the in-memory store with a DB table in production

const store = new Map<string, number>(); // key: `${userId}:${movieId}`, value: rating

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;
  const ratings: Record<number, number> = {};
  store.forEach((rating, key) => {
    if (key.startsWith(`${userId}:`)) {
      const movieId = parseInt(key.split(':')[1]);
      ratings[movieId] = rating;
    }
  });

  return NextResponse.json(ratings);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { movieId, rating } = await req.json();
  if (!movieId || rating < 1 || rating > 10) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  store.set(`${session.user.id}:${movieId}`, rating);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const movieId = new URL(req.url).searchParams.get('movieId');
  store.delete(`${session.user.id}:${movieId}`);
  return NextResponse.json({ success: true });
}
