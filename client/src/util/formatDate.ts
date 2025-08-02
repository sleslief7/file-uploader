export const formatDate = (stringDate: string) => {
  const date = new Date(stringDate);

  const today = new Date();
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric', // YYYY
    month: 'short', // MMM
    day: '2-digit', // dd
  });
};
