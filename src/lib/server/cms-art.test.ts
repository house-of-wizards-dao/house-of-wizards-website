/** @jest-environment node */
import { NextRequest } from "next/server";
import sharp from "sharp";
import { requireCMSUser } from "@/lib/cms-auth";
import { getSupabaseClient } from "@/lib/supabase";
import { POST as prepareUpload } from "@/app/api/cms/art/uploads/route";
import { artCMS } from "./cms-art";
import { prepareArtUploads } from "./cms-art-uploads";

jest.mock("server-only", () => ({}));
jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
  revalidatePath: jest.fn(),
}));
jest.mock("@/lib/cms-auth", () => ({
  requireCMSUser: jest.fn(),
  isAuthError: (result: unknown) =>
    !!result && typeof result === "object" && "error" in result,
}));
jest.mock("@/lib/supabase", () => ({ getSupabaseClient: jest.fn() }));
jest.mock("@/lib/logger", () => ({ logger: { error: jest.fn() } }));
const auth = jest.mocked(requireCMSUser);
const getDB = jest.mocked(getSupabaseClient);
const upload = jest.fn().mockResolvedValue({ error: null });
const download = jest.fn();
const info = jest.fn();
const createSignedUploadUrl = jest.fn();
const remove = jest.fn().mockResolvedValue({ error: null });
const rpc = jest.fn().mockResolvedValue({ data: "id", error: null });
const upsert = jest.fn().mockResolvedValue({ error: null });
const queue = {
  select: jest.fn().mockReturnThis(),
  lte: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue({ data: [], error: null }),
  upsert,
};
beforeEach(() => {
  jest.clearAllMocks();
  process.env.NEXTAUTH_SECRET = "art-upload-test-secret";
  createSignedUploadUrl.mockResolvedValue({
    data: { signedUrl: "https://storage.example/upload" },
    error: null,
  });
  upsert.mockResolvedValue({ error: null });
  upload.mockResolvedValue({ error: null });
  rpc.mockResolvedValue({ data: "id", error: null });
  auth.mockResolvedValue({
    address: "0xtest",
    user: {
      id: "editor",
      eth_address: "0xtest",
      twitter_handle: null,
      role: "editor",
      created_at: "",
      updated_at: "",
    },
  });
  // The database adapter is mocked at its boundary; production never bypasses CMS authentication.
  getDB.mockReturnValue({
    from: () => queue,
    rpc,
    storage: {
      from: () => ({ upload, remove, download, info, createSignedUploadUrl }),
    },
  } as unknown as ReturnType<typeof getSupabaseClient>);
});

describe("direct art uploads", () => {
  const metadata = (size = 18 * 1024 * 1024) => ({
    kind: "artworks",
    files: [
      { field: "originals", name: "painting.png", type: "image/png", size },
    ],
  });
  const saveRequest = (receipt: string) => {
    const form = new FormData();
    form.set("uploads", receipt);
    form.set(
      "data",
      JSON.stringify({
        artist_id: "10000000-0000-4000-8000-000000000001",
        title: "Large painting",
        funded: true,
      }),
    );
    return new NextRequest("http://localhost:3000/api/cms/art/artworks", {
      method: "POST",
      body: form,
    });
  };
  const prepareRequest = (body: unknown, origin?: string) =>
    new NextRequest("http://localhost:3000/api/cms/art/uploads", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
        ...(origin ? { origin } : {}),
      },
    });

  it("requires CMS authentication before issuing upload URLs", async () => {
    auth.mockResolvedValue({ error: "Not authenticated", status: 401 });
    expect((await prepareUpload(prepareRequest(metadata()))).status).toBe(401);
    expect(createSignedUploadUrl).not.toHaveBeenCalled();
  });
  it("rejects cross-origin upload preparation", async () => {
    expect(
      (
        await prepareUpload(
          prepareRequest(metadata(), "https://untrusted.example"),
        )
      ).status,
    ).toBe(403);
    expect(createSignedUploadUrl).not.toHaveBeenCalled();
  });
  it("accepts exactly 50 MB and rejects larger images before signing", async () => {
    expect(
      (await prepareUpload(prepareRequest(metadata(50 * 1024 * 1024)))).status,
    ).toBe(200);
    expect(createSignedUploadUrl).toHaveBeenCalledTimes(1);
    expect(
      (await prepareUpload(prepareRequest(metadata(50 * 1024 * 1024 + 1))))
        .status,
    ).toBe(400);
    expect(createSignedUploadUrl).toHaveBeenCalledTimes(1);
  });
  it("rejects a batch over 120 MB", async () => {
    const file = metadata(50 * 1024 * 1024).files[0];
    expect(
      (
        await prepareUpload(
          prepareRequest({ kind: "artworks", files: [file, file, file] }),
        )
      ).status,
    ).toBe(400);
    expect(createSignedUploadUrl).not.toHaveBeenCalled();
  });
  it("saves an 18 MB original intact and generates both image previews", async () => {
    const input = metadata();
    const png = await sharp({
      create: { width: 1000, height: 600, channels: 3, background: "purple" },
    })
      .png()
      .toBuffer();
    // PNG permits trailing bytes; keep the fixture small while testing the real file size.
    const bytes = Buffer.concat([
      new Uint8Array(png),
      new Uint8Array(input.files[0].size - png.length),
    ]);
    info.mockResolvedValue({
      data: { size: bytes.length, contentType: "image/png" },
      error: null,
    });
    download.mockResolvedValue({
      data: new Blob([new Uint8Array(bytes)], { type: "image/png" }),
      error: null,
    });
    const { receipt } = await prepareArtUploads(input, "0xtest");
    const response = await artCMS("artwork", "save")(saveRequest(receipt));
    expect(response.status).toBe(201);
    expect(upload).toHaveBeenCalledTimes(3);
    expect(upload.mock.calls[0][1].equals(bytes)).toBe(true);
    const files = rpc.mock.calls[0][1].p_files;
    expect(files[0]).toMatchObject({
      byte_size: bytes.length,
      original_filename: "painting.png",
    });
    expect(files[1].original_file_id).toBe(files[0].id);
    expect(files[2].original_file_id).toBe(files[0].id);
    expect((await sharp(upload.mock.calls[1][1]).metadata()).width).toBe(640);
    // Staging files cannot be swept by another save while these URLs remain valid.
    expect(Date.parse(upsert.mock.calls[0][0][0].created_at)).toBeGreaterThan(
      Date.now() + 2 * 60 * 60 * 1000,
    );
    expect(queue.lte).toHaveBeenCalledWith("created_at", expect.any(String));
  });
  it.each(["tampered", "different user", "different entry", "expired"])(
    "rejects a %s receipt before accessing storage",
    async (scenario) => {
      let { receipt } = await prepareArtUploads(
        metadata(),
        scenario === "different user" ? "0xother" : "0xtest",
      );
      if (scenario === "tampered") receipt = `e30.${receipt.split(".")[1]}`;
      const now = Date.now();
      const clock =
        scenario === "expired"
          ? jest.spyOn(Date, "now").mockReturnValue(now + 3 * 60 * 60 * 1000)
          : null;
      try {
        const response = await artCMS("artwork", "save")(
          saveRequest(receipt),
          scenario === "different entry"
            ? {
                params: Promise.resolve({
                  id: "10000000-0000-4000-8000-000000000001",
                }),
              }
            : undefined,
        );
        expect(response.status).toBe(400);
        expect(info).not.toHaveBeenCalled();
        expect(download).not.toHaveBeenCalled();
        expect(rpc).not.toHaveBeenCalled();
      } finally {
        clock?.mockRestore();
      }
    },
  );
  it("rejects mismatched storage size before downloading bytes", async () => {
    const { receipt } = await prepareArtUploads(metadata(), "0xtest");
    info.mockResolvedValue({
      data: { size: 60 * 1024 * 1024, contentType: "image/png" },
      error: null,
    });
    const response = await artCMS("artwork", "save")(saveRequest(receipt));
    expect(response.status).toBe(400);
    expect(download).not.toHaveBeenCalled();
    expect(rpc).not.toHaveBeenCalled();
  });
});
const request = (data: unknown, photo?: File, kind = "artist") => {
  const form = new FormData();
  form.set("data", JSON.stringify(data));
  if (photo) form.set(kind === "artist" ? "photo" : "originals", photo);
  return new NextRequest("http://localhost:3000/api/cms/art/artists", {
    method: "POST",
    body: form,
  });
};
describe("art CMS mutations", () => {
  it.each(["list", "get", "save", "delete"] as const)(
    "requires an authenticated CMS user for %s",
    async (action) => {
      auth.mockResolvedValue({ error: "Not authenticated", status: 401 });
      const response = await artCMS(
        "artist",
        action,
      )(new NextRequest("http://localhost:3000/api/cms/art/artists"));
      expect(response.status).toBe(401);
      expect(upload).not.toHaveBeenCalled();
      expect(rpc).not.toHaveBeenCalled();
    },
  );
  it("rejects cross-origin form submissions", async () => {
    const response = await artCMS(
      "artist",
      "save",
    )(
      new NextRequest("http://localhost:3000/api/cms/art/artists", {
        method: "POST",
        headers: { origin: "https://untrusted.example" },
      }),
    );
    expect(response.status).toBe(403);
    expect(rpc).not.toHaveBeenCalled();
  });
  it("rejects unsafe portfolio URLs", async () => {
    const response = await artCMS(
      "artist",
      "save",
    )(request({ name: "Artist", portfolio_url: "javascript:alert(1)" }));
    expect(response.status).toBe(400);
    expect(upload).not.toHaveBeenCalled();
  });
  it.each([false, true])(
    "saves an artist without a global File constructor (photo: %s)",
    async (withPhoto) => {
      const bytes = await sharp({
        create: { width: 4, height: 4, channels: 3, background: "purple" },
      })
        .png()
        .toBuffer();
      const req = request(
        { name: "Artist" },
        withPhoto
          ? new File([new Uint8Array(bytes)], "avatar.png", {
              type: "image/png",
            })
          : undefined,
      );
      // Node 18 supports multipart File values without a global File constructor.
      const descriptor = Object.getOwnPropertyDescriptor(globalThis, "File");
      Object.defineProperty(globalThis, "File", {
        configurable: true,
        value: undefined,
      });
      try {
        const response = await artCMS("artist", "save")(req);
        expect(response.status).toBe(201);
        expect(rpc).toHaveBeenCalledTimes(1);
        expect(upload).toHaveBeenCalledTimes(withPhoto ? 2 : 0);
      } finally {
        if (descriptor) Object.defineProperty(globalThis, "File", descriptor);
        else Reflect.deleteProperty(globalThis, "File");
      }
    },
  );
  it("preserves avatar bytes and creates a small display version", async () => {
    const bytes = await sharp({
      create: { width: 1000, height: 600, channels: 3, background: "purple" },
    })
      .png()
      .toBuffer();
    const photo = new File([new Uint8Array(bytes)], "avatar.png", {
      type: "image/png",
    });
    const response = await artCMS(
      "artist",
      "save",
    )(
      request(
        { name: "Artist", portfolio_url: "", profile_image_source_url: "" },
        photo,
      ),
    );
    expect(response.status).toBe(201);
    expect(upload).toHaveBeenCalledTimes(2);
    expect(upload.mock.calls[0][1].toString("hex")).toBe(bytes.toString("hex"));
    const metadata = await sharp(upload.mock.calls[1][1]).metadata();
    expect(metadata.width).toBe(256);
    expect(metadata.height).toBe(256);
  });
  it("queues newly uploaded files for cleanup if the atomic save fails", async () => {
    rpc.mockResolvedValue({ error: { message: "CONFLICT", code: "P0001" } });
    const bytes = await sharp({
      create: { width: 4, height: 4, channels: 3, background: "purple" },
    })
      .png()
      .toBuffer();
    const response = await artCMS(
      "artist",
      "save",
    )(
      request(
        { name: "Artist" },
        new File([new Uint8Array(bytes)], "avatar.png", { type: "image/png" }),
      ),
    );
    expect(response.status).toBe(409);
    expect(upsert.mock.calls[0][0]).toHaveLength(2);
  });
  it("retains uploads when the database response is lost, since the save may have committed", async () => {
    rpc.mockRejectedValueOnce(new Error("Connection lost"));
    const bytes = await sharp({
      create: { width: 4, height: 4, channels: 3, background: "purple" },
    })
      .png()
      .toBuffer();
    const response = await artCMS(
      "artist",
      "save",
    )(
      request(
        { name: "Artist" },
        new File([new Uint8Array(bytes)], "avatar.png", { type: "image/png" }),
      ),
    );
    expect(response.status).toBe(503);
    expect(upload).toHaveBeenCalledTimes(2);
    expect(upsert).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });
  it("keeps each image original and links both resized previews to it", async () => {
    const bytes = await sharp({
      create: { width: 2400, height: 1200, channels: 3, background: "purple" },
    })
      .png()
      .toBuffer();
    const response = await artCMS(
      "artwork",
      "save",
    )(
      request(
        {
          artist_id: "10000000-0000-4000-8000-000000000001",
          title: "A painting",
          funded: true,
        },
        new File([new Uint8Array(bytes)], "painting.png", {
          type: "image/png",
        }),
        "artwork",
      ),
    );
    expect(response.status).toBe(201);
    expect(upload).toHaveBeenCalledTimes(3);
    expect(upload.mock.calls[0][1].toString("hex")).toBe(bytes.toString("hex"));
    const files = rpc.mock.calls[0][1].p_files;
    expect(files).toHaveLength(3);
    expect(files[1].original_file_id).toBe(files[0].id);
    expect(files[2].original_file_id).toBe(files[0].id);
    expect((await sharp(upload.mock.calls[1][1]).metadata()).width).toBe(640);
    expect((await sharp(upload.mock.calls[2][1]).metadata()).width).toBe(1920);
  });
  it("keeps GIF animation in the web preview", async () => {
    const bytes = Buffer.from(
      "R0lGODlhAgACAIEAAP8AAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQACgAAACwAAAAAAgACAAAIBgABCAQQEAAh+QQBCgABACwAAAAAAgACAIEAAP8AAAAAAAAAAAAIBgABCAQQEAA7",
      "base64",
    );
    const response = await artCMS(
      "artwork",
      "save",
    )(
      request(
        {
          artist_id: "10000000-0000-4000-8000-000000000001",
          title: "Animated spell",
          funded: true,
        },
        new File([new Uint8Array(bytes)], "spell.gif", { type: "image/gif" }),
        "artwork",
      ),
    );
    expect(response.status).toBe(201);
    expect(
      (await sharp(upload.mock.calls[2][1], { animated: true }).metadata())
        .pages,
    ).toBe(2);
  });
  it("rejects deleting an artist with linked artworks", async () => {
    rpc.mockResolvedValue({ error: { message: "ARTIST_HAS_ARTWORKS" } });
    const response = await artCMS("artist", "delete")(
      new NextRequest("http://localhost:3000/api/cms/art/artists"),
      {
        params: Promise.resolve({ id: "10000000-0000-4000-8000-000000000001" }),
      },
    );
    expect(response.status).toBe(409);
    expect(remove).not.toHaveBeenCalled();
  });
});
