import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const work = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
    schema: z.object({
        title: z.string(),
        wrap: z.array(z.string()).optional(),
        subtitle: z.string(),
        year: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        tasks: z.array(z.string()),
        links: z.array(z.object({ label: z.string(), href: z.string(), external: z.boolean().optional() })).default([]),
        accent: z.string(),
        order: z.number(),
    }),
});

export const collections = { work };
