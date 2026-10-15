import { fireEvent, render, screen } from "@testing-library/react";
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
});
afterEach(() => jest.restoreAllMocks());

describe("gallery viewer", () => {
  it("keeps the dialog open while moving to the next artwork", () => {
    render(<ArtGallery catalog={catalog} />);
    fireEvent.click(screen.getAllByRole("link", { name: "First spell" })[0]);
    expect(showModal).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Next artwork" }));
    expect(
      screen.getByRole("heading", { name: "Second spell", level: 1 }),
    ).toBeInTheDocument();
    expect(close).not.toHaveBeenCalled();
    expect(showModal).toHaveBeenCalledTimes(1);
  });
  it("returns to the collection from inside the viewer", () => {
    render(<ArtGallery catalog={catalog} />);
    fireEvent.click(screen.getAllByRole("link", { name: "First spell" })[0]);
    fireEvent.click(screen.getByRole("link", { name: "All art" }));
    expect(
      screen.queryByRole("button", { name: "Close artwork" }),
    ).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });
});
