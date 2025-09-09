import React, { createContext, useContext } from "react";
import type { BuilderCommonProps, ViewProps, WebBuilderProps } from "types";

const PropertiesContext = createContext({} as BuilderCommonProps);

export const useProperties = (): BuilderCommonProps => {
	const props = useContext(PropertiesContext);
	return props;
};

export const useViewProperties = () => {
	const props = useContext(PropertiesContext) as ViewProps;
	return props;
};

export const useWebBuilderProperties = (): WebBuilderProps => {
	const props = useContext(PropertiesContext) as WebBuilderProps;
	return props;
};

export function PropertiesProvider({
	children,
	...props
}: React.PropsWithChildren<BuilderCommonProps>) {
	return (
		<PropertiesContext.Provider value={props}>
			{children}
		</PropertiesContext.Provider>
	);
}
