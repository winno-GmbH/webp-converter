export const formatSize = (sizeInBytes: number): string => {
  const sizeInKB = sizeInBytes / 1024;
  return `${sizeInKB.toFixed(2)}kb`;
};
