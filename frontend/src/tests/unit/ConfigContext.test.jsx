import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ConfigProvider, useConfigs } from "../../context/ConfigContext.jsx";

vi.mock("../../context/RetrievalInstructionContext.jsx", () => ({
  useRetrievalInstructions: () => ({
    retrievalInstructions: [{ output: { key: "title", location: "body" } }],
    url: "https://example.com",
    description: "desc",
  }),
}));

const API = "http://api.test";

describe("ConfigContext (unit)", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_API_URL", API);
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  const renderWithProvider = (node) => render(<ConfigProvider>{node}</ConfigProvider>);

  it("fetches configs on mount", async () => {
    const configsResponse = [{ id: 1 }];
    fetch.mockResolvedValue({ json: vi.fn().mockResolvedValue(configsResponse) });

    renderWithProvider(<ConfigsConsumer />);

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(`${API}/api/v1/configs/`, { credentials: "include" })
    );
    expect(screen.getByTestId("configs").textContent).toContain("[{\"id\":1}]");
  });

  it("posts a config and refetches", async () => {
    const firstFetch = { json: vi.fn().mockResolvedValue([]) };
    const postResult = { ok: true, json: vi.fn().mockResolvedValue({ id: 99 }) };
    const secondFetch = { json: vi.fn().mockResolvedValue([{ id: 99 }]) };

    fetch
      .mockResolvedValueOnce(firstFetch) // initial fetchConfigs
      .mockResolvedValueOnce(postResult) // postConfig
      .mockResolvedValueOnce(secondFetch); // refetch

    renderWithProvider(<PostConsumer />);

    await userEvent.click(screen.getByRole("button", { name: /post/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      `${API}/api/v1/configs/`,
      expect.objectContaining({ method: "POST", credentials: "include" })
    );
  });

  it("propagates errors on failed post", async () => {
    const firstFetch = { json: vi.fn().mockResolvedValue([]) };
    const fail = { ok: false, status: 500, json: vi.fn().mockResolvedValue({}) };

    fetch.mockResolvedValueOnce(firstFetch).mockResolvedValueOnce(fail);

    renderWithProvider(<ErrorConsumer />);

    await userEvent.click(screen.getByRole("button", { name: /post/i }));
    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
  });
});

function ConfigsConsumer() {
  const { configs } = useConfigs();
  return <div data-testid="configs">{configs}</div>;
}

function PostConsumer() {
  const { postConfig } = useConfigs();
  const handlePost = () => postConfig("My Config");
  return <button onClick={handlePost}>post</button>;
}

function ErrorConsumer() {
  const { postConfig } = useConfigs();
  const handlePost = async () => {
    try {
      await postConfig("bad");
    } catch (e) {
      // ignore
    }
  };
  return (
    <div>
      <button onClick={handlePost}>post</button>
      <div>error</div>
    </div>
  );
}
