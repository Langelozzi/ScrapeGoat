import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { UserProvider, useUser } from "../../context/UserContext.jsx";

describe("UserContext (unit)", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_API_URL", "http://api.test");
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  const renderWithProvider = () =>
    render(
      <UserProvider>
        <UserConsumer />
      </UserProvider>
    );

  it("logs in and exposes user data", async () => {
    // checkSession -> not ok
    // login -> ok
    fetch
      .mockResolvedValueOnce({ ok: false, json: vi.fn().mockResolvedValue({}) })
      .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue({ email: "test@example.com" }) });

    renderWithProvider();

    const loginBtn = await screen.findByRole("button", { name: /login/i });
    await userEvent.click(loginBtn);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(fetch).toHaveBeenLastCalledWith(
      "http://api.test/api/v1/auth/login",
      expect.objectContaining({ method: "POST" })
    );
    expect(await screen.findByText(/test@example.com/i)).toBeInTheDocument();
  });

  it("surfaces login errors", async () => {
    fetch
      .mockResolvedValueOnce({ ok: false, json: vi.fn().mockResolvedValue({}) })
      .mockResolvedValueOnce({ ok: false, json: vi.fn().mockResolvedValue({ message: "bad" }) });

    renderWithProvider();

    const loginBtn = await screen.findByRole("button", { name: /login/i });
    await userEvent.click(loginBtn);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(await screen.findByText(/bad/i)).toBeInTheDocument();
  });
});

function UserConsumer() {
  const { user, login, error } = useUser();

  const handleLogin = async () => {
    try {
      await login("test@example.com", "pw");
    } catch (e) {
      // swallowed for test
    }
  };

  return (
    <div>
      <button type="button" onClick={handleLogin}>
        login
      </button>
      {user?.email && <div>{user.email}</div>}
      {error && <div>{error}</div>}
    </div>
  );
}
