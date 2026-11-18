import type { ReactNode } from "react";
import { act, render, waitFor } from "@testing-library/react";
import { getCsrfToken, signIn, signOut } from "next-auth/react";
import { WalletSessionProvider } from "./WalletSessionProvider";

const address = "0x00000000000000000000000000000000000000aA";
const otherAddress = "0x00000000000000000000000000000000000000bb";
let mockAccount: {
  status: "connected" | "connecting" | "reconnecting" | "disconnected";
  address?: string;
};
const mockConfig = {};
const mockRemoveQueries = jest.fn();
let mockAdapter: {
  signOut: () => Promise<void>;
  getNonce: () => Promise<string>;
  createMessage: (args: {
    address: string;
    chainId: number;
    nonce: string;
  }) => string;
  verify: (args: { message: string; signature: string }) => Promise<boolean>;
};

jest.mock("wagmi", () => ({
  useConfig: () => mockConfig,
  useAccount: () => mockAccount,
}));
jest.mock("wagmi/actions", () => ({ getAccount: () => mockAccount }));
jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ removeQueries: mockRemoveQueries }),
}));
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { address: "0x00000000000000000000000000000000000000aa" },
    status: "authenticated",
  }),
  signOut: jest.fn(async () => ({ url: "/" })),
  signIn: jest.fn(async () => ({ ok: true })),
  getCsrfToken: jest.fn(async () => "12345678"),
}));
jest.mock("@rainbow-me/rainbowkit", () => ({
  createAuthenticationAdapter: (adapter: typeof mockAdapter) => adapter,
  RainbowKitAuthenticationProvider: ({
    adapter,
    children,
  }: {
    adapter: typeof mockAdapter;
    children: ReactNode;
  }) => {
    mockAdapter = adapter;
    return <>{children}</>;
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockAccount = { status: "disconnected" };
});

const content = () => (
  <WalletSessionProvider authenticate synchronizeSession>
    Wallet
  </WalletSessionProvider>
);

it("keeps a signed session through initial hydration, reconnection and Rabby's unchanged account events", async () => {
  const view = render(content());
  await act(() => mockAdapter.signOut());
  mockAccount = { status: "reconnecting", address };
  view.rerender(content());
  await act(() => mockAdapter.signOut());
  mockAccount = { status: "connected", address };
  view.rerender(content());
  await act(() => mockAdapter.signOut());
  expect(signOut).not.toHaveBeenCalled();
  expect(mockRemoveQueries).not.toHaveBeenCalled();
});

it("does not erase authentication if a locked extension cannot reconnect", async () => {
  mockAccount = { status: "reconnecting", address };
  const view = render(content());
  mockAccount = { status: "disconnected" };
  view.rerender(content());
  await act(() => mockAdapter.signOut());
  expect(signOut).not.toHaveBeenCalled();
});

it("signs out after an established wallet disconnects", async () => {
  mockAccount = { status: "connected", address };
  const view = render(content());
  mockAccount = { status: "disconnected" };
  view.rerender(content());
  await act(() => mockAdapter.signOut());
  expect(signOut).toHaveBeenCalledWith({ redirect: false });
  expect(mockRemoveQueries).toHaveBeenCalledWith({ queryKey: ["cms-user"] });
});

it("invalidates authentication when the actual account changes", async () => {
  mockAccount = { status: "connected", address };
  render(content());
  // Wallet events may precede a React render; the callback must read live state.
  mockAccount = { status: "connected", address: otherAddress };
  await act(() => mockAdapter.signOut());
  expect(signOut).toHaveBeenCalledTimes(1);
});

it("also catches a changed account after reconnect settles", async () => {
  mockAccount = { status: "reconnecting", address: otherAddress };
  const view = render(content());
  expect(signOut).not.toHaveBeenCalled();
  mockAccount = { status: "connected", address: otherAddress };
  view.rerender(content());
  await waitFor(() =>
    expect(signOut).toHaveBeenCalledWith({ redirect: false }),
  );
});

it("preserves the existing SIWE nonce, message and server verification flow", async () => {
  render(content());
  const nonce = await mockAdapter.getNonce();
  const message = mockAdapter.createMessage({
    address: address.toLowerCase(),
    chainId: 1,
    nonce,
  });
  expect(getCsrfToken).toHaveBeenCalledTimes(1);
  expect(message).toContain("Nonce: 12345678");
  expect(message).toContain("Chain ID: 1");
  expect(message).toContain("Put thy rune on the door to Sign in");
  expect(
    await mockAdapter.verify({ message, signature: "test-signature" }),
  ).toBe(true);
  expect(signIn).toHaveBeenCalledWith("credentials", {
    message,
    signature: "test-signature",
    redirect: false,
  });
});
