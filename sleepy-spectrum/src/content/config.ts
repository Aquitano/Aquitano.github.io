import { defineCollection, z } from 'astro:content';

export const collections = {
    project: defineCollection({
        schema: z.object({
            title: z.string(),
            description: z.string(),
            featured: z.boolean(),
            tags: z.array(z.string()).optional(),
            category: z.string().default('Project'),
            year: z.number(),
            share: z
                .object({
                    title: z.string().optional(),
                    description: z.string().optional(),
                    image: z.string().optional(),
                })
                .optional(),
            links: z
                .object({
                    github: z.string().optional(),
                    website: z.string().optional(),
                })
                .optional(),
        }),
    }),
};
