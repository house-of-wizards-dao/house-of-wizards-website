import {
  profileUpdateSchema,
  loginSchema,
  signupSchema,
  contactFormSchema,
  paginationSchema,
} from "@/lib/validation-schemas";

describe("validation schemas", () => {
  describe("profileUpdateSchema", () => {
    it("validates valid profile update data", () => {
      const validData = {
        name: "John Doe",
        description: "A developer",
        twitter: "johndoe",
        discord: "johndoe#1234",
        website: "https://johndoe.com",
      };

      const result = profileUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects empty update data", () => {
      const result = profileUpdateSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("trims whitespace from strings", () => {
      const data = {
        name: "  John Doe  ",
        description: "  A developer  ",
      };

      const result = profileUpdateSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("John Doe");
        expect(result.data.description).toBe("A developer");
      }
    });

    it("rejects names that are too long", () => {
      const data = {
        name: "a".repeat(101),
      };

      const result = profileUpdateSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("validates optional fields", () => {
      const data = {
        name: "John Doe",
      };

      const result = profileUpdateSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("loginSchema", () => {
    it("validates valid login data", () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects invalid email format", () => {
      const data = {
        email: "invalid-email",
        password: "password123",
      };

      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects empty password", () => {
      const data = {
        email: "test@example.com",
        password: "",
      };

      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("signupSchema", () => {
    it("validates valid signup data", () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
        name: "John Doe",
        confirmPassword: "password123",
      };

      const result = signupSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects mismatched passwords", () => {
      const data = {
        email: "test@example.com",
        password: "password123",
        name: "John Doe",
        confirmPassword: "different",
      };

      const result = signupSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects short passwords", () => {
      const data = {
        email: "test@example.com",
        password: "123",
        name: "John Doe",
        confirmPassword: "123",
      };

      const result = signupSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("contactFormSchema", () => {
    it("validates valid contact form data", () => {
      const validData = {
        name: "John Doe",
        email: "test@example.com",
        subject: "Test Subject",
        message: "Test message content",
      };

      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects spam (honeypot field)", () => {
      const data = {
        name: "John Doe",
        email: "test@example.com",
        message: "Test message",
        honeypot: "spam",
      };

      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("allows empty honeypot field", () => {
      const data = {
        name: "John Doe",
        email: "test@example.com",
        message: "Test message",
        honeypot: "",
      };

      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("paginationSchema", () => {
    it("validates valid pagination data", () => {
      const validData = {
        page: 1,
        limit: 10,
        sortBy: "created_at",
        sortOrder: "desc" as const,
      };

      const result = paginationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("applies default values", () => {
      const result = paginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
        expect(result.data.sortOrder).toBe("desc");
      }
    });

    it("coerces string numbers", () => {
      const data = {
        page: "2",
        limit: "20",
      };

      const result = paginationSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(20);
      }
    });

    it("rejects invalid page numbers", () => {
      const data = {
        page: 0,
      };

      const result = paginationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects excessive limits", () => {
      const data = {
        limit: 1000,
      };

      const result = paginationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
