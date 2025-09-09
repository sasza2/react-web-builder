import React from "react";

import { useSidebarModalRef } from "@/components/SidebarProvider";

import { Container } from "./Modal.styled";

export function Modal() {
	const modalRef = useSidebarModalRef();
	return <Container ref={modalRef} />;
}
