import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { CMSArtist } from "@/types/cms-art";
import { ArtworkEditor } from "./ArtworkEditor";
import { ArtistEditor } from "./ArtistEditor";
import { saveEntry } from "./client";
jest.mock("./client", () => ({ saveEntry: jest.fn() }));
const artist: CMSArtist = {
  id: "10000000-0000-4000-8000-000000000001",
  name: "Shadow",
  portfolio_url: null,
  profile_image_bucket: null,
  profile_image_path: null,
  profile_image_source_url: null,
  updated_at: "2026-10-15T00:00:00Z",
  commission_artist_links: [],
  commission_artworks: [],
};
beforeEach(() => jest.clearAllMocks());
describe("art CMS editors", () => {
  it("saves artist name and portfolio", async () => {
    const onSaved = jest.fn().mockResolvedValue(undefined);
    render(<ArtistEditor onSaved={onSaved} onCancel={jest.fn()} />);
    fireEvent.change(screen.getByLabelText("Artist name"), {
      target: { value: "New Artist" },
    });
    fireEvent.change(screen.getByLabelText("Main portfolio URL"), {
      target: { value: "https://example.com/portfolio" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save artist" }));
    await waitFor(() => expect(onSaved).toHaveBeenCalled());
    const payload = JSON.parse(
      jest.mocked(saveEntry).mock.calls[0][2].get("data") as string,
    );
    expect(payload.name).toBe("New Artist");
    expect(payload.portfolio_url).toBe("https://example.com/portfolio");
  });
  it("submits artist, token links and DAO funding with the artwork", async () => {
    const onSaved = jest.fn().mockResolvedValue(undefined);
    render(
      <ArtworkEditor
        artists={[artist]}
        onSaved={onSaved}
        onCancel={jest.fn()}
      />,
    );
    fireEvent.change(screen.getByLabelText("Artist"), {
      target: { value: artist.id },
    });
    fireEvent.change(screen.getByLabelText(/Fallback title/), {
      target: { value: "A spell" },
    });
    fireEvent.change(screen.getByLabelText(/Featured tokens/), {
      target: { value: "wizards:6318\nwarriors:9380" },
    });
    fireEvent.change(
      screen.getByLabelText("External artwork or Book of Lore URL"),
      { target: { value: "https://example.com/art" } },
    );
    fireEvent.click(screen.getByLabelText("Funded by the DAO"));
    fireEvent.click(screen.getByRole("button", { name: "Save artwork" }));
    await waitFor(() => expect(onSaved).toHaveBeenCalled());
    const payload = JSON.parse(
      jest.mocked(saveEntry).mock.calls[0][2].get("data") as string,
    );
    expect(payload.artist_id).toBe(artist.id);
    expect(payload.funded).toBe(false);
    expect(payload.assets).toEqual([
      { collection: "wizards", asset_identifier: "6318" },
      { collection: "warriors", asset_identifier: "9380" },
    ]);
  });
  it("shows errors without discarding the edit", async () => {
    jest
      .mocked(saveEntry)
      .mockRejectedValueOnce(new Error("Entry changed; reload first"));
    render(
      <ArtistEditor entry={artist} onSaved={jest.fn()} onCancel={jest.fn()} />,
    );
    fireEvent.change(screen.getByLabelText("Artist name"), {
      target: { value: "Updated Shadow" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save artist" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Entry changed; reload first",
    );
    expect(screen.getByLabelText("Artist name")).toHaveValue("Updated Shadow");
  });
});
