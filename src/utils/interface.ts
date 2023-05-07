import { z } from 'zod';

export interface FilterRange {
    min: number;
    max: number;
}

const gameSchema = z.object({
    id: z.number(),
    name: z.string(),
    players: z.object({
        min: z.number().min(1),
        max: z.number().min(1),
    }),
    playtime: z.object({
        min: z.number().min(1),
        max: z.number().min(1),
    }),
    hasExtensions: z.boolean(),
    isExtension: z.boolean(),
    extensions: z.array(z.number()),
    imageUrl: z.string(),
    score: z.number().min(1).max(10),
});

export type Game = z.infer<typeof gameSchema>;