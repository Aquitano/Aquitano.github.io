import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

export const collections = {
    project: defineCollection({
        loader: glob({ pattern: '**/*.md', base: './src/content/project' }),
        schema: z.object({
            title: z.string(),
            name: z.string(),
            description: z.string(),
            featured: z.boolean(),
            tags: z.array(z.string()),
            tasks: z.array(z.string()),
            fullImage: z.string().optional(),
            year: z.number(),
            share: z
                .object({
                    title: z.string().optional(),
                    description: z.string().optional(),
                    image: z.string().optional(),
                })
                .optional(),
            links: z
                .array(
                    z.object({
                        text: z.string(),
                        icon: z.string(),
                        link: z.string(),
                    }),
                )
                .optional(),
        }),
    }),
};
