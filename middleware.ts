import { next, rewrite } from '@vercel/functions';
import { negotiateRequest } from './src/lib/contentNegotiation';

export default function middleware(request: Request): Response {
    return negotiateRequest(request, { next, rewrite });
}

export const config = {
    // Skips any path whose last segment has a dot, so static files never invoke the middleware,
    // and the /ingest analytics proxy, whose JSON requests would otherwise get a 406.
    matcher: '/((?!ingest/|.*\\.[^/]*$).*)',
};
