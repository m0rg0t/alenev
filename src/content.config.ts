import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Costumes — characters/outfits with materials, links, franchise info
const costumesCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/costumes' }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(['ru', 'en']),
    costumeId: z.string(),
    character: z.string().optional(),
    franchise: z.string().optional(),
    coverImage: z.string(),
    date: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    materials: z.array(z.string()).optional(),
    buildTime: z.string().optional(),
    guideUrl: z.string().url().optional(),
    articleUrl: z.string().url().optional(),
    socialLinks: z.array(z.object({
      platform: z.string(),
      url: z.string().url(),
    })).optional(),
    participants: z.array(z.object({
      name: z.string(),
      role: z.string().optional(),
      url: z.string().url().optional(),
    })).optional(),
    videos: z.array(z.object({
      url: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      embed: z.enum(['youtube', 'vk']).optional(),
      oid: z.union([z.string(), z.number()]).optional(),
      videoId: z.union([z.string(), z.number()]).optional(),
      hash: z.string().optional(),
    })).optional(),
    order: z.number().optional(),
  }),
});

// Photo shoots — individual sessions linked to a costume
const cosplayCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/cosplay' }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(['ru', 'en']),
    costume: z.string(),
    folder: z.string(),
    coverImage: z.string(),
    date: z.coerce.date().optional(),
    photographer: z.string().optional(),
    photographerUrl: z.string().url().optional(),
    location: z.string().optional(),
    event: z.string().optional(),
    tags: z.array(z.string()).optional(),
    videos: z.array(z.object({
      url: z.string(),
      title: z.string().optional(),
    })).optional(),
    order: z.number().optional(),
  }),
});

// Events — conventions, festivals referencing one or more costumes
const cosplayEventsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/cosplay-events' }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(['ru', 'en']),
    costumeId: z.string(),
    date: z.coerce.date().optional(),
    location: z.string().optional(),
    coverImage: z.string(),
    folder: z.string().optional(),
    tags: z.array(z.string()).optional(),
    costumes: z.array(z.string()),
    socialLinks: z.array(z.object({
      platform: z.string(),
      url: z.string().url(),
    })).optional(),
    videos: z.array(z.object({
      url: z.string(),
      title: z.string().optional(),
    })).optional(),
    order: z.number().optional(),
  }),
});

const archivesCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/archives' }),
  schema: z.object({
    title: z.string(),
    originalUrl: z.string().url(),
    sourceName: z.string(),
    category: z.enum(['article', 'media', 'achievement']),
    archiveDate: z.coerce.date(),
    publishDate: z.coerce.date().optional(),
    description: z.string().optional(),
    coverImage: z.string().optional(),
    images: z.array(z.string()).optional(),
    videos: z.array(z.object({
      url: z.string(),
      thumbnail: z.string().optional(),
      title: z.string().optional(),
    })).optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  costumes: costumesCollection,
  cosplay: cosplayCollection,
  'cosplay-events': cosplayEventsCollection,
  archives: archivesCollection,
};
