const stringToColor = (str: string | null): string => {
  if (!str) return '#888888';

  let hash = 0;
  for (const char of str) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash * 137.508) % 360;
  return `hsl(${hue}, 65%, 50%)`;
};

export default stringToColor;
