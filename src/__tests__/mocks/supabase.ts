/**
 * Mock Supabase client for testing
 */

export type MockUser = {
  id: string;
  eth_address: string;
  twitter_handle: string | null;
  role: "editor" | "admin";
  created_at: string;
  updated_at: string;
};

export type MockNewsItem = {
  id: number;
  text: string;
  date: string;
  author: string;
  author_id: string | null;
  highlight: boolean;
  title: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

// In-memory database for tests
export const mockDatabase = {
  users: [] as MockUser[],
  news: [] as MockNewsItem[],
  nextNewsId: 1,
};

export function resetMockDatabase() {
  mockDatabase.users = [];
  mockDatabase.news = [];
  mockDatabase.nextNewsId = 1;
}

export function seedMockUsers(users: MockUser[]) {
  mockDatabase.users = [...users];
}

export function seedMockNews(news: MockNewsItem[]) {
  mockDatabase.news = [...news];
  mockDatabase.nextNewsId = Math.max(...news.map((n) => n.id), 0) + 1;
}

// Mock query builder
function createMockQueryBuilder<T>(
  tableName: string,
  initialData: T[],
): MockQueryBuilder<T> {
  let data = [...initialData];
  let filters: Array<{ column: string; op: string; value: unknown }> = [];
  let orderBy: Array<{ column: string; ascending: boolean }> = [];
  let limitCount: number | null = null;
  let isSingle = false;
  let insertData: Partial<T> | null = null;
  let updateData: Partial<T> | null = null;
  let deleteMode = false;

  const builder: MockQueryBuilder<T> = {
    select: (_columns?: string) => {
      return builder;
    },
    eq: (column: string, value: unknown) => {
      filters.push({ column, op: "eq", value });
      return builder;
    },
    ilike: (column: string, value: unknown) => {
      filters.push({ column, op: "ilike", value });
      return builder;
    },
    order: (column: string, options?: { ascending?: boolean }) => {
      orderBy.push({ column, ascending: options?.ascending ?? true });
      return builder;
    },
    limit: (count: number) => {
      limitCount = count;
      return builder;
    },
    single: () => {
      isSingle = true;
      return builder;
    },
    insert: (newData: Partial<T>) => {
      insertData = newData;
      return builder;
    },
    update: (newData: Partial<T>) => {
      updateData = newData;
      return builder;
    },
    delete: () => {
      deleteMode = true;
      return builder;
    },
    then: (resolve: (result: MockQueryResult<T>) => void) => {
      let result: T[] = [...data];

      // Apply filters
      for (const filter of filters) {
        result = result.filter((item) => {
          const itemValue = (item as Record<string, unknown>)[filter.column];
          if (filter.op === "eq") {
            return itemValue === filter.value;
          }
          if (filter.op === "ilike") {
            return (
              String(itemValue).toLowerCase() ===
              String(filter.value).toLowerCase()
            );
          }
          return true;
        });
      }

      // Handle insert
      if (insertData) {
        if (tableName === "users") {
          const newUser = {
            id: `user-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...insertData,
          } as unknown as T;

          // Check for duplicate eth_address
          const exists = mockDatabase.users.some(
            (u) =>
              u.eth_address.toLowerCase() ===
              ((insertData as MockUser).eth_address || "").toLowerCase(),
          );
          if (exists) {
            resolve({
              data: null,
              error: { code: "23505", message: "Duplicate eth_address" },
            });
            return;
          }

          mockDatabase.users.push(newUser as unknown as MockUser);
          resolve({ data: newUser, error: null });
          return;
        }

        if (tableName === "cult-content-chronicle") {
          const newNews = {
            id: mockDatabase.nextNewsId++,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...insertData,
          } as unknown as T;
          mockDatabase.news.push(newNews as unknown as MockNewsItem);
          resolve({ data: newNews, error: null });
          return;
        }
      }

      // Handle update
      if (updateData) {
        if (result.length === 0) {
          resolve({ data: null, error: null });
          return;
        }

        const updated = { ...result[0], ...updateData } as T;

        if (tableName === "users") {
          const idx = mockDatabase.users.findIndex(
            (u) => u.id === (result[0] as unknown as MockUser).id,
          );
          if (idx !== -1) {
            mockDatabase.users[idx] = updated as unknown as MockUser;
          }
        }

        if (tableName === "cult-content-chronicle") {
          const idx = mockDatabase.news.findIndex(
            (n) => n.id === (result[0] as unknown as MockNewsItem).id,
          );
          if (idx !== -1) {
            mockDatabase.news[idx] = updated as unknown as MockNewsItem;
          }
        }

        resolve({ data: updated, error: null });
        return;
      }

      // Handle delete
      if (deleteMode) {
        if (tableName === "users") {
          mockDatabase.users = mockDatabase.users.filter(
            (u) =>
              !filters.some(
                (f) =>
                  f.column === "eth_address" &&
                  u.eth_address.toLowerCase() === String(f.value).toLowerCase(),
              ),
          );
        }

        if (tableName === "cult-content-chronicle") {
          mockDatabase.news = mockDatabase.news.filter(
            (n) =>
              !filters.some(
                (f) => f.column === "id" && n.id === Number(f.value),
              ),
          );
        }

        resolve({ data: null, error: null });
        return;
      }

      // Apply ordering
      for (const order of orderBy.reverse()) {
        result.sort((a, b) => {
          const aVal = (a as Record<string, unknown>)[order.column];
          const bVal = (b as Record<string, unknown>)[order.column];
          if (aVal < bVal) return order.ascending ? -1 : 1;
          if (aVal > bVal) return order.ascending ? 1 : -1;
          return 0;
        });
      }

      // Apply limit
      if (limitCount !== null) {
        result = result.slice(0, limitCount);
      }

      // Handle single
      if (isSingle) {
        if (result.length === 0) {
          resolve({
            data: null,
            error: { code: "PGRST116", message: "No rows found" },
          });
          return;
        }
        resolve({ data: result[0], error: null });
        return;
      }

      resolve({ data: result, error: null });
    },
  };

  return builder;
}

type MockQueryResult<T> = {
  data: T | T[] | null;
  error: { code: string; message: string } | null;
};

type MockQueryBuilder<T> = {
  select: (columns?: string) => MockQueryBuilder<T>;
  eq: (column: string, value: unknown) => MockQueryBuilder<T>;
  ilike: (column: string, value: unknown) => MockQueryBuilder<T>;
  order: (
    column: string,
    options?: { ascending?: boolean },
  ) => MockQueryBuilder<T>;
  limit: (count: number) => MockQueryBuilder<T>;
  single: () => MockQueryBuilder<T>;
  insert: (data: Partial<T>) => MockQueryBuilder<T>;
  update: (data: Partial<T>) => MockQueryBuilder<T>;
  delete: () => MockQueryBuilder<T>;
  then: (resolve: (result: MockQueryResult<T>) => void) => void;
};

export function createMockSupabaseClient() {
  return {
    from: (tableName: string) => {
      if (tableName === "users") {
        return createMockQueryBuilder<MockUser>(tableName, mockDatabase.users);
      }
      if (tableName === "cult-content-chronicle") {
        return createMockQueryBuilder<MockNewsItem>(
          tableName,
          mockDatabase.news,
        );
      }
      return createMockQueryBuilder<unknown>(tableName, []);
    },
  };
}
