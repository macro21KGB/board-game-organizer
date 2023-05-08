import { z } from 'zod';

export interface FilterRange {
    min: number;
    max: number;
}

export const gameSchema = z.object({
    id: z.number(),
    name: z.string().min(5),
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
    extensions: z.array(z.number()).default([]),
    imageUrl: z.string().nullable().optional().default(null),
    score: z.number().min(1).max(10),
});

export type Game = z.infer<typeof gameSchema>;