import { IBaseResponse } from "@/shared/types/common.types";
import { EventService } from "./event.service";
import { IEvent } from "@/shared/types/event.types";
import { EventMessages } from "./event.messages";

export const GetEventDetails = async (
  slug: string
): Promise<IBaseResponse<IEvent>> => {
  try {
    const event = await EventService.fetchEventBySlug(slug);
    return {
      data: event,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: EventMessages.EventDetailsError,
    };
  }
};

export const getSimilarEventsBySlug = async (
  slug: string
): Promise<IBaseResponse<IEvent[]>> => {
  try {
    const events = await EventService.fetchSimilarEventsBySlug(slug);

    return {
      data: events,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: EventMessages.SimilarEventError,
    };
  }
};
