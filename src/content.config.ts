import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const work = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            wrap: z.array(z.string()).optional(),
            subtitle: z.string(),
            year: z.string(),
            description: z.string(),
            tags: z.array(z.string()),
            tasks: z.array(z.string()),
            links: z
                .array(z.object({ label: z.string(), href: z.string(), external: z.boolean().optional() }))
                .default([]),
            accent: z.string(),
            image: image().optional(),
            order: z.number(),
        }),
});

// Reads the agent-facing Markdown in public/ so the HTML page and /privacy.md share one source.
const legal = defineCollection({
    loader: glob({ pattern: 'privacy.md', base: './public' }),
});

export const collections = { work, legal };
