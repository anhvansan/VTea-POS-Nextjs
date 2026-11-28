import type { Order } from "./types";

export const LAST_ORDER_COOKIE = "vtea_last_order";

export function encodeOrderCookie(order: Order): string {
  return Buffer.from(JSON.stringify(order), "utf8").toString("base64url");
}

export function decodeOrderCookie(raw: string | undefined): Order | undefined {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(
      Buffer.from(raw, "base64url").toString("utf8")
    ) as Partial<Order>;
    if (
      typeof parsed.id === "string" &&
      Array.isArray(parsed.items) &&
      typeof parsed.totalAmount === "number" &&
      typeof parsed.createdAt === "string"
    ) {
      return parsed as Order;
    }
    return undefined;
  } catch {
    return undefined;
  }
}
