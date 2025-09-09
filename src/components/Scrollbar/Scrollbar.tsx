import React from "react";

import { Container } from "./Scrollbar.styled";

export function Scrollbar({ children }: React.PropsWithChildren) {
	return <Container>{children}</Container>;
}
