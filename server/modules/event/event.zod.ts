import { EventMode } from "@/shared/constants/constant";
import { z } from "zod";

export const CreateEventSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).toLowerCase(),
  description: z.string().min(8),
  overview: z.string().min(8),
  image: z.file(),
  venue: z.string(),
  location: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  mode: z.enum([EventMode.Hybrid, EventMode.Offline, EventMode.Online]),
  audience: z.string(),
  agenda: z.string(),
  organizer: z.string(),
  tags: z.string(),
});
