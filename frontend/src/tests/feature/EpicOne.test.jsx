import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import ConfigEditor from "../../ConfigEditor.jsx";
import NodeSelection from "../../components/NodeSelection.jsx";
import Home from "../../Home.jsx";

let mockNavigate = vi.fn();
let mockLocation = { pathname: "/configs/new", state: { from: "/" } };
let retrievalContext = {};
let configContext = {};
let userContext = {};

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
  ConfigProvider: ({ children }) => <>{children}</>,
}));

vi.mock("../../components/DomTree.jsx", () => ({
  default: () => <div data-testid="dom-tree" />,
}));

const resetContexts = () => {
  mockNavigate = vi.fn();
  mockLocation = { pathname: "/configs/new", state: { from: "/" } };
  userContext = { user: { id: 1 }, loading: false };

  retrievalContext = {
    url: "https://example.com",
    setUrl: vi.fn(),
    tree: null,
    setTree: vi.fn(),
    lastBuiltUrlRef: { current: "" },
    name: "My Config",
    setName: vi.fn(),
    description: "desc",
    setDescription: vi.fn(),
    retrievalInstructions: [
      {
        node_query: "SCRAPE //p",
        output: { key: "paragraph", location: "body" },
        _preview: { tag_type: "p" },
      },
    ],
    setRetrievalInstructions: vi.fn(),
    addInstruction: vi.fn(),
    setKey: vi.fn(),
    deleteInstruction: vi.fn(),
    clearInstructions: vi.fn(),
    resetConfig: vi.fn(),
    setFlow: vi.fn(),
    flow: "new",
  };

  configContext = {
    configs: JSON.stringify([]),
    postConfig: vi.fn().mockResolvedValue({ id: 1 }),
    updateConfig: vi.fn(),
    deleteConfig: vi.fn(),
    fetchConfigs: vi.fn(),
  };

  global.fetch = vi.fn();
  vi.stubEnv("VITE_API_URL", "http://api.test");
};

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("Epic One", () => {
  beforeEach(() => {
    resetContexts();
  });

  it("Feature 1.1/1.2: Provide a URL and render the site structure as a tree", async () => {
    fetch.mockResolvedValue({ json: vi.fn().mockResolvedValue({ root: { id: 1 } }) });

    render(
      <MemoryRouter initialEntries={["/configs/new"]}>
        <ConfigEditor />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByPlaceholderText(/https:\/\//i), "example.org");
    await userEvent.click(screen.getByRole("button", { name: /build tree/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(fetch).toHaveBeenCalledWith(
      "http://api.test/api/v1/scraper/dom-tree/build",
      expect.objectContaining({ method: "POST" })
    );
    expect(screen.getByTestId("dom-tree")).toBeInTheDocument();
  });

  it("Feature 1.3: Assign IDs/labels to selected nodes", async () => {
    render(<NodeSelection />);

    const keyInput = screen.getByPlaceholderText(/enter key/i);
    fireEvent.change(keyInput, { target: { value: "product_id" } });

    expect(retrievalContext.setKey).toHaveBeenLastCalledWith(0, "product_id");

    const deleteBtn = screen.getByRole("button");
    await userEvent.click(deleteBtn);
    expect(retrievalContext.deleteInstruction).toHaveBeenCalledWith(0);
  });

  it("Feature 1.4: Retrieve scraped data via configuration", async () => {
    const scrapeData = { data: { foo: "bar" } };
    fetch.mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue(scrapeData) });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /scrape/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(mockNavigate).toHaveBeenCalledWith(
      "/results",
      expect.objectContaining({ state: { scrapeData } })
    );
  });

  it("Feature 1.5: Save scraper configuration for reuse (JSON payload)", async () => {
    mockLocation = { pathname: "/configs/new", state: { from: "/configs" } };

    render(
      <MemoryRouter initialEntries={["/configs/new"]}>
        <ConfigEditor />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /save and continue/i }));
    await waitFor(() => expect(configContext.postConfig).toHaveBeenCalled());
  });
});
