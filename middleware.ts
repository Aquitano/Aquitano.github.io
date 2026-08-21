import { next, rewrite } from '@vercel/functions';
import { negotiateRequest } from './src/lib/contentNegotiation';

export default function middleware(request: Request): Response {
    return negotiateRequest(request, { next, rewrite });
}

export const config = {
    matcher: '/:path*',
};
