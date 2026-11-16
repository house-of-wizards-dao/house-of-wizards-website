import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import type { BreadfriendGif } from "@/data/breadfriend";
import { fetchGiphyChannelGifs } from "@/lib/breadfriend";
import { BreadfriendContent } from "./BreadfriendContent";
import BreadfriendPage from "./page";

jest.mock("@/lib/breadfriend", () => ({ fetchGiphyChannelGifs: jest.fn() }));
jest.mock("@/hooks/useToast", () => ({
  useToast: () => ({ success: jest.fn(), info: jest.fn() }),
}));

const fetchGifs = jest.mocked(fetchGiphyChannelGifs);
const gif = (id: string): BreadfriendGif => ({
  id,
  title: id,
  platform: "giphy",
  previewUrl: `https://media.giphy.com/media/${id}/200w.webp`,
  downloadUrl: `https://media.giphy.com/media/${id}/giphy.gif`,
  pageUrl: `https://giphy.com/gifs/${id}`,
});

beforeEach(() => fetchGifs.mockReset());

it("renders the page and channel links on the server without calling GIPHY", () => {
  const html = renderToString(<BreadfriendPage />);
  expect(html).toContain("Breadfriend");
  expect(html).toContain("https://giphy.com/thehouseofwizards");
  expect(html).toContain("https://klipy.com/profile/thehouseofwizards");
  expect(fetchGifs).not.toHaveBeenCalled();
});

it("shows loading feedback while keeping channel links available", () => {
  fetchGifs.mockImplementation(() => new Promise(() => {}));
  render(<BreadfriendContent />);
  expect(screen.getByRole("status")).toHaveTextContent("Loading GIFs");
  expect(screen.getByRole("link", { name: "GIPHY" })).toHaveAttribute(
    "href",
    "https://giphy.com/thehouseofwizards",
  );
});

it("renders API results in order, including repeated entries", async () => {
  fetchGifs.mockResolvedValue([gif("second"), gif("first"), gif("second")]);
  render(<BreadfriendContent />);
  const images = await screen.findAllByRole("img");
  expect(images.map((image) => image.getAttribute("alt"))).toEqual([
    "second",
    "first",
    "second",
  ]);
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: "Download" })).toHaveLength(3);
});

it("shows channel links instead of saved media URLs after a failed load", async () => {
  fetchGifs.mockResolvedValue([]);
  render(<BreadfriendContent />);
  expect(
    await screen.findByText("GIFs are unavailable right now."),
  ).toBeInTheDocument();
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "KLIPY" })).toBeInTheDocument();
});

it("cancels on unmount before a pending result can update the gallery", async () => {
  let finish: (gifs: BreadfriendGif[]) => void = () => {};
  fetchGifs.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const { unmount } = render(<BreadfriendContent />);
  const signal = fetchGifs.mock.calls[0][0];
  unmount();
  expect(signal?.aborted).toBe(true);
  await act(async () => finish([gif("late")]));
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
});
