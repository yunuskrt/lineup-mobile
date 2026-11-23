import type { RouteParams } from '@/types/route-params';

// Expo Router's params as the copied helpers read them
export function searchParamsOf(params: RouteParams): URLSearchParams {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue;
    for (const item of Array.isArray(value) ? value : [value]) {
      search.append(key, item);
    }
  }
  return search;
}

// setParams merges, so a dropped key is written as undefined
export function routeParamsFor(
  next: URLSearchParams,
  current: RouteParams,
): RouteParams {
  const written: RouteParams = {};
  for (const key of Object.keys(current)) written[key] = undefined;
  for (const key of new Set(next.keys())) {
    const values = next.getAll(key);
    written[key] = values.length === 1 ? values[0] : values;
  }
  return written;
}

// The route keeps its own key order; a repeated key's order still counts
export function paramsKey(params: URLSearchParams): string {
  const sorted = new URLSearchParams(params);
  sorted.sort();
  return sorted.toString();
}

export function sameParams(a: URLSearchParams, b: URLSearchParams): boolean {
  return paramsKey(a) === paramsKey(b);
}
