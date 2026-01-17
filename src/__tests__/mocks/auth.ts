/**
 * Mock NextAuth session for testing
 */

export type MockSession = {
  address?: string;
  user?: {
    name?: string;
  };
} | null;

let mockSession: MockSession = null;

export function setMockSession(session: MockSession) {
  mockSession = session;
}

export function getMockSession() {
  return mockSession;
}

export function clearMockSession() {
  mockSession = null;
}

// Mock getServerSession
export const mockGetServerSession = jest.fn().mockImplementation(() => {
  return Promise.resolve(mockSession);
});
