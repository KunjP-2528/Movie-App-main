import { MovieDetailsPage } from '@/components/movie/MovieDetailsPage';

interface Props {
  params: { id: string };
}

export default function MoviePage({ params }: Props) {
  return <MovieDetailsPage movieId={parseInt(params.id)} />;
}
