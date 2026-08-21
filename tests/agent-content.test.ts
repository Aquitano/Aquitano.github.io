import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { markdownNotFound } from '../src/lib/contentNegotiation';

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

describe('agent instruction and recovery files', () => {
    test('llms.txt provides specific when-to-use and invocation guidance', async () => {
        const llms = await read('public/llms.txt');
        expect(llms).toContain('## When to use this site');
        expect(llms).toContain('## How agents should use it');
        expect(llms).toContain('Accept: text/markdown');
        expect(llms).toContain('contact@thomasbreindl.me');
    });

    test('Markdown 404 links to recovery indexes', async () => {
        const notFound = await read('public/404.md');
        expect(notFound).toContain('/sitemap-index.xml');
        expect(notFound).toContain('/llms.txt');
        expect(notFound).toContain('/contact');
        expect(notFound).toBe(markdownNotFound);
    });
});

describe('Markdown information pages', () => {
    for (const page of ['about', 'contact', 'privacy']) {
        test(`${page}.md has substantial content`, async () => {
            const markdown = await read(`public/${page}.md`);
            expect(markdown.length).toBeGreaterThan(500);
        });
    }
});
