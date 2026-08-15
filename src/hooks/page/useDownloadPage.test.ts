import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mockUseBreakpoints = vi.fn();
const mockUsePageSettings = vi.fn();
const mockBuildBreakpointWithTree = vi.fn();
const mockUseBuildBreakpointWithTree = vi.fn(() => mockBuildBreakpointWithTree);
const mockUseWebBuilderProperties = vi.fn();
const mockGetPageSettings = vi.fn();

vi.mock("../useBreakpoints", () => ({
	useBreakpoints: () => mockUseBreakpoints(),
}));
vi.mock("../usePageSettings", () => ({
	usePageSettings: () => mockUsePageSettings(),
}));
vi.mock("./useBuildBreakpointWithTree", () => ({
	useBuildBreakpointWithTree: () => mockUseBuildBreakpointWithTree(),
}));
vi.mock("@/components/PropertiesProvider", () => ({
	useWebBuilderProperties: () => mockUseWebBuilderProperties(),
}));
vi.mock("@/utils/pageSettings", () => ({
	getPageSettings: (...args: never[]) => mockGetPageSettings(...args),
}));

import { useDownloadPage } from "./useDownloadPage";

const createObjectURL = vi.fn(() => "blob:mock-url");
const revokeObjectURL = vi.fn();

describe("useDownloadPage", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("downloads a page as a JSON blob with default filename", () => {
		global.URL.createObjectURL = createObjectURL;
		global.URL.revokeObjectURL = revokeObjectURL;

		mockUseBreakpoints.mockReturnValue([{ id: "bp-1" }, { id: "bp-2" }]);
		mockUsePageSettings.mockReturnValue({ id: "page-1" });
		mockGetPageSettings.mockReturnValue({ id: "page-1" });
		mockUseWebBuilderProperties.mockReturnValue({});
		mockBuildBreakpointWithTree.mockImplementation((breakpoint) => {
			if (breakpoint.id === "bp-1")
				return { ...breakpoint, view: { some: "tree" } };
			return { ...breakpoint, view: null };
		});

		const clickSpy = vi
			.spyOn(HTMLAnchorElement.prototype, "click")
			.mockImplementation(() => {});
		const appendSpy = vi.spyOn(document.body, "appendChild");
		const removeSpy = vi.spyOn(document.body, "removeChild");

		const { result } = renderHook(() => useDownloadPage());

		result.current();

		expect(createObjectURL).toHaveBeenCalled();
		expect(clickSpy).toHaveBeenCalled();
		expect(appendSpy).toHaveBeenCalled();
		expect(removeSpy).toHaveBeenCalled();
		expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");

		const appendedLink = appendSpy.mock.calls.find(
			(call) => (call[0] as HTMLElement).tagName === "A",
		)?.[0] as HTMLAnchorElement;
		expect(appendedLink.download).toBe("builder.json");

		clickSpy.mockRestore();
		appendSpy.mockRestore();
		removeSpy.mockRestore();
	});

	it("uses onBeforeDownloadPage result to change filename and page content", () => {
		global.URL.createObjectURL = createObjectURL;
		global.URL.revokeObjectURL = revokeObjectURL;

		mockUseBreakpoints.mockReturnValue([]);
		mockUsePageSettings.mockReturnValue({ id: "page-1" });
		mockGetPageSettings.mockReturnValue({ id: "page-1" });
		mockBuildBreakpointWithTree.mockImplementation((b) => b);

		const onBeforeDownloadPage = vi.fn(() => ({
			filename: "custom.json",
			page: { id: "page-transformed" },
		}));
		mockUseWebBuilderProperties.mockReturnValue({ onBeforeDownloadPage });

		const clickSpy = vi
			.spyOn(HTMLAnchorElement.prototype, "click")
			.mockImplementation(() => {});
		const appendSpy = vi.spyOn(document.body, "appendChild");
		const removeSpy = vi.spyOn(document.body, "removeChild");

		const { result } = renderHook(() => useDownloadPage());
		result.current();

		expect(onBeforeDownloadPage).toHaveBeenCalled();
		const appendedLink = appendSpy.mock.calls.find(
			(call) => (call[0] as HTMLElement).tagName === "A",
		)?.[0] as HTMLAnchorElement;
		expect(appendedLink.download).toBe("custom.json");

		clickSpy.mockRestore();
		appendSpy.mockRestore();
		removeSpy.mockRestore();
	});

	it("ignores onBeforeDownloadPage result when it isn't an object", () => {
		global.URL.createObjectURL = createObjectURL;
		global.URL.revokeObjectURL = revokeObjectURL;

		mockUseBreakpoints.mockReturnValue([]);
		mockUsePageSettings.mockReturnValue({ id: "page-1" });
		mockGetPageSettings.mockReturnValue({ id: "page-1" });
		mockBuildBreakpointWithTree.mockImplementation((b) => b);

		const onBeforeDownloadPage = vi.fn(() => undefined);
		mockUseWebBuilderProperties.mockReturnValue({ onBeforeDownloadPage });

		const clickSpy = vi
			.spyOn(HTMLAnchorElement.prototype, "click")
			.mockImplementation(() => {});
		const appendSpy = vi.spyOn(document.body, "appendChild");
		const removeSpy = vi.spyOn(document.body, "removeChild");

		const { result } = renderHook(() => useDownloadPage());
		result.current();

		const appendedLink = appendSpy.mock.calls.find(
			(call) => (call[0] as HTMLElement).tagName === "A",
		)?.[0] as HTMLAnchorElement;
		expect(appendedLink.download).toBe("builder.json");

		clickSpy.mockRestore();
		appendSpy.mockRestore();
		removeSpy.mockRestore();
	});

	it("only overrides the page when onBeforeDownloadPage returns just a page (no filename)", () => {
		global.URL.createObjectURL = createObjectURL;
		global.URL.revokeObjectURL = revokeObjectURL;

		mockUseBreakpoints.mockReturnValue([]);
		mockUsePageSettings.mockReturnValue({ id: "page-1" });
		mockGetPageSettings.mockReturnValue({ id: "page-1" });
		mockBuildBreakpointWithTree.mockImplementation((b) => b);

		const onBeforeDownloadPage = vi.fn(() => ({
			page: { id: "page-transformed" },
		}));
		mockUseWebBuilderProperties.mockReturnValue({ onBeforeDownloadPage });

		const clickSpy = vi
			.spyOn(HTMLAnchorElement.prototype, "click")
			.mockImplementation(() => {});
		const appendSpy = vi.spyOn(document.body, "appendChild");
		const removeSpy = vi.spyOn(document.body, "removeChild");

		const { result } = renderHook(() => useDownloadPage());
		result.current();

		const appendedLink = appendSpy.mock.calls.find(
			(call) => (call[0] as HTMLElement).tagName === "A",
		)?.[0] as HTMLAnchorElement;
		expect(appendedLink.download).toBe("builder.json");

		clickSpy.mockRestore();
		appendSpy.mockRestore();
		removeSpy.mockRestore();
	});

	it("only overrides the filename when onBeforeDownloadPage returns just a filename (no page)", () => {
		global.URL.createObjectURL = createObjectURL;
		global.URL.revokeObjectURL = revokeObjectURL;

		mockUseBreakpoints.mockReturnValue([]);
		mockUsePageSettings.mockReturnValue({ id: "page-1" });
		mockGetPageSettings.mockReturnValue({ id: "page-1" });
		mockBuildBreakpointWithTree.mockImplementation((b) => b);

		const onBeforeDownloadPage = vi.fn(() => ({
			filename: "renamed.json",
		}));
		mockUseWebBuilderProperties.mockReturnValue({ onBeforeDownloadPage });

		const clickSpy = vi
			.spyOn(HTMLAnchorElement.prototype, "click")
			.mockImplementation(() => {});
		const appendSpy = vi.spyOn(document.body, "appendChild");
		const removeSpy = vi.spyOn(document.body, "removeChild");

		const { result } = renderHook(() => useDownloadPage());
		result.current();

		const appendedLink = appendSpy.mock.calls.find(
			(call) => (call[0] as HTMLElement).tagName === "A",
		)?.[0] as HTMLAnchorElement;
		expect(appendedLink.download).toBe("renamed.json");

		clickSpy.mockRestore();
		appendSpy.mockRestore();
		removeSpy.mockRestore();
	});
});
