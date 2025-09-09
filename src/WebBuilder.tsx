import React from "react";
import type { WebBuilderProps } from "types";

import { ConfigurationProvider } from "@/components/ConfigurationProvider";
import { ElementsProvider } from "@/components/ElementsProvider";
import { Grid } from "@/components/Grid";
import { GridAPIProvider } from "@/components/GridAPIProvider";
import { Navbar, NavbarProvider } from "@/components/Navbar";
import { PropertiesProvider } from "@/components/PropertiesProvider";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/SidebarProvider";
import { StyleProvider } from "@/components/StyleProvider";
import { WebBuilderSizeProvider } from "@/components/WebBuilderSize";

import { AutoSave } from "./components/AutoSave";
import { BeforeUnload } from "./components/BeforeUnload";
import { ComponentsProvider } from "./components/ComponentsProvider";
import { BuilderElementAnchor } from "./components/ElementAnchor/BuilderElementAnchor";
import { BuilderElementContainer } from "./components/ElementContainer/BuilderElementContainer";
import { LoadTemplate } from "./components/Grid/LoadTemplate";
import { BuilderHints } from "./components/Hints";
import { HistoryOfElementsExtras } from "./components/HistoryOfElementsExtras";
import { I18nProvider } from "./components/I18nProvider";
import { PrerenderDefaultContainer } from "./components/PrerenderDefaultContainer";
import { ToastContainer } from "./components/ToastContainer";
import { LoadFont } from "./LoadFont";
import { StoreProvider } from "./store/StoreProvider";
import { ViewGlobalStyles } from "./View.styled";
import { GlobalStyles } from "./WebBuilder.styled";

function WebBuilder(props: WebBuilderProps) {
	return (
		<PropertiesProvider {...props}>
			<ComponentsProvider
				{...props}
				components={props.components}
				elementAnchor={BuilderElementAnchor}
				elementContainer={BuilderElementContainer}
			>
				<StoreProvider>
					<ConfigurationProvider>
						<GridAPIProvider>
							<ElementsProvider>
								<SidebarProvider>
									<WebBuilderSizeProvider>
										<NavbarProvider>
											<AutoSave>
												<StyleProvider>
													<I18nProvider>
														<HistoryOfElementsExtras />
														<LoadTemplate>
															<BeforeUnload />
															<Navbar />
															<Grid />
															<Sidebar />
															<BuilderHints />
															<ToastContainer />
															<PrerenderDefaultContainer />
														</LoadTemplate>
													</I18nProvider>
													<LoadFont />
													<GlobalStyles />
													<ViewGlobalStyles />
												</StyleProvider>
											</AutoSave>
										</NavbarProvider>
									</WebBuilderSizeProvider>
								</SidebarProvider>
							</ElementsProvider>
						</GridAPIProvider>
					</ConfigurationProvider>
				</StoreProvider>
			</ComponentsProvider>
		</PropertiesProvider>
	);
}

export default WebBuilder;
