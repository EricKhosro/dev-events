// server/modules/event/event.repository.ts
import connectDB from "@/server/db/mongodb";
import Event, { EventSchema } from "./event.model";
import { IEvent } from "@/shared/types/event.types";

export const EventRepository = {
  async create(data: Partial<IEvent>) {
    await connectDB();
    return Event.create(data);
  },

  async findMany(filter: Record<string, unknown> = {}) {
    await connectDB();
    return Event.find(filter)
      .populate("createdBy", "username")
      .sort({ createdAt: -1 })
      .lean<IEvent[]>();
  },

  async findBySlug(slug: string) {
    await connectDB();

    const query: Record<string, unknown> = { slug };

    return Event.findOne(query).lean<EventSchema | null>();
  },

  async findSimilarEventsBySlug(
    excludedSlug: string,
    wantedTags?: string[],
    options?: { includeUnapproved?: boolean; limit: number }
  ) {
    await connectDB();
    const query: any = { slug: { $ne: excludedSlug } };
    if (wantedTags && wantedTags.length) query.tags = { $in: wantedTags };
    if (!options || !options.includeUnapproved) query.approved = 1;

    return Event.find(query)
      .sort({ createdAt: -1 })
      .limit(options?.limit || 5)
      .lean<IEvent[]>();
  },
};
