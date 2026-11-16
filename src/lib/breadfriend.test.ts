import { fetchGiphyChannelGifs } from "./breadfriend";

const gif = (id: string) => ({
  id,
  title: `${id} GIF by House of Wizards`,
  username: "thehouseofwizards",
  url: `https://giphy.com/gifs/${id}`,
  images: {
    original: { url: `https://media.giphy.com/media/${id}/giphy.gif?cid=test` },
    fixed_width: {
      url: `https://media.giphy.com/media/${id}/200w.gif?cid=test`,
      webp: `https://media.giphy.com/media/${id}/200w.webp?cid=test`,
    },
  },
});

const response = (data: unknown[], offset = 0, total = data.length) => ({
  ok: true,
  json: async () => ({
    data,
    pagination: { offset, count: data.length, total_count: total },
  }),
});

const waitForAbort = (signal: AbortSignal | null | undefined) =>
  new Promise<never>((_, reject) => {
    if (!signal) throw new Error("A request deadline must supply a signal");
    const rejectAbort = () => reject(new DOMException("Aborted", "AbortError"));
    if (signal.aborted) rejectAbort();
    else signal.addEventListener("abort", rejectAbort, { once: true });
  });

describe("GIPHY browser gallery requests", () => {
  const savedFetch = global.fetch;
  const savedKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY;
  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    process.env.NEXT_PUBLIC_GIPHY_API_KEY = "test-web-key";
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    global.fetch = savedFetch;
    if (savedKey === undefined) delete process.env.NEXT_PUBLIC_GIPHY_API_KEY;
    else process.env.NEXT_PUBLIC_GIPHY_API_KEY = savedKey;
    jest.useRealTimers();
  });

  it("makes no request without a web key", async () => {
    delete process.env.NEXT_PUBLIC_GIPHY_API_KEY;
    expect(await fetchGiphyChannelGifs()).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("requests the channel directly without caching or changing result order", async () => {
    mockFetch
      .mockResolvedValueOnce(
        response([gif("b"), { ...gif("a"), username: "" }], 0, 4),
      )
      .mockResolvedValueOnce(response([gif("b"), gif("c")], 2, 4));

    const result = await fetchGiphyChannelGifs();

    expect(result.map((item) => item.id)).toEqual(["b", "a", "b", "c"]);
    expect(result[0]).toMatchObject({
      title: "b",
      previewUrl: gif("b").images.fixed_width.webp,
      downloadUrl: gif("b").images.original.url,
      pageUrl: gif("b").url,
    });
    const firstUrl = new URL(mockFetch.mock.calls[0][0]);
    expect(firstUrl.origin).toBe("https://api.giphy.com");
    expect(firstUrl.searchParams.get("q")).toBe("@thehouseofwizards");
    expect(firstUrl.searchParams.get("api_key")).toBe("test-web-key");
    expect(new URL(mockFetch.mock.calls[1][0]).searchParams.get("offset")).toBe(
      "2",
    );
    expect(mockFetch.mock.calls[0][1]).toEqual({
      cache: "no-store",
      signal: expect.any(AbortSignal),
    });
    expect(jest.getTimerCount()).toBe(0);
  });

  it("uses the GIF rendition when an optional WebP URL is empty", async () => {
    const item = gif("a");
    mockFetch.mockResolvedValueOnce(
      response([
        {
          ...item,
          images: {
            ...item.images,
            fixed_width: { ...item.images.fixed_width, webp: "" },
          },
        },
      ]),
    );
    expect((await fetchGiphyChannelGifs())[0].previewUrl).toBe(
      item.images.fixed_width.url,
    );
  });

  it.each([
    { ok: false, status: 429 },
    { ok: true, json: async () => ({ unexpected: true }) },
    {
      ok: true,
      json: async () => {
        throw new SyntaxError("Invalid JSON");
      },
    },
  ])(
    "returns the channel-link fallback for an unusable response",
    async (badResponse) => {
      mockFetch.mockResolvedValueOnce(badResponse);
      expect(await fetchGiphyChannelGifs()).toEqual([]);
      expect(jest.getTimerCount()).toBe(0);
    },
  );

  it("aborts a stalled fetch within eight seconds", async () => {
    mockFetch.mockImplementation((_url: string, init: RequestInit) =>
      waitForAbort(init.signal),
    );
    const result = fetchGiphyChannelGifs();
    await jest.advanceTimersByTimeAsync(8000);
    expect(await result).toEqual([]);
    expect(mockFetch.mock.calls[0][1].signal.aborted).toBe(true);
    expect(jest.getTimerCount()).toBe(0);
  });

  it("also aborts when headers arrive but the response body stalls", async () => {
    mockFetch.mockImplementation(async (_url: string, init: RequestInit) => ({
      ok: true,
      json: () => waitForAbort(init.signal),
    }));
    const result = fetchGiphyChannelGifs();
    await jest.advanceTimersByTimeAsync(8000);
    expect(await result).toEqual([]);
    expect(jest.getTimerCount()).toBe(0);
  });

  it("shares one deadline across pages and keeps the completed first page", async () => {
    mockFetch
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(response([gif("a")], 0, 2)), 6000);
          }),
      )
      .mockImplementationOnce((_url: string, init: RequestInit) =>
        waitForAbort(init.signal),
      );
    const result = fetchGiphyChannelGifs();
    await jest.advanceTimersByTimeAsync(8000);
    expect((await result).map((item) => item.id)).toEqual(["a"]);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch.mock.calls[1][1].signal.aborted).toBe(true);
  });

  it("cancels in-flight requests on navigation and removes the abort listener", async () => {
    const controller = new AbortController();
    const removeListener = jest.spyOn(controller.signal, "removeEventListener");
    mockFetch.mockImplementation((_url: string, init: RequestInit) =>
      waitForAbort(init.signal),
    );
    const result = fetchGiphyChannelGifs(controller.signal);
    controller.abort();
    expect(await result).toEqual([]);
    expect(mockFetch.mock.calls[0][1].signal.aborted).toBe(true);
    expect(removeListener).toHaveBeenCalledWith("abort", expect.any(Function));
    expect(jest.getTimerCount()).toBe(0);
  });

  it("does not start a request after navigation has already cancelled it", async () => {
    const controller = new AbortController();
    controller.abort();
    expect(await fetchGiphyChannelGifs(controller.signal)).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("stops pagination when the API makes no progress", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [gif("a")],
        pagination: { offset: 0, count: 0, total_count: 100 },
      }),
    });
    expect((await fetchGiphyChannelGifs()).map((item) => item.id)).toEqual([
      "a",
    ]);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
