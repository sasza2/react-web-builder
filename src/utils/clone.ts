export const cloneDeep = <T>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T;
