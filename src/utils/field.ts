export const get = <T>(obj: Record<string, unknown>, path = '', defaultValue?: T): T => {
  if (!obj) return defaultValue;

  const keys = path.split('.');
  for (let i = 0; i < keys.length; i++) {
    obj = obj[keys[i]] as Record<string, unknown>;
    if (obj === undefined) return defaultValue;
  }
  return obj as T;
};

export const set = (
  obj: Record<string, unknown>,
  path?: string,
  value?: unknown,
): Record<string, unknown> => {
  if (!path) path = '';
  const initialObj = obj || {};
  let currentObj = initialObj;

  const keys = path.split('.');
  for (let i = 0; i < keys.length - 1; i++) {
    const field = keys[i];
    if (currentObj[field]) {
      currentObj[field] = { ...currentObj[field] as Record<string, unknown> };
      currentObj = currentObj[field] as Record<string, unknown>;
    } else {
      const nextObj = {};
      currentObj[field] = nextObj;
      currentObj = nextObj;
    }
  }

  const lastKey = keys[keys.length - 1];

  if (currentObj === initialObj) {
    return {
      ...currentObj,
      [lastKey]: value,
    };
  }

  currentObj[lastKey] = value;

  return { ...initialObj };
};

export const normalizeInt = (value: string) => parseInt(value, 10) || 0;
