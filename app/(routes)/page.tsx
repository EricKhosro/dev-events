import ExploreBtn from "@/components/ExploreBtn";
import Link from "next/link";
import CachedEvents from "./Events";

const Page = async () => {
  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can't Miss
      </h1>
      <p className="mt-5 text-center">
        Hackatons, Meetups, and Conferences, All in{" "}
        <Link
          prefetch={false}
          target="_blank"
          className="font-bold"
          href="https://www.imdb.com/title/tt0388629/"
        >
          One Piece
        </Link>
      </p>

      <ExploreBtn />

      <CachedEvents pendingOnly={false} />
    </section>
  );
};

export default Page;
