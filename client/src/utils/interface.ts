import { z } from 'zod';

export interface FilterRange {
    min: number;
    max: number;
}

export type ExtensionType = Pick<Game, "key" | "name" | "slug" | "score" | "imageUrl">;

export interface ResponsePayload {
    success: boolean,
    message: string
}

export const filterMapSchema = z.object({
    players: z.object({
        min: z.number().min(1),
        max: z.number().min(1),
    }),
    playTime: z.object({
        min: z.number().min(1),
        max: z.number().min(1),
    }),
    score: z.object({
        min: z.number().min(1),
        max: z.number().min(1),
    }),
});

export type FilterMap = z.infer<typeof filterMapSchema>;

export const gameSchema = z.object({
    key: z.string(),
    name: z.string().min(2),
    slug: z.string().min(2),
    players: z.object({
        min: z.number().min(1),
        max: z.number().min(1),
    }),
    playTime: z.object({
        min: z.number().min(1),
        max: z.number().min(1),
    }),
    hasExtensions: z.boolean().optional().default(false),
    isExtension: z.boolean().optional().default(false),
    extensions: z.array(z.object({ name: z.string(), key: z.string() })).default([]),
    imageUrl: z.any().optional().nullable().default(null),
    score: z.number().min(1).max(10),
});

export type Game = z.infer<typeof gameSchema>;


const modifyGameHookSchema = z.tuple([z.boolean(), gameSchema.optional().nullable()]);
export type ModifyGameHook = z.infer<typeof modifyGameHookSchema>;
