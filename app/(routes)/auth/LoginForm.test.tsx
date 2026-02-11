import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginForm from "./LoginForm";
import { useRouter, useSearchParams } from "next/navigation";

const toastPromise = jest.fn();

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    promise: (...args: any[]) => toastPromise(...args),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("LoginForm", () => {
  const push = jest.fn();
  const refresh = jest.fn();

  beforeEach(() => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://example.com";
    (useRouter as jest.Mock).mockReturnValue({ push, refresh });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue("/events"),
    });
    toastPromise.mockImplementation((promiseOrFn: any) => {
      const promise =
        typeof promiseOrFn === "function" ? promiseOrFn() : promiseOrFn;
      return Promise.resolve(promise);
    });
    (globalThis.fetch as any) = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ message: "ok" }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("submits credentials and redirects", async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
      target: { name: "username", value: "alice" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { name: "password", value: "secret" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://example.com/api/auth/signin",
      {
        method: "POST",
        body: JSON.stringify({ username: "alice", password: "secret" }),
        headers: {
          "content-type": "application/json",
        },
      }
    );

    await waitFor(() => expect(push).toHaveBeenCalledWith("/events"));
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
