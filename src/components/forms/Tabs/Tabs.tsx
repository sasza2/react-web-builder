import React from "react";

import { useField } from "@/components/FormProvider";

import type { IFormControl } from "../types";
import { Container, Tab } from "./Tabs.styled";

type TabsProps = {
	items: string[];
} & IFormControl;

export function Tabs({ items, name }: TabsProps) {
	const { setValue, value } = useField<string>(name);

	return (
		<Container>
			{items.map((item) => (
				<Tab
					key={item}
					onClick={(e) => {
						e.preventDefault();
						setValue(item);
					}}
					$selected={item === value}
				>
					{item}
				</Tab>
			))}
		</Container>
	);
}
