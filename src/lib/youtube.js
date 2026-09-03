export function getYoutubeEmbedUrl(url) {
  if (!url) return null;

  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/
  );
  if (!match) return null;

  return `https://www.youtube.com/embed/${match[1]}?rel=0`;
}
