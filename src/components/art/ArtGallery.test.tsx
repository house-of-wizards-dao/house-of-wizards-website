import { useSyncExternalStore, type ReactNode } from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import type { ArtCatalog } from "@/types/art";
import { ArtGallery } from "./ArtGallery";

const catalog: ArtCatalog = {
  artists: [
    {
      id: "artist",
      name: "Shadow",
      portfolio_url: null,
      profile_image_bucket: null,
      profile_image_path: null,
      avatarUrl: null,
    },
  ],
  artworks: ["First spell", "Second spell"].map((title, i) => ({
    id: String(i),
    artist_id: "artist",
    title,
    description: null,
    funded: true,
    medium: "Illustration",
    external_url: null,
    assets: [],
    files: [],
  })),
};
const showModal = jest.fn(function (this: HTMLDialogElement) {
  this.setAttribute("open", "");
});
const close = jest.fn(function (this: HTMLDialogElement) {
  this.removeAttribute("open");
});
const subscribe = (listener: () => void) => {
  window.addEventListener("popstate", listener);
  return () => window.removeEventListener("popstate", listener);
};
const GalleryRouter = ({ children }: { children: ReactNode }) => {
  const search = useSyncExternalStore(subscribe, () => window.location.search);
  return (
    <SearchParamsContext.Provider value={new URLSearchParams(search)}>
      {children}
    </SearchParamsContext.Provider>
  );
};
const renderGallery = () =>
  render(<ArtGallery catalog={catalog} />, { wrapper: GalleryRouter });
const visit = (url: string) =>
  act(() => window.history.pushState(null, "", url));
beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value: showModal,
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value: close,
  });
});
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Math, "random").mockReturnValue(0.999);
  window.history.replaceState(null, "", "/art");
  // Match Next's native-history integration by updating its search-param context.
  for (const method of ["pushState", "replaceState"] as const) {
    const original = window.history[method].bind(window.history);
    jest
      .spyOn(window.history, method)
      .mockImplementation(
        (data: unknown, unused: string, url?: string | URL | null) => {
          original(data, unused, url);
          window.dispatchEvent(new PopStateEvent("popstate"));
        },
      );
  }
});
afterEach(() => jest.restoreAllMocks());

describe("gallery viewer", () => {
  it("keeps the dialog open while moving to the next artwork", () => {
    renderGallery();
    fireEvent.click(screen.getAllByRole("link", { name: "First spell" })[0]);
    expect(showModal).toHaveBeenCalledTimes(1);
    expect(window.location.search).toBe("?artwork=0");
    fireEvent.click(screen.getByRole("button", { name: "Next artwork" }));
    expect(
      screen.getByRole("heading", { name: "Second spell", level: 1 }),
    ).toBeInTheDocument();
    expect(close).not.toHaveBeenCalled();
    expect(showModal).toHaveBeenCalledTimes(1);
    expect(window.location.search).toBe("?artwork=1");
    fireEvent.click(screen.getByRole("button", { name: "Previous artwork" }));
    expect(window.location.search).toBe("?artwork=0");
  });
  it("returns to the collection from inside the viewer", () => {
    visit("/art?artist=artist");
    renderGallery();
    fireEvent.click(screen.getAllByRole("link", { name: "First spell" })[0]);
    fireEvent.click(screen.getByRole("link", { name: "All art" }));
    expect(
      screen.queryByRole("button", { name: "Close artwork" }),
    ).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
    expect(window.location.search).toBe("?artist=artist");
  });
  it("writes artist selections to the URL and preserves unrelated parameters", () => {
    visit("/art?utm_source=gallery#collection");
    renderGallery();
    fireEvent.change(screen.getByLabelText("Artist"), {
      target: { value: "artist" },
    });
    expect(window.location.search).toBe("?utm_source=gallery&artist=artist");
    expect(window.location.hash).toBe("#collection");
    fireEvent.change(screen.getByLabelText("Artist"), {
      target: { value: "" },
    });
    expect(window.location.search).toBe("?utm_source=gallery");
  });
  it("restores the artist and open piece from a shared URL after remounting", () => {
    visit("/art?artist=artist&artwork=1");
    const firstVisit = renderGallery();
    expect(screen.getByLabelText("Artist")).toHaveValue("artist");
    expect(
      screen.getByRole("dialog", { name: "Second spell" }),
    ).toBeInTheDocument();
    firstVisit.unmount();
    renderGallery();
    expect(screen.getByLabelText("Artist")).toHaveValue("artist");
    expect(
      screen.getByRole("dialog", { name: "Second spell" }),
    ).toBeInTheDocument();
  });
  it("restores gallery selections through browser Back and Forward", async () => {
    renderGallery();
    fireEvent.change(screen.getByLabelText("Artist"), {
      target: { value: "artist" },
    });
    fireEvent.click(screen.getAllByRole("link", { name: "First spell" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Next artwork" }));
    act(() => window.history.back());
    await waitFor(() =>
      expect(
        screen.getByRole("dialog", { name: "First spell" }),
      ).toBeInTheDocument(),
    );
    act(() => window.history.back());
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(screen.getByLabelText("Artist")).toHaveValue("artist");
    expect(document.body.style.overflow).toBe("");
    act(() => window.history.forward());
    await waitFor(() =>
      expect(
        screen.getByRole("dialog", { name: "First spell" }),
      ).toBeInTheDocument(),
    );
  });
  it.each(["button", "escape"])(
    "clears the artwork parameter when closing via %s",
    (method) => {
      visit("/art?artist=artist&artwork=0&utm_source=gallery");
      renderGallery();
      if (method === "button")
        fireEvent.click(screen.getByRole("button", { name: "Close artwork" }));
      else
        fireEvent(
          screen.getByRole("dialog"),
          new Event("cancel", { bubbles: false, cancelable: true }),
        );
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(window.location.search).toBe("?artist=artist&utm_source=gallery");
      expect(document.body.style.overflow).toBe("");
    },
  );
  it("clears filter parameters when resetting filters", () => {
    visit(
      "/art?artist=artist&collection=wizards&token=6318&utm_source=gallery",
    );
    renderGallery();
    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(window.location.search).toBe("?utm_source=gallery");
    expect(screen.getByLabelText("Artist")).toHaveValue("");
    expect(screen.getByLabelText("Token ID")).toHaveValue("");
  });
  it("ignores unknown artwork IDs without opening an empty dialog", () => {
    visit("/art?artist=artist&artwork=missing");
    renderGallery();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Artist")).toHaveValue("artist");
  });
  it("gives artwork links a shareable URL with the current artist filter", () => {
    visit("/art?artist=artist");
    renderGallery();
    for (const link of screen.getAllByRole("link", { name: "First spell" }))
      expect(link).toHaveAttribute("href", "/art?artist=artist&artwork=0");
  });
});
