import type { CallHistoryPreferences } from "@/types/calls";

const STORAGE_KEY = "callHistory.prefs.v1";

export async function loadCallHistoryPreferences(): Promise<Partial<CallHistoryPreferences> | null> {
  try {
    const prefs = await window.spark.kv.get<CallHistoryPreferences>(STORAGE_KEY);
    return prefs || null;
  } catch {
    return null;
  }
}

export async function saveCallHistoryPreferences(prefs: Partial<CallHistoryPreferences>): Promise<void> {
  try {
    await window.spark.kv.set(STORAGE_KEY, prefs);
  } catch {
  }
}
