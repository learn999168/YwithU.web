import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { addDownload, getUserDownloads, addSearchHistory, getUserSearchHistory } from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Download history procedures
  downloads: router({
    addDownload: protectedProcedure
      .input(
        z.object({
          videoUrl: z.string().url(),
          videoTitle: z.string().optional(),
          videoThumbnail: z.string().optional(),
          videoDuration: z.number().optional(),
          downloadFormat: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const download = await addDownload({
          userId: ctx.user.id,
          videoUrl: input.videoUrl,
          videoTitle: input.videoTitle,
          videoThumbnail: input.videoThumbnail,
          videoDuration: input.videoDuration,
          downloadFormat: input.downloadFormat,
        });
        return download;
      }),

    getHistory: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(50),
        })
      )
      .query(async ({ ctx, input }) => {
        const downloads = await getUserDownloads(ctx.user.id, input.limit);
        return downloads;
      }),
  }),

  // Search history procedures
  search: router({
    addSearchQuery: protectedProcedure
      .input(
        z.object({
          searchQuery: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const search = await addSearchHistory({
          userId: ctx.user.id,
          searchQuery: input.searchQuery,
        });
        return search;
      }),

    getHistory: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(20),
        })
      )
      .query(async ({ ctx, input }) => {
        const history = await getUserSearchHistory(ctx.user.id, input.limit);
        return history;
      }),
  }),
});

export type AppRouter = typeof appRouter;
