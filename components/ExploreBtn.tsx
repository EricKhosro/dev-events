"use client";

import Image from "next/image";

const ExploreBtn = () => {
  function scrollToSection() {
    // Get the element with the target ID
    const targetElement = document.getElementById("cached-events");

    // Scroll to the element
    targetElement?.scrollIntoView({
      behavior: "smooth", // Adds smooth scrolling
      block: "start", // Scroll to the top of the element
    });
  }

  return (
    <button
      type="button"
      id="explore-btn"
      className="mt-7 mx-auto text-center flex flex-row justify-center items-center"
      onClick={scrollToSection}
    >
      Explore Events
      <Image
        src="/icons/arrow-down.svg"
        alt="arrow-down"
        width={24}
        height={24}
      />
    </button>
  );
};

export default ExploreBtn;
