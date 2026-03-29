# social-video-saver

## Download fallback chain

The download API now supports extra self-hosted failsafe layers for platforms where primary providers fail:

1. RapidAPI providers (existing)
2. Cobalt/native extractors (existing)
3. **yt-dlp bridge** (new)
4. **VidBee bridge** (new)

When configured, these bridges are attempted automatically before final native scraping fallbacks.

## Environment variables

### Netlify function (`netlify/functions/download.js`)

- `YTDLP_API_URL` — URL for your self-hosted yt-dlp HTTP bridge endpoint (expects `POST { "url": "..." }`).
- `VIDBEE_API_URL` — URL for your self-hosted VidBee HTTP bridge endpoint (expects `POST { "url": "..." }`).

### Supabase Edge Function (`supabase/functions/download/index.ts`)

- `YTDLP_API_URL` — URL for your self-hosted yt-dlp HTTP bridge endpoint (expects `POST { "url": "..." }`).
- `VIDBEE_API_URL` — URL for your self-hosted VidBee HTTP bridge endpoint (expects `POST { "url": "..." }`).

Both bridges should return JSON that includes media links in one of these common shapes:

- `data.medias[]`, `data.links[]`, or `data.urls[]`
- or direct fields like `data.url`, `data.videoUrl`, `data.downloadUrl`.
