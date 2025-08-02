export const bytesToMegabytes = (bytes: number): string => {
  const megabytes = bytes / 1024 / 1024;

  if (megabytes < 1) {
    const kilobytes = megabytes * 1024;
    return `${Math.ceil(kilobytes)} KB`;
  }

  return `${megabytes.toFixed(1)} MB`;
};
