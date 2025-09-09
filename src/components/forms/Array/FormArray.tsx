import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { OnImageUpload, WebBuilderComponentProperty } from "types";

import { ButtonIcon } from "@/components/ButtonIcon";
import { FormProperty } from "@/components/FormProperty";
import { useField } from "@/components/FormProvider";
import { Icon } from "@/components/icons/Icon";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { getDefaultValue } from "@/utils/element";

import { FormGroup, FormHeader } from "../FormControl.styled";
import type { IFormControl } from "../types";
import { Container, ItemLabel, ItemLabelActions } from "./FormArray.styled";

type FormArrayProps = {
	autoFocus?: boolean;
	defaultValue?: unknown;
	formCreatorId: string;
	onImageUpload?: OnImageUpload;
	of: WebBuilderComponentProperty;
	testId?: string;
} & IFormControl;

export function FormArray({
	autoFocus,
	defaultValue,
	formCreatorId,
	onImageUpload,
	testId,
	label,
	name,
	of,
}: FormArrayProps) {
	const { t } = useTranslation();
	const breakpoint = useBreakpoint();
	const { setValue, value = [] } = useField<Array<unknown>>(name);
	const ofLabel = "label" in of ? of.label : t("element.array.item");
	const moveDisabled = value.length < 2;

	const keys = useMemo<string[]>(() => {
		const duplicatesMap = new Map<string, number>();

		return value.map((item) => {
			const key = JSON.stringify(item);
			const duplicates = duplicatesMap.get(key) || 0;
			duplicatesMap.set(key, duplicates + 1);

			if (duplicates) {
				return `${key}-${duplicates}`;
			}

			return key;
		});
	}, [value]);

	const onAdd = () => {
		setValue([...value, getDefaultValue(of, breakpoint)]);
	};

	const moveUp = (currentIndex: number) => () => {
		const nextValue = [...value];

		const current = nextValue[currentIndex];
		let nextIndex = currentIndex - 1;
		if (nextIndex < 0) nextIndex = nextValue.length - 1;

		const next = nextValue[nextIndex];
		nextValue[nextIndex] = current;
		nextValue[currentIndex] = next;

		setValue(nextValue);
	};

	const moveDown = (currentIndex: number) => () => {
		const nextValue = [...value];

		const current = nextValue[currentIndex];
		let nextIndex = currentIndex + 1;
		if (nextIndex >= nextValue.length) nextIndex = 0;

		const next = nextValue[nextIndex];
		nextValue[nextIndex] = current;
		nextValue[currentIndex] = next;

		setValue(nextValue);
	};

	const remove = (currentIndex: number) => () => {
		const nextValue = [...value];

		nextValue.splice(currentIndex, 1);

		setValue(nextValue);
	};

	return (
		<FormGroup>
			<FormHeader>
				<ItemLabel>
					{label}
					<ItemLabelActions>
						<ButtonIcon
							id="add"
							onClick={onAdd}
							size="small"
							tooltip={t("element.array.add")}
						>
							<Icon className="icon" icon={Icon.Plus} />
						</ButtonIcon>
					</ItemLabelActions>
				</ItemLabel>
			</FormHeader>
			<Container>
				{value.map((_, index) => (
					<FormProperty
						key={keys[index]}
						autoFocus={autoFocus}
						defaultValue={defaultValue}
						formCreatorId={formCreatorId}
						onImageUpload={onImageUpload}
						prop={
							{
								...of,
								label: (
									<ItemLabel>
										{index + 1}) {ofLabel}
										<ItemLabelActions>
											<ButtonIcon
												id="moveUp"
												disabled={moveDisabled}
												onClick={moveUp(index)}
												size="small"
												tooltip={t("element.array.moveUp")}
											>
												<Icon className="icon" icon={Icon.MoveUp} />
											</ButtonIcon>
											<ButtonIcon
												id="moveDown"
												disabled={moveDisabled}
												onClick={moveDown(index)}
												size="small"
												tooltip={t("element.array.moveDown")}
											>
												<Icon
													className="icon icon--reverse"
													icon={Icon.MoveUp}
												/>
											</ButtonIcon>
											<ButtonIcon
												id="trash"
												onClick={remove(index)}
												size="small"
												tooltip={t("element.array.delete")}
											>
												<Icon className="icon" icon={Icon.Trash} />
											</ButtonIcon>
										</ItemLabelActions>
									</ItemLabel>
								),
							} as WebBuilderComponentProperty
						}
						testId={testId}
						name={`${name}.${index}`}
					/>
				))}
			</Container>
		</FormGroup>
	);
}
