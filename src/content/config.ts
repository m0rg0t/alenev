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

const archivesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Core fields
    title: z.string(),
    originalUrl: z.string().url(),
    sourceName: z.string(),
    category: z.enum(['article', 'media', 'achievement']),

    // Dates
    archiveDate: z.date(),
    publishDate: z.date().optional(),

    // Description
    description: z.string().optional(),

    // Media
    coverImage: z.string().optional(),
    images: z.array(z.string()).optional(),
    videos: z.array(z.object({
      url: z.string(),
      thumbnail: z.string().optional(),
      title: z.string().optional(),
    })).optional(),

    // Optional metadata
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  cosplay: cosplayCollection,
  archives: archivesCollection,
};
