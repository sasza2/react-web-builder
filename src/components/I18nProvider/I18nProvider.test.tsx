import { render, screen } from "@testing-library/react";
import i18n from "i18next";
import React from "react";
import { initReactI18next } from "react-i18next";
import { describe, expect, it, vi } from "vitest";

import { useInitI18n } from "@/hooks/useInitI18n";

vi.mock("@/hooks/useInitI18n", () => ({
	useInitI18n: vi.fn(),
}));

import { I18nProvider } from "./I18nProvider";

const mockedUseInitI18n = vi.mocked(useInitI18n);

describe("I18nProvider", () => {
	it("renders children wrapped with I18nextProvider using the initialized instance", async () => {
		const instance = i18n.createInstance();
		await instance.use(initReactI18next).init({
			lng: "en",
			resources: { en: { common: {} } },
		});
		mockedUseInitI18n.mockReturnValue(instance);

		render(
			<I18nProvider>
				<div>child</div>
			</I18nProvider>,
		);

		expect(await screen.findByText("child")).not.toBeNull();
	});
});
