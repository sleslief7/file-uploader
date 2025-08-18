const cloneName = (src: string) => {
  src = src.trim();
  const match = src.match(/\((\d+)\)$/);

  if (match) {
    const number = parseInt(match[1], 10);
    const incremented = number + 1;
    return src.replace(/\(\d+\)$/, `(${incremented})`);
  } else {
    return `${src}(1)`;
  }
};
