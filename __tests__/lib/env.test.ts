import { getValidatedEnv, isServerSide } from "@/lib/env";

describe("env utilities", () => {
  const originalEnv = process.env;
  const originalWindow = global.window;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
    global.window = originalWindow;
  });

  describe("isServerSide", () => {
    it("returns true when window is undefined", () => {
      // @ts-ignore
      delete global.window;
      expect(isServerSide()).toBe(true);
    });

    it("returns false when window is defined", () => {
      global.window = {} as any;
      expect(isServerSide()).toBe(false);
    });
  });

  describe("getValidatedEnv", () => {
    it("validates environment variables successfully", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
      process.env.SUPABASE_SERVICE_ROLE_KEY =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
      process.env.NODE_ENV = "test";

      const env = getValidatedEnv();

      expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe("https://test.supabase.co");
      expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      );
      expect(env.SUPABASE_SERVICE_ROLE_KEY).toBe(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      );
      expect(env.NODE_ENV).toBe("test");
    });

    it("throws error for missing required environment variables", () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;

      expect(() => getValidatedEnv()).toThrow(
        "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL",
      );
    });

    it("throws error for invalid Supabase URL", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "invalid-url";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

      expect(() => getValidatedEnv()).toThrow("Invalid SUPABASE_URL format");
    });

    it("throws error for invalid JWT format", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "invalid-jwt";

      expect(() => getValidatedEnv()).toThrow("Invalid anon key format");
    });

    it("allows empty service role key", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      const env = getValidatedEnv();

      expect(env.SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
    });

    it("trims whitespace from environment variables", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "  https://test.supabase.co  ";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
        "  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  ";

      const env = getValidatedEnv();

      expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe("https://test.supabase.co");
      expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      );
    });
  });
});
