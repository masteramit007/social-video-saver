# Cloudflare Worker — SEO Prerender Proxy

This Cloudflare Worker sits in front of your Lovable Cloud app and serves pre-rendered HTML with correct SEO metadata to search engine crawlers and social media bots.

## How It Works

1. **Bot visits** → Worker detects crawler user-agent → Serves lightweight HTML with correct `<title>`, `<meta>`, Open Graph, and canonical tags
2. **Human visits** → Worker proxies the request to Lovable Cloud → Normal SPA experience

## Supported Bots

Googlebot, Bingbot, Yandex, Baidu, DuckDuckBot, Facebook, Twitter, LinkedIn, WhatsApp, Telegram, Discord, Pinterest, Reddit, Apple, and more.

## Setup Instructions (One-Time, ~10 minutes)

### 1. Create a free Cloudflare account

Go to [cloudflare.com](https://dash.cloudflare.com/sign-up) and sign up (free).

### 2. Transfer your domain's DNS to Cloudflare

- Add your domain `socialmediavideodownload.com` to Cloudflare
- Update your domain registrar's nameservers to the ones Cloudflare provides
- Wait for DNS propagation (can take up to 24 hours)

### 3. Add a DNS record pointing to Lovable Cloud

In Cloudflare DNS settings, add:
- **Type:** CNAME
- **Name:** `@` (or `socialmediavideodownload.com`)
- **Target:** `vid-stream-direct.lovable.app`
- **Proxy status:** ✅ Proxied (orange cloud ON)

### 4. Install Wrangler CLI

```bash
npm install -g wrangler
wrangler login
```

### 5. Deploy the Worker

```bash
cd cloudflare-worker
wrangler deploy
```

### 6. Add the route

In Cloudflare Dashboard → Workers & Pages → your worker → Settings → Triggers:
- Add route: `socialmediavideodownload.com/*`
- Select your zone

Or uncomment the `routes` section in `wrangler.toml` and redeploy.

## Testing

```bash
# Should return prerendered HTML with TikTok-specific meta tags:
curl -A "Googlebot" https://socialmediavideodownload.com/download/tiktok

# Should return the normal SPA:
curl https://socialmediavideodownload.com/download/tiktok
```

## Costs

Cloudflare Workers free tier: **100,000 requests/day** — more than enough for bot traffic.

## Updating SEO Data

Edit `worker.js` → update the `P`, `L`, or `STATIC` objects → run `wrangler deploy`.
