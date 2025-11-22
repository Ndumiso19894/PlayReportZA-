export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/generate") {
      return handleGenerate(env);
    }

    if (url.pathname === "/feed") {
      return generateRSS(env);
    }

    return new Response("PlayReport ZA Autoposter is running");
  },
};

const STORAGE_KEY = "rss_feed_data";

// Create dummy post for testing
async function handleGenerate(env) {
  const stored = await env.POSTSTORE.get(STORAGE_KEY);
  const list = stored ? JSON.parse(stored) : [];

  const now = new Date();
  const caption = `🔥 PlayReport Test Post – ${now.toISOString()}`;

  const newPost = {
    title: caption.substring(0, 50),
    link: "https://www.facebook.com/profile.php?id=61580020167189",
    description: caption,
    pubDate: now.toUTCString(),
  };

  list.unshift(newPost);

  await env.POSTSTORE.put(STORAGE_KEY, JSON.stringify(list.slice(0, 20)));

  return new Response("Dummy post saved");
}

// Build RSS Feed
async function generateRSS(env) {
  const stored = await env.POSTSTORE.get(STORAGE_KEY);
  const items = stored ? JSON.parse(stored) : [];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>PlayReport ZA AutoFeed</title>
<link>https://www.facebook.com/profile.php?id=61580020167189</link>
<description>Automatic posts</description>
`;

  for (const item of items) {
    xml += `
<item>
<title><![CDATA[${item.title}]]></title>
<link>${item.link}</link>
<description><![CDATA[${item.description}]]></description>
<pubDate>${item.pubDate}</pubDate>
</item>`;
  }

  xml += `
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
      }
