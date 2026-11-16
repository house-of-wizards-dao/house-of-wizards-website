/** @jest-environment node */
import { saveEntry } from "./client";

const fetchMock = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>();
const originalFetch = global.fetch;
beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock;
});
afterAll(() => {
  global.fetch = originalFetch;
});

const formWithFiles = (sizes: number[]) => {
  const form = new FormData();
  form.set("data", JSON.stringify({ title: "Painting" }));
  sizes.forEach((size, index) => {
    form.append(
      "originals",
      new Blob([new Uint8Array(size)], { type: "image/png" }),
      `page-${index}.png`,
    );
  });
  return form;
};

it.each([18, 50])(
  "sends a %i MB image straight to storage and only metadata to the API",
  async (mb) => {
    const form = formWithFiles([mb * 1024 * 1024]);
    fetchMock
      .mockResolvedValueOnce(
        Response.json({
          receipt: "signed-receipt",
          uploads: [{ signedUrl: "https://storage.example/upload" }],
        }),
      )
      .mockResolvedValueOnce(Response.json({ Key: "uploaded" }))
      .mockResolvedValueOnce(Response.json({ id: "saved" }));
    await saveEntry("artworks", undefined, form);
    const [prepare, upload, save] = fetchMock.mock.calls;
    expect(prepare[0]).toBe("/api/cms/art/uploads");
    expect(JSON.parse(String(prepare[1]?.body)).files[0].size).toBe(
      mb * 1024 * 1024,
    );
    expect(upload[0]).toBe("https://storage.example/upload");
    expect(upload[1]).toMatchObject({ method: "PUT", credentials: "omit" });
    expect(upload[1]?.body).toBe(form.get("originals"));
    expect(save[0]).toBe("/api/cms/art/artworks");
    const body = save[1]?.body;
    expect(body).toBeInstanceOf(FormData);
    if (!(body instanceof FormData)) throw new Error("Expected form data");
    expect(body.get("uploads")).toBe("signed-receipt");
    expect(body.get("data")).toBe(form.get("data"));
    expect(
      Array.from(body.values()).every((value) => typeof value === "string"),
    ).toBe(true);
    expect((await new Response(body).arrayBuffer()).byteLength).toBeLessThan(
      4_500_000,
    );
    // A failed save can be retried without losing the original file selection.
    expect(form.get("originals")).toBeInstanceOf(Blob);
  },
);

it("uploads all comic pages in order even when their combined size exceeds the API limit", async () => {
  fetchMock
    .mockResolvedValueOnce(
      Response.json({
        receipt: "comic",
        uploads: [
          { signedUrl: "https://storage.example/page-1" },
          { signedUrl: "https://storage.example/page-2" },
        ],
      }),
    )
    .mockResolvedValueOnce(Response.json({}))
    .mockResolvedValueOnce(Response.json({}))
    .mockResolvedValueOnce(Response.json({ id: "saved" }));
  const form = formWithFiles([3 * 1024 * 1024, 3 * 1024 * 1024]);
  const id = "10000000-0000-4000-8000-000000000001";
  await saveEntry("artworks", id, form);
  expect(fetchMock.mock.calls[1][1]?.body).toBe(form.getAll("originals")[0]);
  expect(fetchMock.mock.calls[2][1]?.body).toBe(form.getAll("originals")[1]);
  expect(fetchMock.mock.calls[3]).toEqual([
    `/api/cms/art/artworks/${id}`,
    expect.objectContaining({ method: "PATCH" }),
  ]);
});

it("rejects an image over 50 MB before making any requests", async () => {
  await expect(
    saveEntry("artworks", undefined, formWithFiles([50 * 1024 * 1024 + 1])),
  ).rejects.toThrow("Images may be up to 50 MB");
  expect(fetchMock).not.toHaveBeenCalled();
});

it("does not save an entry when its file upload fails", async () => {
  fetchMock
    .mockResolvedValueOnce(
      Response.json({
        receipt: "receipt",
        uploads: [{ signedUrl: "https://storage.example/upload" }],
      }),
    )
    .mockResolvedValueOnce(new Response("Unavailable", { status: 503 }));
  await expect(
    saveEntry("artworks", undefined, formWithFiles([1024])),
  ).rejects.toThrow("Could not upload page-0.png");
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

it("keeps metadata-only edits on the existing save endpoint", async () => {
  fetchMock.mockResolvedValueOnce(Response.json({ id: "saved" }));
  await saveEntry("artists", undefined, formWithFiles([]));
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock.mock.calls[0][0]).toBe("/api/cms/art/artists");
});
