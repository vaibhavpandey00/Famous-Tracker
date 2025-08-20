import { z } from "zod";

// Replicating Prisma Enums for frontend validation
const CATEGORIES = [
    "ATHLETE", "INFLUENCER", "MUSICIAN", "ACTOR", "ENTREPRENEUR",
];

const SUBCATEGORIES = [
    "NFL", "NBA", "WNBA", "MLB", "MLS", "PREMIER_LEAGUE", "NHL", "PGA_TOUR", "FORMULA_1",
    "X", "FACEBOOK", "INSTAGRAM", "YOUTUBE", "TIKTOK", "TWITCH", "TWITTER"
];

export const celebrityEditSchema = z.object({
    fullName: z.string().trim().min(1, { message: "Full name cannot be empty." }),

    categories: z.array(z.enum(CATEGORIES))
        .min(1, { message: "At least one category is required." }),

    subcategories: z.array(z.enum(SUBCATEGORIES)).optional(),

    socials: z.array(z.object({
        platform: z.string().trim().min(1, { message: "Platform name is required." }),
        link: z.string().trim().url({ message: "Please enter a valid URL." }),
    }))
        .optional(),

    location: z.object({
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
    })
        .optional(),

    league: z.string().optional(),
    team: z.string().optional(),
    position: z.string().optional(),

    // Special validation for maxFollowerCount as a string
    maxFollowerCount: z.string()
        .optional()
        .nullable()
        .refine(val => !val || /^\d+$/.test(val), {
            // This regex ensures the string only contains digits from start to end.
            message: "Follower count must only contain numbers.",
        }),

    maxFollowerDisplay: z.string().optional().nullable(),

    notableAchievements: z.array(z.string()).optional(),

    notes: z.string().optional(),
});