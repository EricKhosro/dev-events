import EventCard from "@/components/EventCard";
import { getSimilarEventsBySlug } from "@/server/modules/event/event.action";
import toast from "react-hot-toast";

const SimilarEvents = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const { data, error } = await getSimilarEventsBySlug(slug);

  if (error) toast.error(error);

  return (
    <div className="flex w-full flex-col gap-4 pt-20">
      <h2>Similar Events</h2>
      <div className="events">
        {data &&
          data.length > 0 &&
          data.map((similarEvent) => (
            <EventCard key={similarEvent.title} {...similarEvent} />
          ))}
      </div>
    </div>
  );
};

export default SimilarEvents;
