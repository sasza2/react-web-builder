import React, { createContext, useContext, useMemo } from "react";

type ElementOptionsProps = {
	applyPaddingBottomToElements: boolean;
} & React.PropsWithChildren;

const ElementOptionsContext = createContext<ElementOptionsProps>({
	applyPaddingBottomToElements: true,
});

export const useElementOptions = (): ElementOptionsProps => {
	const context = useContext(ElementOptionsContext);
	return context;
};

export function ElementOptionsProvider({
	applyPaddingBottomToElements,
	children,
}: ElementOptionsProps) {
	const value = useMemo<ElementOptionsProps>(
		() => ({
			applyPaddingBottomToElements,
		}),
		[applyPaddingBottomToElements],
	);

	return (
		<ElementOptionsContext.Provider value={value}>
			{children}
		</ElementOptionsContext.Provider>
	);
}
