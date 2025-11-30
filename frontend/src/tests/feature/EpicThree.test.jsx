import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Configs from "../../Configs.jsx";

let mockNavigate = vi.fn();
let mockLocation = { pathname: "/configs", state: {} };
let userContext = {};
let configContext = {};
let retrievalContext = {};

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

vi.mock("../../context/ConfigContext.jsx", () => ({
  useConfigs: () => configContext,
}));

vi.mock("../../context/RetrievalInstructionContext.jsx", () => ({
  useRetrievalInstructions: () => retrievalContext,
}));

const resetContexts = () => {
  mockNavigate = vi.fn();
  mockLocation = { pathname: "/configs", state: {} };

  userContext = { user: null, loading: false };
  configContext = { configs: JSON.stringify([]) };
  retrievalContext = {
    resetConfig: vi.fn(),
    setUrl: vi.fn(),
    setName: vi.fn(),
    setDescription: vi.fn(),
    setRetrievalInstructions: vi.fn(),
    setFlow: vi.fn(),
    setTree: vi.fn(),
    flow: null,
  };
};

describe("Epic Three", () => {
  beforeEach(() => resetContexts());

  it("Feature 3.1: Secure account access requires login", () => {
    render(
      <MemoryRouter initialEntries={["/configs"]}>
        <Configs />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /login to view your configs/i })).toBeInTheDocument();
  });

  it("Feature 3.2: Persisted configs appear for logged-in users", () => {
    userContext = { user: { id: 1, email: "user@example.com" }, loading: false };
    configContext = {
      configs: JSON.stringify([{ id: 1, name: "Saved Config 1", retrieval_instructions: [] }]),
    };

    render(
      <MemoryRouter initialEntries={["/configs"]}>
        <Configs />
      </MemoryRouter>
    );

    expect(screen.getByText(/saved config 1/i)).toBeInTheDocument();
  });

  it("Feature 3.3: View and load saved scraper configurations", async () => {
    userContext = { user: { id: 1 }, loading: false };
    configContext = {
      configs: JSON.stringify([{ id: 2, name: "Profile", url: "https://x.com", retrieval_instructions: [] }]),
    };
    mockLocation = { pathname: "/configs/select", state: {} };

    render(
      <MemoryRouter initialEntries={["/configs/select"]}>
        <Configs />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /select/i }));

    expect(retrievalContext.setFlow).toHaveBeenCalledWith("saved");
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });
});
