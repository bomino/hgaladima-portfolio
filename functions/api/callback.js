/**
 * Decap CMS OAuth callback. Exchanges the GitHub `code` for an access token
 * and posts it back to the Decap admin window via window.postMessage().
 *
 * Decap handshake protocol (cross-window):
 *   popup (this page)    → opener: 'authorizing:github'
 *   opener               → popup : 'authorizing:github'        (echo ack)
 *   popup                → opener: 'authorization:github:success:{json}'
 *   opener closes popup.
 *
 * The origin of the opener must exactly match where Decap admin is served,
 * i.e. https://hgaladima.com. Using '*' would work but is a XSS footgun —
 * any malicious site could iframe the admin and steal tokens.
 */

const ADMIN_ORIGIN = 'https://hgaladima.com';

export async function onRequest(context) {
    const { env, request } = context;
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const returnedState = url.searchParams.get('state');
    const errorParam = url.searchParams.get('error');

    // GitHub can return an error if the user denied authorization.
    if (errorParam) {
        return errorResponse(`GitHub returned: ${errorParam}`);
    }

    if (!code || !returnedState) {
        return errorResponse('Missing code or state in callback.');
    }

    const cookieHeader = request.headers.get('Cookie') || '';
    const cookieMatch = cookieHeader.match(/oauth_state=([^;]+)/);
    const cookieState = cookieMatch ? cookieMatch[1] : '';

    if (returnedState !== cookieState) {
        return errorResponse('OAuth state mismatch. Possible CSRF — try again.');
    }

    if (!env.OAUTH_CLIENT_ID || !env.OAUTH_CLIENT_SECRET) {
        return errorResponse('OAuth credentials not configured on the server.');
    }

    // Exchange code for access token.
    const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'hgaladima.com-decap-oauth',
        },
        body: JSON.stringify({
            client_id: env.OAUTH_CLIENT_ID,
            client_secret: env.OAUTH_CLIENT_SECRET,
            code,
        }),
    });

    if (!tokenResp.ok) {
        return errorResponse(`GitHub token endpoint returned ${tokenResp.status}.`);
    }

    const tokenData = await tokenResp.json();
    if (!tokenData.access_token) {
        return errorResponse(tokenData.error_description || 'No access_token in GitHub response.');
    }

    const payload = {
        token: tokenData.access_token,
        provider: 'github',
    };

    return successResponse(payload);
}

function successResponse(payload) {
    // Serialize the payload safely for embedding in a <script> tag.
    const safePayload = JSON.stringify(payload).replace(/</g, '\\u003c');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Authorization complete</title>
<style>body{font-family:system-ui,sans-serif;max-width:480px;margin:80px auto;padding:0 20px;text-align:center;color:#333}h1{color:#1976d2}</style>
</head>
<body>
<h1>Signed in</h1>
<p>Returning to the admin panel…</p>
<script>
(function () {
    var PAYLOAD = ${safePayload};
    var PROVIDER = PAYLOAD.provider;
    var ORIGIN = ${JSON.stringify(ADMIN_ORIGIN)};

    function send(msg) {
        if (window.opener) {
            window.opener.postMessage(msg, ORIGIN);
        }
    }

    // Wait for the opener to echo our initial 'authorizing:' message
    // before sending credentials. Decap uses this handshake as ack.
    window.addEventListener('message', function (e) {
        if (e.origin !== ORIGIN) return;
        if (e.data === 'authorizing:' + PROVIDER) {
            send('authorization:' + PROVIDER + ':success:' + JSON.stringify(PAYLOAD));
            setTimeout(function () { window.close(); }, 1500);
        }
    }, false);

    send('authorizing:' + PROVIDER);
})();
</script>
</body>
</html>`;

    return new Response(html, {
        status: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            // Clear the state cookie after successful use.
            'Set-Cookie': 'oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
            'Cache-Control': 'no-store',
        },
    });
}

function errorResponse(message) {
    const safeMessage = String(message).replace(/[<>]/g, '');
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Authorization failed</title>
<style>body{font-family:system-ui,sans-serif;max-width:480px;margin:80px auto;padding:0 20px;text-align:center;color:#333}h1{color:#b00020}code{background:#f6f7f9;padding:2px 6px;border-radius:4px}</style>
</head>
<body>
<h1>Sign-in failed</h1>
<p><code>${safeMessage}</code></p>
<p>You can close this window and try again.</p>
<script>
(function () {
    var ORIGIN = ${JSON.stringify(ADMIN_ORIGIN)};
    if (window.opener) {
        window.opener.postMessage(
            'authorization:github:error:' + JSON.stringify({ message: ${JSON.stringify(safeMessage)} }),
            ORIGIN
        );
        setTimeout(function () { window.close(); }, 3000);
    }
})();
</script>
</body>
</html>`;
    return new Response(html, {
        status: 400,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-store',
        },
    });
}
