import Image from "next/image";
import Link from "next/link";

interface IProps {
  slug: string;
  image: string;
  title: string;
  location: string;
  date: string;
  time: string;
  creatorUsername: string;
  approved: boolean;
}

const EventCard = ({
  image,
  title,
  date,
  location,
  slug,
  time,
  creatorUsername,
  approved = false,
}: IProps) => {
  return (
    <Link href={`/events/${slug}`} id="event-card" className="relative">
      {!approved ? (
        <div className="absolute rotate-45 border-2 border-primary rounded-xl px-2 top-5 -right-5 bg-black">
          Not Approved
        </div>
      ) : (
        <></>
      )}
      <Image
        src={image}
        alt={title}
        width={410}
        height={300}
        className="poster"
      />

      <div className="flex flex-row gap-2">
        <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
        <p>{location}</p>
      </div>

      <p className="title">{title}</p>

      <div className="datetime">
        <div>
          <Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
          <p>{date}</p>
        </div>
        <div>
          <Image src="/icons/clock.svg" alt="time" width={14} height={14} />
          <p>{time}</p>
        </div>
      </div>
      <div className="text-xs text-light-200 ml-auto">
        Created by {creatorUsername}
      </div>
    </Link>
  );
};

export default EventCard;
