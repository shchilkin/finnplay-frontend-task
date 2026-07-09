import { z } from "zod";

export const gameSchema = z.object({
  id: z.number(),
  name: z.string(),
  provider: z.number(),
  cover: z.url(),
  coverLarge: z.url(),
  date: z.iso.datetime(),
});

export const providerSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string(),
});

export const gameGroupSchema = z.object({
  id: z.number(),
  name: z.string(),
  games: z.array(z.number()),
});

// TODO: Add a test that validates data.json against this schema when a test runner is added.
export const catalogDataSchema = z.object({
  games: z.array(gameSchema),
  providers: z.array(providerSchema),
  groups: z.array(gameGroupSchema),
});

export const catalogResponseSchema = catalogDataSchema;

export const usernameSchema = z.enum(["player1", "player2"]);

export const loginRequestSchema = z.object({
  username: usernameSchema,
  password: z.string(),
});

export const currentUserResponseSchema = z.object({
  username: usernameSchema.nullable(),
});

export type Game = z.infer<typeof gameSchema>;
export type Provider = z.infer<typeof providerSchema>;
export type GameGroup = z.infer<typeof gameGroupSchema>;
export type CatalogData = z.infer<typeof catalogDataSchema>;
export type CatalogResponse = z.infer<typeof catalogResponseSchema>;
export type Username = z.infer<typeof usernameSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type CurrentUserResponse = z.infer<typeof currentUserResponseSchema>;
