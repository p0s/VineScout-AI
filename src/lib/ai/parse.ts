import { aiJsonResponseSchema } from "../schemas";

export function parseAiJsonContent<T>(content: string): { ok: true; data: T } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(content) as unknown;
    const normalized = aiJsonResponseSchema.safeParse(parsed);
    if (!normalized.success) {
      return { ok: false, error: "AI JSON failed schema validation." };
    }
    return { ok: true, data: normalized.data as T };
  } catch {
    return { ok: false, error: "AI returned invalid JSON." };
  }
}
