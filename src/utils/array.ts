export const mergeArrays = <T extends { id: string } >(
  lists: T[][],
  mergeItem?: (original: T, extra: T) => T,
) => {
  const group: Record<string, T> = {};

  const mergeInternal = (a: T, b: T) => {
    if (mergeItem) return mergeItem(a, b);
    return ({
      ...a,
      ...b,
    });
  };

  lists.forEach((list) => {
    if (!list) return;

    list.forEach((item) => {
      const itemInGroup = group[item.id];
      if (itemInGroup) {
        group[item.id] = mergeInternal(itemInGroup, item);
      } else {
        group[item.id] = item;
      }
    });
  });

  return Object.values(group);
};
