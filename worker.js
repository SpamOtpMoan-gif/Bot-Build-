export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Trigger build via GitHub API
    if (path === '/build' && request.method === 'POST') {
      const githubToken = env.GITHUB_TOKEN || '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';
      const repo = 'SpamOtpMoan-gif/Bot-Build-';
      
      const response = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/build.yml/dispatches`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'XOW-Telegram-Builder'
        },
        body: JSON.stringify({
          ref: 'main'
        })
      });

      if (response.ok) {
        return new Response('✅ Build triggered successfully!', { status: 200 });
      } else {
        const err = await response.text();
        return new Response(`❌ Failed: ${err}`, { status: 500 });
      }
    }

    // Get latest build status
    if (path === '/status' && request.method === 'GET') {
      const githubToken = env.GITHUB_TOKEN || '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';
      const repo = 'SpamOtpMoan-gif/Bot-Build-';
      
      const response = await fetch(`https://api.github.com/repos/${repo}/actions/runs?branch=main&status=completed&per_page=1`, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'User-Agent': 'XOW-Telegram-Builder'
        }
      });
      
      const data = await response.json();
      const run = data.workflow_runs?.[0] || { status: 'no-run', conclusion: 'unknown' };
      return new Response(JSON.stringify({
        status: run.status,
        conclusion: run.conclusion,
        url: run.html_url || null
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Default response
    return new Response('☠️ XOW Telegram Bot Builder Worker Aktif ☠️\nGunakan POST /build untuk trigger build', { status: 200 });
  }
};
