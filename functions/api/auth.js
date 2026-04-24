/**
 * Decap CMS OAuth entry point. Replaces the deprecated Netlify public relay.
 *
 * Flow (this file handles step 1):
 *   1. Decap opens /api/auth?provider=github&site_id=...&scope=repo
 *   2. We redirect the user to github.com/login/oauth/authorize with our
 *      client_id + redirect_uri back to /api/callback + CSRF state token.
 *   3. GitHub bounces the user to /api/callback (handled in callback.js).
 *
 * Env vars required (set in CF Pages → Settings → Environment variables):
 *   OAUTH_CLIENT_ID      — public; from the GitHub OAuth App
 *   OAUTH_CLIENT_SECRET  — encrypted; from the GitHub OAuth App
 */
export async function onRequest(context) {
    const { env, request } = context;
    const url = new URL(request.url);

    if (!env.OAUTH_CLIENT_ID) {
        return new Response('OAUTH_CLIENT_ID not configured on the CF Pages project.', {
            status: 500,
            headers: { 'content-type': 'text/plain' },
        });
    }

    // Decap only requests `repo` by default. Accept scope from the query so
    // future needs (e.g. user:email for author attribution) are configurable
    // without code changes.
    const scope = url.searchParams.get('scope') || 'repo,user';

    // Random state for CSRF protection. Stored in an HttpOnly cookie the
    // callback will verify against.
    const state = crypto.randomUUID();

    const githubAuth = new URL('https://github.com/login/oauth/authorize');
    githubAuth.searchParams.set('client_id', env.OAUTH_CLIENT_ID);
    githubAuth.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
    githubAuth.searchParams.set('scope', scope);
    githubAuth.searchParams.set('state', state);

    return new Response(null, {
        status: 302,
        headers: {
            'Location': githubAuth.toString(),
            // SameSite=Lax lets the cookie survive GitHub's redirect back.
            'Set-Cookie': `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
            'Cache-Control': 'no-store',
        },
    });
}
