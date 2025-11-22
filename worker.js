export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/post") {
      return postToFacebook(env);
    }

    return new Response("PlayReport ZA Autoposter is running");
  }
}

// POST TO FACEBOOK SAFELY
async function postToFacebook(env) {
  const pageId = "61580020167189";   // Your Page ID
  const token = env.FB_PAGE_TOKEN;   // Safely stored token

  // Test caption (we replace this later with live football)
  const message = "🔥 Test auto-post from PlayReport ZA — Worker is LIVE!";

  const formData = new FormData();
  formData.append("message", message);

  const res = await fetch(
    `https://graph.facebook.com/${pageId}/feed?access_token=${token}`,
    {
      method: "POST",
      body: formData
    }
  );

  const result = await res.text();
  return new Response(result, {
    headers: { "Content-Type": "application/json" }
  });
}
