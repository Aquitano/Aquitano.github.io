type AcceptEntry = {
    type: string;
    q: number;
    specificity: number;
    position: number;
};

type MiddlewareInit = {
    headers?: HeadersInit;
    status?: number;
};

export type RoutingOperations = {
    next: (init?: MiddlewareInit) => Response;
    rewrite: (destination: string | URL, init?: MiddlewareInit) => Response;
};

const HTML = 'text/html';
const MARKDOWN = 'text/markdown';
const VARY = 'Accept, Accept-Encoding';

export const markdownRoutes = new Map<string, string>([
    ['/', '/index.md'],
    ['/work/aqt-sync', '/work/aqt-sync.md'],
    ['/work/aqt-health', '/work/aqt-health.md'],
    ['/work/chill-flow', '/work/chill-flow.md'],
    ['/work/frontiers-to-space', '/work/frontiers-to-space.md'],
    ['/work/bettergaming', '/work/bettergaming.md'],
    ['/work/griffin-energy', '/work/griffin-energy.md'],
]);

const htmlOnlyRoutes = new Set([
    '/showcase/griffin',
    '/showcase/griffin/Product',
    '/showcase/griffin/Product2',
    '/showcase/griffin/Donation-Code',
]);

export const markdownNotFound = `# 404 — Page not found

The requested path does not exist on thomasbreindl.me.

Try one of these recovery points:

- [Portfolio home](/)
- [Complete sitemap](/sitemap-index.xml)
- [Agent instructions and content index](/llms.txt)
- [About Thomas Breindl](/about.md)
- [Contact](/contact.md)

Check the URL spelling or use the sitemap to locate a project page.
`;

const normalizePath = (pathname: string): string => (pathname === '/' ? pathname : pathname.replace(/\/+$/, ''));

export function parseAccept(header: string): AcceptEntry[] {
    return header
        .split(',')
        .map((raw, position) => {
            const parts = raw
                .trim()
                .split(';')
                .map((part) => part.trim());
            const type = parts[0]?.toLowerCase() ?? '';
            let q = 1;

            for (const parameter of parts.slice(1)) {
                const separator = parameter.indexOf('=');
                if (separator === -1) continue;
                const name = parameter.slice(0, separator).trim().toLowerCase();
                const value = parameter.slice(separator + 1).trim();
                if (name !== 'q') continue;
                const parsed = Number(value);
                q = Number.isFinite(parsed) ? Math.max(0, Math.min(1, parsed)) : 0;
            }

            const specificity = type === '*/*' ? 0 : type.endsWith('/*') ? 1 : 2;
            return { type, q, specificity, position };
        })
        .filter((entry) => /^(?:\*|[a-z0-9!#$&^_.+-]+)\/(?:\*|[a-z0-9!#$&^_.+-]+)$/.test(entry.type));
}

const matches = (entry: AcceptEntry, candidate: string): boolean => {
    if (entry.type === '*/*') return true;
    if (entry.type.endsWith('/*')) return candidate.startsWith(entry.type.slice(0, -1));
    return entry.type === candidate;
};

export function preferredType(header: string | null, produces: string[]): string | null {
    if (!header?.trim()) return produces[0] ?? null;
    const entries = parseAccept(header);
    if (entries.length === 0) return null;

    let best: { type: string; q: number; position: number } | null = null;

    for (const candidate of produces) {
        let match: AcceptEntry | null = null;
        for (const entry of entries) {
            if (!matches(entry, candidate)) continue;
            if (
                !match ||
                entry.specificity > match.specificity ||
                (entry.specificity === match.specificity && entry.position < match.position)
            ) {
                match = entry;
            }
        }

        if (!match || match.q <= 0) continue;
        if (!best || match.q > best.q || (match.q === best.q && match.position < best.position)) {
            best = { type: candidate, q: match.q, position: match.position };
        }
    }

    return best?.type ?? null;
}

const notAcceptable = (available: string): Response =>
    new Response(`Not Acceptable\n\nAvailable: ${available}\n`, {
        status: 406,
        headers: {
            'content-type': 'text/plain; charset=utf-8',
            vary: VARY,
        },
    });

export function negotiateRequest(request: Request, operations: RoutingOperations): Response {
    if (request.method !== 'GET' && request.method !== 'HEAD') return operations.next();

    const { pathname } = new URL(request.url);
    const normalizedPath = normalizePath(pathname);

    // Explicit files already identify their representation. vercel.json sets
    // the direct Markdown sibling headers without invoking negotiation.
    if (pathname.split('/').at(-1)?.includes('.')) return operations.next();

    const markdownAsset = markdownRoutes.get(normalizedPath);
    const isKnownHtmlRoute = Boolean(markdownAsset) || htmlOnlyRoutes.has(normalizedPath);
    const accept = request.headers.get('accept');

    // Prefer the recovery representation when an agent asks for Markdown at a
    // path that is not part of the generated route set.
    if (!isKnownHtmlRoute && preferredType(accept, [HTML, MARKDOWN]) === MARKDOWN) {
        return new Response(request.method === 'HEAD' ? null : markdownNotFound, {
            status: 404,
            headers: {
                'content-type': 'text/markdown; charset=utf-8',
                vary: VARY,
            },
        });
    }

    const produces = markdownAsset ? [HTML, MARKDOWN] : [HTML];
    const chosen = preferredType(accept, produces);

    if (!chosen) return notAcceptable(markdownAsset ? `${HTML}, ${MARKDOWN}` : HTML);

    if (chosen === MARKDOWN && markdownAsset) {
        return operations.rewrite(new URL(markdownAsset, request.url), {
            headers: {
                'content-type': 'text/markdown; charset=utf-8',
                vary: VARY,
            },
        });
    }

    const headers: Record<string, string> = { vary: VARY };
    if (markdownAsset) {
        headers.link = `<${markdownAsset}>; rel="alternate"; type="text/markdown"`;
    }
    return operations.next({ headers });
}
