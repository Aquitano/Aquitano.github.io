import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
    schema: z.object({
        title: z.string(),
        // optional manual line breaks for the oversized display title
        wrap: z.array(z.string()).optional(),
        subtitle: z.string(),
        year: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        tasks: z.array(z.string()),
        links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
        accent: z.string(),
        // display + navigation order across the work section
        order: z.number(),
    }),
});

export const collections = { work };
