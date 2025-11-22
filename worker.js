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

const STORAGE = {
  RSS_FEED: "rss_feed_data",
};

// Create a dummy post and store it
async function handleGenerate(env) {
  const old = await env.POSTSTORE.get(STORAGE.RSS_FEED);
  const previous = old ? JSON.parse(old) : [];

  const now = new Date();
  const caption = `🔥 Test post from PlayReport ZA – ${now.toISOString()}`;

  const newEntry = {
    title: caption.substring(0, 50),
    link: "https://www.facebook.com/profile.php?id=61580020167189",
    description: caption,
    pubDate: now.toUTCString(),
  };

  previous.unshift(newEntry);

  // Keep only latest 20 posts
  await env.POSTSTORE.put(STORAGE.RSS_FEED, JSON.stringify(previous.slice(0, 20)));

  return new Response("Dummy post generated and stored");
}

// Build RSS from stored posts
async function generateRSS(env) {
  const stored = await env.POSTSTORE.get(STORAGE.RSS_FEED);
  const items = stored ? JSON.parse(stored) : [];

  let xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
  <channel>
    <title>PlayReport ZA AutoFeed</title>
    <link>https://www.facebook.com/profile.php?id=61580020167189</link>
    <description>Automatic updates from PlayReport ZA</description>`;

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
