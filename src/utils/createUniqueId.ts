export const createUniqueId = () => {
  const uniqueId = Math.random().toString(36).substr(2, 9);
  return `${new Date().getTime()}-${uniqueId}`;
};
