import React from "react";

import { AddBreakpoint, EditBreakpoint } from "@/components/BreakpointsForm";
import { Configuration } from "@/components/Configuration";
import { useWebBuilderSizeHeight } from "@/components/WebBuilderSize";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { useAppSelector } from "@/store/useAppSelector";
import { assignTestProp } from "@/utils/tests";

import { useComponentsProperty } from "../ComponentsProvider";
import { EditProperties } from "../EditProperties";
import { ErrorBoundary } from "../ErrorBoundary";
import { PageSettings } from "../PageSettings";
import { SelectNewElement } from "../SelectNewElement";
import { SidebarView, useSidebarRef } from "../SidebarProvider/SidebarProvider";
import { Modal } from "./Modal";
import { Resize } from "./Resize";
import { Container } from "./Sidebar.styled";

export function Sidebar() {
	const components = useComponentsProperty();
	const sidebar = useAppSelector((state) => state.sidebar);
	const sidebarRef = useSidebarRef();
	const height = useWebBuilderSizeHeight();
	const breakpoints = useBreakpoints();

	const renderContent = () => {
		switch (sidebar.view) {
			case SidebarView.AddBreakpoint:
				return <AddBreakpoint />;
			case SidebarView.EditBreakpoint:
				return <EditBreakpoint />;
			case SidebarView.EditElement:
				return <EditProperties components={components} />;
			case SidebarView.Configuration:
				return <Configuration />;
			case SidebarView.PageSettings:
				return <PageSettings />;
			default:
				if (!breakpoints.length) return <AddBreakpoint />;
				return <SelectNewElement components={components} />;
		}
	};

	return (
		<>
			<Container
				className="web-builder-sidebar"
				$height={height}
				ref={sidebarRef}
				{...assignTestProp("sidebar")}
			>
				<ErrorBoundary key={sidebar.view}>{renderContent()}</ErrorBoundary>
			</Container>
			<Resize height={height} />
			<Modal />
		</>
	);
}
