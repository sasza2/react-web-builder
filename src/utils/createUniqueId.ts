export const createUniqueId = () => {
  const uniqueId = Math.random().toString(36).substr(2, 9);
  return `${Date.now()}-${uniqueId}`;
};
