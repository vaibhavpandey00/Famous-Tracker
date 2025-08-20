import { z } from "zod";

// Replicating Prisma Enums for validation
const CATEGORIES = [
    "ATHLETE",
    "INFLUENCER",
    "MUSICIAN",
    "ACTOR",
    "ENTREPRENEUR",
];

const SUBCATEGORIES = [
    "NFL", "NBA", "WNBA", "MLB", "MLS", "PREMIER_LEAGUE", "NHL", "PGA_TOUR", "FORMULA_1",
    "X", "FACEBOOK", "INSTAGRAM", "YOUTUBE", "TIKTOK", "TWITCH", "TWITTER"
];

// Zod schema for an individual celebrity record from the JSON file
const globalCelebrityImportSchema = z.object({
    fullName: z.string().min(1, { message: "fullName cannot be empty" }),
    normalizedName: z.string().min(1, { message: "normalizedName cannot be empty" }),

    categories: z.array(z.enum(CATEGORIES)),
    subcategories: z.array(z.enum(SUBCATEGORIES)).optional().default([]),

    socials: z.array(
        z.object({
            platform: z.string(),
            link: z.string().url({ message: "Invalid URL in socials link" }),
        })
    ),

    location: z.object({
        city: z.string().nullable(),
        state: z.string().nullable(),
        country: z.string(),
    }).nullable(),

    league: z.string().nullable(),
    team: z.string().nullable(),
    position: z.string().nullable(),

    // Special handling for BigInt
    // JSON supports numbers, but Prisma needs a BigInt. Zod's transform handles the conversion.
    maxFollowerCount: z.number().int().positive().nullable().transform(val =>
        val !== null ? BigInt(val) : null
    ),

    maxFollowerDisplay: z.string().nullable(),
    notableAchievements: z.array(z.string()),
    notes: z.string().nullable(),
});

export const bulkImportSchema = z.array(globalCelebrityImportSchema);