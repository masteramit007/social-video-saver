// Proxy downloader: streams remote media through our edge function so the
// browser receives proper Content-Disposition headers and bypasses CORS,
// triggering an automatic file download instead of opening in a new tab.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const target = url.searchParams.get("url");
    const filename = url.searchParams.get("filename") || "download";

    if (!target) {
      return new Response(JSON.stringify({ error: "Missing url" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate URL
    let parsed: URL;
    try {
      parsed = new URL(target);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid url" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return new Response(JSON.stringify({ error: "Unsupported protocol" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch the remote file with browser-like headers
    const upstream = await fetch(target, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Referer": parsed.origin,
      },
    });

    if (!upstream.ok || !upstream.body) {
      return new Response(
        JSON.stringify({ error: `Upstream error: ${upstream.status}` }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const contentType =
      upstream.headers.get("content-type") || "application/octet-stream";
    const contentLength = upstream.headers.get("content-length");

    const safeName = filename.replace(/[^\w.\-]/g, "_");

    const headers: Record<string, string> = {
      ...corsHeaders,
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Cache-Control": "no-cache",
    };
    if (contentLength) headers["Content-Length"] = contentLength;

    return new Response(upstream.body, { status: 200, headers });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Proxy failed" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
