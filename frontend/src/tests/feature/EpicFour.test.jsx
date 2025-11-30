import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Results from "../../Results.jsx";
import Home from "../../Home.jsx";

let mockNavigate = vi.fn();
let mockLocation = { pathname: "/results", state: { scrapeData: { data: { foo: "bar" } } } };
let retrievalContext = {};
let userContext = {};
let configContext = {};

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
    useMatch: () => false,
  };
});

vi.mock("../../context/UserContext.jsx", () => ({
  useUser: () => userContext,
}));

vi.mock("../../context/RetrievalInstructionContext.jsx", () => ({
  useRetrievalInstructions: () => retrievalContext,
}));

vi.mock("../../context/ConfigContext.jsx", () => ({
  useConfigs: () => configContext,
}));

const resetContexts = () => {
  mockNavigate = vi.fn();
  mockLocation = { pathname: "/results", state: { scrapeData: { data: { foo: "bar" } } } };
  retrievalContext = {
    url: "https://example.com",
    name: "My Config",
    description: "desc",
    retrievalInstructions: [{ output: { key: "title", location: "body" } }],
    setFlow: vi.fn(),
    flow: "new",
  };
  userContext = { user: { id: 1 }, loading: false };
  configContext = { postConfig: vi.fn() };
  global.fetch = vi.fn();
  vi.stubEnv("VITE_API_URL", "http://api.test");
};

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});


describe("Epic Four", () => {
  beforeEach(() => {
    resetContexts();
  });

  it("Feature 4.1: Download scraped data after a run", async () => {
    global.URL.createObjectURL = vi.fn().mockReturnValue("blob:url");
    global.URL.revokeObjectURL = vi.fn();
    const blobResponse = { blob: vi.fn().mockResolvedValue(new Blob(["data"])) };
    fetch.mockResolvedValue(blobResponse);

    render(
      <MemoryRouter initialEntries={["/results"]}>
        <Results />
      </MemoryRouter>
    );

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click");

    await userEvent.click(screen.getByRole("button", { name: /export as json/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/v1/scraper/export/json?filename=data.json",
      expect.objectContaining({ method: "POST" })
    );
    expect(clickSpy).toHaveBeenCalled();
  });

  it("Feature 4.2: Save scraped data to account without downloading", async () => {
    const scrapeData = { data: { foo: "bar" } };
    fetch.mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue(scrapeData) });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /scrape/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(fetch).toHaveBeenCalledWith(
      "http://api.test/api/v1/scraper/scrape",
      expect.objectContaining({ method: "POST" })
    );
  });
});
