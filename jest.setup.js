// Jest setup file
import "@testing-library/jest-dom";

// Polyfill for Next.js Request/Response in Jest
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Request and Response for Next.js API routes
class MockRequest {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || "GET";
    this.headers = new Map(Object.entries(options.headers || {}));
    this._body = options.body;
  }

  async json() {
    return JSON.parse(this._body);
  }
}

class MockResponse {
  constructor(body, options = {}) {
    this._body = body;
    this.status = options.status || 200;
    this.headers = new Map(Object.entries(options.headers || {}));
  }

  async json() {
    return JSON.parse(this._body);
  }
}

global.Request = global.Request || MockRequest;
global.Response = global.Response || MockResponse;
