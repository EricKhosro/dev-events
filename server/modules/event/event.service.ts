import { v2 as cloudinary } from "cloudinary";
import { EventRepository } from "./event.repository";
import { getSafeUserInfo } from "../user/user.action";
import { Role } from "@/shared/constants/constant";
import { IEvent } from "@/shared/types/event.types";
import { IUser } from "@/shared/types/auth.types";
import { Types } from "mongoose";
import { EventSchema } from "./event.model";

export const EventService = {
  async createEvent(
    eventDTO: any,
    file: File,
    tags: string,
    agenda: string,
    user: IUser
  ) {
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    const eventData = {
      ...eventDTO,
      image: uploadResult.secure_url,
      tags: tags.split(","),
      agenda: agenda.split(","),
      createdBy: user._id,
      approved: user.role === Role.Admin ? true : false,
    };

    return EventRepository.create(eventData);
  },

  async fetchEvents(filter: Record<string, unknown> = {}) {
    return EventRepository.findMany(filter);
  },

  async fetchVisibleEvents(user: (IUser & { _id: Types.ObjectId }) | null) {
    let filter: any = {};
    if (!user) filter = { approved: true };
    else if (user && user.role === Role.Admin) filter = {};
    else
      filter = {
        $or: [{ approved: true }, { createdBy: user._id }],
      };

    return this.fetchEvents(filter);
  },

  async fetchEventBySlug(slug: string): Promise<EventSchema | null> {
    const sanitizedSlug = this.sanitizeSlug(slug);
    const event = await EventRepository.findBySlug(sanitizedSlug);
    if (!event) return null;
    if (event.approved) return event;

    const user = await getSafeUserInfo();
    if (!user) return null;
    if (
      user.role === Role.Admin ||
      user._id.toString() === event.createdBy.toString()
    )
      return event;

    return null;
  },

  async fetchSimilarEventsBySlug(slug: string, options?: { limit: number }) {
    const sanitizedSlug = this.sanitizeSlug(slug);
    const event = await EventRepository.findBySlug(sanitizedSlug);
    const user = await getSafeUserInfo();
    const isAdmin = user && user.role === Role.Admin ? true : false;

    return await EventRepository.findSimilarEventsBySlug(
      sanitizedSlug,
      event?.tags,
      {
        limit: options?.limit || 5,
        includeUnapproved: isAdmin,
      }
    );
  },

  sanitizeSlug(slug: string) {
    return slug.trim().toLowerCase();
  },
};
