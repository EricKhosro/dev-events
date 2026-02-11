import { getSafeUserInfo } from "@/server/modules/user/user.action";
import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

const Navbar = async () => {
  const user = await getSafeUserInfo();
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p>DevEvent</p>
        </Link>
        <ul className="flex items-center gap-4">
          <Link href="/">Home</Link>
          <Link href="/events/create">Create Event</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span>{user.username}</span>
              <LogoutButton />
            </div>
          ) : (
            <Link href="/auth">Login/Register</Link>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
