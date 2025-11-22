export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/generate") {
      return new Response("Generated test post from GitHub build");
    }

    if (url.pathname === "/feed") {
      return new Response("<rss><channel><title>PlayReport</title></channel></rss>", {
        headers: { "Content-Type": "application/xml" },
      });
    }

    return new Response("PlayReport ZA Autoposter from GitHub");
  },
};
