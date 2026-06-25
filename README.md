# Cloudflare Resend Worker

A single Cloudflare Worker endpoint that sends emails using the [Resend](https://resend.com) SDK.

## Endpoint

`POST /`

Requires `Authorization: Bearer <AUTH_TOKEN>` header.

## Request body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `from` | string | yes | Sender address. The domain must be verified in Resend. |
| `to` | string or string[] | yes | Recipient address(es). |
| `subject` | string | yes | Email subject. |
| `html` | string | no | HTML email body. Required if `text` is not provided. |
| `text` | string | no | Plain-text fallback. Sent as `html` when `html` is omitted. |

Either `html` or `text` must be provided.

## Example

```bash
curl -X POST https://<your-worker-domain>/ \
  -H "Authorization: Bearer <AUTH_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "Sender <noreply@example.com>",
    "to": "recipient@example.com",
    "subject": "Hello",
    "text": "Hello from the Resend worker!"
  }'
```

## Development

```bash
npm install
npx wrangler dev
```

## Deploy

```bash
npx wrangler deploy
```

## Secrets

Set runtime secrets with:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put AUTH_TOKEN
```
