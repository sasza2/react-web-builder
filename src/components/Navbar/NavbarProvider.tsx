import React, { createContext, useContext, useMemo, useState } from "react";

enum ScrollMode {
	Scroll,
	Zoom,
}

type SetWheelMode = (wheelMode: ScrollMode) => void;

type NavbarContextProps = {
	wheelMode: ScrollMode;
	setWheelMode: SetWheelMode;
};

const NavbarContext = createContext({} as NavbarContextProps);

export const useNavbarWheelMode = (): [ScrollMode, SetWheelMode] => {
	const { wheelMode, setWheelMode } = useContext(NavbarContext);
	return [wheelMode, setWheelMode];
};

export function NavbarProvider({ children }: React.PropsWithChildren) {
	const [wheelMode, setWheelMode] = useState(ScrollMode.Scroll);

	const value = useMemo(
		() => ({
			wheelMode,
			setWheelMode,
		}),
		[wheelMode, setWheelMode],
	);

	return (
		<NavbarContext.Provider value={value}>{children}</NavbarContext.Provider>
	);
}
