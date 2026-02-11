/** @jest-environment node */
import { sanitizeRedirectUrl } from "./redirect.utils";

describe("sanitizeRedirectUrl", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://example.com";
  });

  it("returns pathname for same-host absolute url", () => {
    const result = sanitizeRedirectUrl("https://example.com/events/123");
    expect(result).toBe("/events/123");
  });

  it("replaces javascript protocol urls with /", () => {
    const result = sanitizeRedirectUrl("javascript:alert()");
    expect(result).toBe("/");
  });

  it("returns / when redirectUrl is missing", () => {
    const result = sanitizeRedirectUrl(undefined);
    expect(result).toBe("/");
  });
  
  it("returns / when redirectUrl's host is different", () => {
    const result = sanitizeRedirectUrl("https://evil.com/events/123");
    expect(result).toBe("/");
  });
});
