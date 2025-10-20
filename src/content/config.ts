import { defineCollection, z } from 'astro:content';

const cosplayCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date().optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  cosplay: cosplayCollection,
};
