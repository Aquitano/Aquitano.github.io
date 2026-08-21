import { describe, expect, test } from 'bun:test';
import { negotiateRequest, parseAccept, preferredType } from '../src/lib/contentNegotiation';
import vercelMiddleware from '../middleware';

const origin = 'https://thomasbreindl.me';

const operations = () => ({
    next: (init?: ResponseInit) =>
        new Response(null, {
            status: 200,
            headers: { ...Object.fromEntries(new Headers(init?.headers)), 'x-middleware-next': '1' },
        }),
    rewrite: (destination: string | URL, init?: ResponseInit) =>
        new Response(null, {
            status: 200,
            headers: {
                ...Object.fromEntries(new Headers(init?.headers)),
                'x-middleware-rewrite': destination.toString(),
            },
        }),
});

describe('Accept parsing', () => {
    test('parses media ranges, parameters, q-values and client order', () => {
        expect(parseAccept('text/markdown; q=0.9, text/html, */*;q=0.1')).toEqual([
            { type: 'text/markdown', q: 0.9, specificity: 2, position: 0 },
            { type: 'text/html', q: 1, specificity: 2, position: 1 },
            { type: '*/*', q: 0.1, specificity: 0, position: 2 },
        ]);
    });

    test('honors q-values, client-order ties, wildcards and explicit rejection', () => {
        expect(preferredType('text/html;q=0.5, text/markdown', ['text/html', 'text/markdown'])).toBe('text/markdown');
        expect(preferredType('text/markdown, text/html', ['text/html', 'text/markdown'])).toBe('text/markdown');
        expect(preferredType('text/*', ['text/html', 'text/markdown'])).toBe('text/html');
        expect(preferredType('text/html;q=0, */*;q=1', ['text/html'])).toBeNull();
        expect(preferredType('application/pdf', ['text/html', 'text/markdown'])).toBeNull();
    });
});

describe('response negotiation', () => {
    test('uses Vercel’s official rewrite helper in the deployed middleware entrypoint', () => {
        const response = vercelMiddleware(new Request(`${origin}/`, { headers: { accept: 'text/markdown' } }));

        expect(response.headers.get('x-middleware-rewrite')).toBe(`${origin}/index.md`);
        expect(response.headers.get('vary')).toBe('Accept, Accept-Encoding');
    });

    test('serves Markdown from a canonical URL with protocol headers', async () => {
        const response = negotiateRequest(
            new Request(`${origin}/`, { headers: { accept: 'text/markdown' } }),
            operations(),
        );

        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
        expect(response.headers.get('vary')).toBe('Accept, Accept-Encoding');
        expect(response.headers.get('x-middleware-rewrite')).toBe(`${origin}/index.md`);
    });

    test('keeps HTML and adds Vary plus a Markdown alternate', async () => {
        const response = negotiateRequest(
            new Request(`${origin}/`, { headers: { accept: 'text/html' } }),
            operations(),
        );

        expect(response.headers.get('vary')).toBe('Accept, Accept-Encoding');
        expect(response.headers.get('link')).toBe('</index.md>; rel="alternate"; type="text/markdown"');
        expect(response.headers.get('x-middleware-next')).toBe('1');
    });

    test('returns a real Markdown 404 with recovery content for unknown paths', async () => {
        const response = negotiateRequest(
            new Request(`${origin}/definitely-missing`, { headers: { accept: 'text/markdown' } }),
            operations(),
        );

        expect(response.status).toBe(404);
        expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
        expect(await response.text()).toContain('/llms.txt');
    });

    test('continues unknown browser requests to Vercel’s branded HTML 404', () => {
        const response = negotiateRequest(
            new Request(`${origin}/definitely-missing`, { headers: { accept: 'text/html' } }),
            operations(),
        );

        expect(response.status).toBe(200);
        expect(response.headers.get('x-middleware-next')).toBe('1');
        expect(response.headers.get('vary')).toBe('Accept, Accept-Encoding');
    });

    test('returns 406 when the client rejects both available representations', async () => {
        const response = negotiateRequest(
            new Request(`${origin}/`, { headers: { accept: 'application/pdf' } }),
            operations(),
        );

        expect(response.status).toBe(406);
        expect(response.headers.get('vary')).toBe('Accept, Accept-Encoding');
    });

    test('does not mislabel an existing HTML-only route as missing', async () => {
        const response = negotiateRequest(
            new Request(`${origin}/showcase/griffin`, { headers: { accept: 'text/markdown' } }),
            operations(),
        );

        expect(response.status).toBe(406);
    });

    test('does not intercept assets or non-read methods', async () => {
        expect(negotiateRequest(new Request(`${origin}/app.css`), operations()).headers.get('x-middleware-next')).toBe(
            '1',
        );
        expect(
            negotiateRequest(new Request(`${origin}/about`, { method: 'POST' }), operations()).headers.get(
                'x-middleware-next',
            ),
        ).toBe('1');
    });
});
