import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import { createUniqueId } from "@/utils/createUniqueId";
import { get, set } from "@/utils/field";

type IForm = Record<string, unknown>;

type FormContextProps = {
	getFormValues: () => IForm;
	setForm: React.Dispatch<React.SetStateAction<IForm>>;
	onChange?: () => void;
};

const FormContext = createContext({} as FormContextProps);

export const useForm = () => {
	const context = useContext(FormContext);
	return context;
};

export const useFormCreator = <T,>(
	initialState: () => T,
	deps: unknown[] = [],
) => {
	// eslint-disable-line
	const [form, setForm] = useState<T>(initialState);
	const [formId, setFormId] = useState<string>(null);
	const didUpdate = useRef(false);
	const formRef = useRef<T>();
	formRef.current = form;

	const setInternalForm = useCallback(
		(nextForm: T) => {
			setForm(nextForm);
			formRef.current = nextForm;
		},
		[setForm],
	);

	const getFormValues = useCallback((): T => formRef.current, []);

	useEffect(() => {
		// TODO check this
		if (!didUpdate.current) {
			didUpdate.current = true;
			return;
		}
		setInternalForm(initialState());
		setFormId(createUniqueId());
	}, deps);

	return {
		id: formId,
		setForm: setInternalForm,
		getFormValues,
	};
};

type UseFieldOptions<T> = {
	name: string;
	setValue: (value: T) => void;
	value: T;
};

export const useField = <T,>(name: string): UseFieldOptions<T> => {
	// eslint-disable-line
	const { getFormValues, onChange, setForm } = useForm();

	const setValue = (value: T) => {
		setForm(set(getFormValues(), name, value));
		if (onChange) onChange();
	};

	const value: T = get(getFormValues(), name);

	return {
		name,
		setValue,
		value,
	};
};

type FormProviderProps<T> = React.PropsWithChildren<{
	getFormValues: () => T;
	setForm: React.Dispatch<React.SetStateAction<T>>;
	onChange?: () => void;
}>;

export function FormProvider<T extends IForm>({
	children,
	getFormValues,
	onChange,
	setForm,
}: FormProviderProps<T>) {
	const value = useMemo(
		() => ({
			getFormValues,
			onChange,
			setForm,
		}),
		[getFormValues, onChange, setForm],
	);
	return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

type FieldProviderProps<T> = {
	value: T;
	setValue: (value: T) => void;
	name: string;
};

export function FieldProvider<T>({
	children,
	name,
	value,
	setValue,
}: React.PropsWithChildren<FieldProviderProps<T>>) {
	const context = useForm();
	const onChange = context ? context.onChange : undefined;

	const providerValue = useMemo(
		() => ({
			getFormValues: () => ({ [name]: value }),
			setForm: (form: Record<string, T>) => {
				if (setValue) setValue(form[name]);
			},
			onChange,
		}),
		[name, onChange, setValue, value],
	);

	return (
		<FormContext.Provider value={providerValue}>
			{children}
		</FormContext.Provider>
	);
}
