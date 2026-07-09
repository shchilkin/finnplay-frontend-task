export async function requestJson<TResponse>(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<TResponse> {
  const response = await fetch(input, {
    credentials: "include",
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  const responseText = await response.text();
  let data: unknown = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText) as unknown;
    } catch {
      throw new Error(
        response.ok ? "Invalid JSON response" : response.statusText || "Request failed",
      );
    }
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data && typeof data.message === "string"
        ? data.message
        : "Request failed";

    throw new Error(message);
  }

  return data as TResponse;
}
