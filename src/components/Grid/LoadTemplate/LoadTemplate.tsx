import React from "react";

import { LoadTemplateForPage } from "../LoadTemplateForPage";
import { RestartTemplate } from "../RestartTemplate";

export function LoadTemplate({ children }: React.PropsWithChildren) {
	return (
		<LoadTemplateForPage>
			<RestartTemplate>{children}</RestartTemplate>
		</LoadTemplateForPage>
	);
}
