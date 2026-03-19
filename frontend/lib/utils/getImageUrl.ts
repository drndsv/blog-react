export const getImageUrl = (path?: string | null) => {
  if (!path) return '';

  if (path.startsWith('http')) {
    return path;
  }

  if (path.startsWith('/storybook/')) {
    return path;
  }

  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};
