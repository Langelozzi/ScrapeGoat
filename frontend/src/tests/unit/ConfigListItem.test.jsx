import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import ConfigListItem from "../../components/ConfigListItem.jsx";

let mockNavigate = vi.fn();
let mockLocation = { pathname: "/configs", state: {} };
let mockConfigsCtx = {};
let mockRetrievalCtx = {};

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

vi.mock("../../context/ConfigContext.jsx", () => ({
  useConfigs: () => mockConfigsCtx,
}));

vi.mock("../../context/RetrievalInstructionContext.jsx", () => ({
  useRetrievalInstructions: () => mockRetrievalCtx,
}));

const theme = createTheme();
const renderWithTheme = (ui) => render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const resetMocks = () => {
  mockNavigate = vi.fn();
  mockLocation = { pathname: "/configs", state: {} };
  mockConfigsCtx = { deleteConfig: vi.fn() };
  mockRetrievalCtx = {
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

describe("ConfigListItem (unit)", () => {
  beforeEach(() => resetMocks());

  it("selects a saved config in select mode", async () => {
    const cfg = { id: 1, name: "Profile", url: "https://x.com", retrieval_instructions: [] };

    renderWithTheme(
      <MemoryRouter>
        <ConfigListItem cfg={cfg} index={0} isOpen={false} onToggle={() => {}} isSelectMode />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /select/i }));

    expect(mockRetrievalCtx.setFlow).toHaveBeenCalledWith("saved");
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("confirms deletion of a saved config", async () => {
    const cfg = { id: 2, name: "Delete me", retrieval_instructions: [] };

    renderWithTheme(
      <MemoryRouter>
        <ConfigListItem cfg={cfg} index={0} isOpen={false} onToggle={() => {}} />
      </MemoryRouter>
    );

    const deleteIcon = screen.getByTestId("DeleteOutlineIcon");
    await userEvent.click(deleteIcon.closest("button"));
    await userEvent.click(screen.getByRole("button", { name: /^delete$/i }));
    await waitFor(() => expect(mockConfigsCtx.deleteConfig).toHaveBeenCalledWith(2));
  });
});
