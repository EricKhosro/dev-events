export function sanitizeRedirectUrl(
  redirectUrl: string | null | undefined
): string {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
  if (!redirectUrl || !BASE_URL) return "/";
  try {
    const base = new URL(BASE_URL);
    const target = new URL(redirectUrl, base);

    if (!["http:", "https:"].includes(target.protocol)) {
      return "/";
    }

    if (target.host !== base.host) {
      return "/";
    }

    return target.pathname.toString();
  } catch {
    return "/";
  }
}
