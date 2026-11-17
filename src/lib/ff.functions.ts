
async function fetchGamesKinbo(
  uid: string,
  region: string
): Promise<
  { ok: true; data: Upstream } |
  { ok: false; error: string }
> {
  const key = process.env["GAMESKINBO_API_KEY"];

  if (!key) {
    return {
      ok: false,
      error: "Info Bot is not configured yet. Please try again later.",
    };
  }

  const url = new URL(GAMESKINBO_URL);
  url.searchParams.set("uid", uid);
  url.searchParams.set("region", region);

  let res: Response;

  try {
    res = await fetch(url.toString(), {
      headers: {
        "x-api-key": key,
        Accept: "application/json",
      },
    });
  } catch {
    return {
      ok: false,
      error: "Could not reach the player info service. Please try again.",
    };
  }

  // Read response as text first so non-JSON errors are not hidden.
  const bodyText = await res.text();

  if (!res.ok) {
    if (res.status === 429) {
      return {
        ok: false,
        error: "Too many lookups right now. Please wait a moment and try again.",
      };
    }

    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        error: "The player info service rejected the request. Please check the API configuration.",
      };
    }

    if (res.status === 404 || res.status === 402) {
      return {
        ok: false,
        error: "Player not found. Check the UID and region.",
      };
    }

    console.error("Games Kinbo HTTP error:", res.status, bodyText.slice(0, 300));

    return {
      ok: false,
      error: `Player info service error (HTTP ${res.status}). Please try again.`,
    };
  }

  let data: Upstream;

  try {
    data = JSON.parse(bodyText);
  } catch {
    console.error(
      "Games Kinbo returned non-JSON response:",
      res.headers.get("content-type"),
      bodyText.slice(0, 300)
    );

    return {
      ok: false,
      error: "The player info service returned an invalid response.",
    };
  }

  if (!data || typeof data !== "object" || !data.AccountInfo) {
    console.error("Games Kinbo response is missing AccountInfo.");

    return {
      ok: false,
      error: "Player not found. Check the UID and region.",
    };
  }

  return { ok: true, data };
}
