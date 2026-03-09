const stringToHue = (str: string | null): number => {
  if (!str) return 0;

  let hash = 0;
  for (const char of str) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }

  return Math.abs(hash * 137.508) % 360;
};

const stringToColor = (str: string | null, lightness = 35): string => {
  if (!str) return '#888888';
  return `hsl(${stringToHue(str)}, 65%, ${lightness}%)`;
};

export default stringToColor;
