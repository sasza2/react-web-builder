import { act, render, renderHook, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import {
	FieldProvider,
	FormProvider,
	useField,
	useForm,
	useFormCreator,
} from "./FormProvider";

describe("useForm", () => {
	it("returns empty context object when used outside a provider", () => {
		const { result } = renderHook(() => useForm());
		expect(result.current).toEqual({});
	});

	it("returns the provided context value inside a FormProvider", () => {
		const getFormValues = () => ({ a: 1 });
		const setForm = vi.fn();
		const onChange = vi.fn();

		const wrapper = ({ children }: React.PropsWithChildren) => (
			<FormProvider
				getFormValues={getFormValues}
				setForm={setForm}
				onChange={onChange}
			>
				{children}
			</FormProvider>
		);

		const { result } = renderHook(() => useForm(), { wrapper });
		expect(result.current.getFormValues).toBe(getFormValues);
		expect(result.current.setForm).toBe(setForm);
		expect(result.current.onChange).toBe(onChange);
	});
});

describe("FormProvider", () => {
	it("renders children", () => {
		render(
			<FormProvider getFormValues={() => ({})} setForm={vi.fn()}>
				<div>child content</div>
			</FormProvider>,
		);

		expect(screen.getByText("child content")).not.toBeNull();
	});
});

describe("useFormCreator", () => {
	it("initializes form id as null and returns getFormValues/setForm", () => {
		const { result } = renderHook(() => useFormCreator(() => ({ a: 1 })));

		expect(result.current.id).toBeNull();
		expect(result.current.getFormValues()).toEqual({ a: 1 });
	});

	it("does not reset form on first render (didUpdate guard)", () => {
		const initialState = vi.fn(() => ({ a: 1 }));
		const { result } = renderHook(() => useFormCreator(initialState, [1]));

		expect(initialState).toHaveBeenCalledTimes(1); // only from useState initializer
		expect(result.current.id).toBeNull();
	});

	it("resets form and generates a new id when deps change", () => {
		let dep = 1;
		const initialState = () => ({ value: dep });

		const { result, rerender } = renderHook(() =>
			useFormCreator(initialState, [dep]),
		);

		expect(result.current.id).toBeNull();

		dep = 2;
		rerender();

		expect(result.current.id).not.toBeNull();
		expect(result.current.getFormValues()).toEqual({ value: 2 });
	});

	it("setForm updates form value via setInternalForm", () => {
		const { result } = renderHook(() => useFormCreator(() => ({ a: 1 })));

		act(() => {
			result.current.setForm({ a: 2 });
		});

		expect(result.current.getFormValues()).toEqual({ a: 2 });
	});
});

describe("useField", () => {
	it("reads value and calls setForm/onChange via setValue", () => {
		const onChange = vi.fn();
		const setForm = vi.fn();
		const formValues = { name: { first: "John" } };
		const getFormValues = () => formValues;

		const wrapper = ({ children }: React.PropsWithChildren) => (
			<FormProvider
				getFormValues={getFormValues}
				setForm={setForm}
				onChange={onChange}
			>
				{children}
			</FormProvider>
		);

		const { result } = renderHook(() => useField<string>("name.first"), {
			wrapper,
		});

		expect(result.current.name).toBe("name.first");
		expect(result.current.value).toBe("John");

		act(() => {
			result.current.setValue("Jane");
		});

		expect(setForm).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it("does not call onChange when it is not provided", () => {
		const setForm = vi.fn();
		const getFormValues = () => ({ name: "John" });

		const wrapper = ({ children }: React.PropsWithChildren) => (
			<FormProvider getFormValues={getFormValues} setForm={setForm}>
				{children}
			</FormProvider>
		);

		const { result } = renderHook(() => useField<string>("name"), {
			wrapper,
		});

		act(() => {
			result.current.setValue("Jane");
		});

		expect(setForm).toHaveBeenCalledTimes(1);
	});
});

describe("FieldProvider", () => {
	it("renders children and provides scoped getFormValues/setForm based on name/value", () => {
		const setValue = vi.fn();

		const Consumer = () => {
			const { getFormValues, setForm } = useForm();
			return (
				<div>
					<span>{JSON.stringify(getFormValues())}</span>
					<button type="button" onClick={() => setForm({ field: "newValue" })}>
						change
					</button>
				</div>
			);
		};

		render(
			<FieldProvider name="field" value="oldValue" setValue={setValue}>
				<Consumer />
			</FieldProvider>,
		);

		expect(screen.getByText('{"field":"oldValue"}')).not.toBeNull();

		act(() => {
			screen.getByText("change").click();
		});

		expect(setValue).toHaveBeenCalledWith("newValue");
	});

	it("does not call setValue when setValue prop is not provided", () => {
		const Consumer = () => {
			const { setForm } = useForm();
			return (
				<button type="button" onClick={() => setForm({ field: "x" })}>
					change
				</button>
			);
		};

		// Should not throw even though setValue is undefined
		render(
			<FieldProvider
				name="field"
				value="oldValue"
				setValue={undefined as unknown as (value: string) => void}
			>
				<Consumer />
			</FieldProvider>,
		);

		expect(() => {
			act(() => {
				screen.getByText("change").click();
			});
		}).not.toThrow();
	});

	it("inherits onChange from an outer FormProvider context", () => {
		const onChange = vi.fn();
		const setValue = vi.fn();

		const Consumer = () => {
			const { onChange: fieldOnChange } = useForm();
			return (
				<button type="button" onClick={() => fieldOnChange?.()}>
					trigger
				</button>
			);
		};

		render(
			<FormProvider
				getFormValues={() => ({})}
				setForm={vi.fn()}
				onChange={onChange}
			>
				<FieldProvider name="field" value="v" setValue={setValue}>
					<Consumer />
				</FieldProvider>
			</FormProvider>,
		);

		act(() => {
			screen.getByText("trigger").click();
		});

		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it("has undefined onChange when used without any outer context", () => {
		const setValue = vi.fn();
		const Consumer = () => {
			const { onChange } = useForm();
			return <span>{onChange ? "has-onchange" : "no-onchange"}</span>;
		};

		render(
			<FieldProvider name="field" value="v" setValue={setValue}>
				<Consumer />
			</FieldProvider>,
		);

		expect(screen.getByText("no-onchange")).not.toBeNull();
	});
});
