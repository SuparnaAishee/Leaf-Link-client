import envConfig from "@/src/config/envConfig";

export type IdentifyResult = {
  name: string;
  scientificName: string;
  confidence: number;
  care: { sun: string; water: string; soil: string };
  tips: string[];
  source: "mock" | "anthropic";
};

export type DiagnoseResult = {
  diagnosis: string;
  cause: string;
  severity: "Mild" | "Moderate" | "Serious" | string;
  treatment: string[];
  confidence: number;
  source: "mock" | "anthropic";
};

export type ChatMessage = { role: "user" | "assistant"; content: string };

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${envConfig.baseApi}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed (${res.status}): ${text}`);
  }
  const json = await res.json();
  return json.data as T;
}

export function identifyPlant(payload: { imageBase64?: string; imageUrl?: string; hint?: string }) {
  return postJson<IdentifyResult>("/ai/identify", payload);
}

export function diagnoseDisease(payload: { imageBase64?: string; imageUrl?: string; symptoms?: string }) {
  return postJson<DiagnoseResult>("/ai/diagnose", payload);
}

export function chat(messages: ChatMessage[]) {
  return postJson<{ reply: string; source: "mock" | "anthropic" }>("/ai/chat", { messages });
}
