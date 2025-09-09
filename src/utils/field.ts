type IObject = Record<string, unknown>;

export const get = <T>(obj: IObject, path = "", defaultValue?: T): T => {
	if (!obj) return defaultValue;

	const keys = path.split(".");
	for (let i = 0; i < keys.length; i++) {
		obj = obj[keys[i]] as IObject;
		if (obj === undefined) return defaultValue;
	}
	return obj as T;
};

const isPositiveInteger = (str: string): boolean => {
	const num = Number(str);
	return Number.isInteger(num) && num >= 0;
};

const setValueInArray = (currentObj: IObject, field: string) => {
	if (currentObj[field]) {
		currentObj[field] = [...(currentObj[field] as unknown[])];
		return currentObj[field];
	}
	const nextObj: unknown[] = [];
	currentObj[field] = nextObj;
	return nextObj;
};

export const set = <T extends IObject>(
	obj: T,
	path?: string,
	value?: unknown,
): T => {
	if (!path) path = "";
	const initialObj = (obj || {}) as T;
	let currentObj = initialObj;

	const keys = path.split(".");
	for (let i = 0; i < keys.length - 1; i++) {
		const field = keys[i];
		const nextField = keys[i + 1];

		if (nextField !== undefined && isPositiveInteger(nextField)) {
			currentObj = setValueInArray(currentObj, field) as typeof obj;

			continue;
		}

		if (currentObj[field]) {
			(currentObj as IObject)[field] = { ...(currentObj[field] as T) };
			currentObj = currentObj[field] as T;
		} else {
			const nextObj = {} as T;
			(currentObj as IObject)[field] = nextObj;
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

	(currentObj as IObject)[lastKey] = value;

	return { ...initialObj };
};

export const normalizeInt = (value: string) => parseInt(value, 10) || 0;
