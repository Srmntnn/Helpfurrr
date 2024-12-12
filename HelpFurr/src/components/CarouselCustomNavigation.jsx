import React, { useEffect, useState } from "react";
import VolunteerImg from "@/assets/volunteer.jpg"; // Example import
import DonationImg from "@/assets/dog.avif";
import AdoptionImg from "@/assets/adopt.png";
import { Button } from "./button";
import { Link } from "react-router-dom";

function CarouselCustomNavigation() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Change the slide every 3 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3); // 3 slides in total
    }, 10000);

    // Clear interval on component unmount
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="relative w-full mx-auto overflow-hidden">
      <div
        className="flex transition-transform duration-500 md:h-[600px] h-full w-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {/* Slide 1 */}
        <div className="w-full flex-shrink-0 relative">
          <img
            src={AdoptionImg}
            alt="Slide 1"
            className="w-full  object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
          <div className="absolute top-1/2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-bold">
            <p className="text-main-orange quicksand-bold sm:text-base text-sm w-fit rounded-md">
              Helpfurr
            </p>
            <p className="text-light-orange sm:max-w-lg w-full sm:text-4xl text-lg fredoka-bold">
              Your adoption gives a dog a loving home and a second chance at
              life.
            </p>
            <div className="mt-4 flex sm:justify-center">
              <Link
                to="/adoption"
                onClick={() => {
                  setActive("");
                  window.scrollTo(0, 0);
                }}
              >
                <Button className="bg-main-orange text-light-orange w-full sm:w-fit">
                  Adopt now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="w-full flex-shrink-0 relative">
          <img
            src={DonationImg}
            alt="Slide 2"
            className="w-full object-cover bg-bottom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
          <div className="absolute top-1/2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-bold">
            <p className="text-main-orange quicksand-bold sm:text-base text-sm w-fit p-1 px-2 rounded-md">
              Helpfurr
            </p>
            <p className="text-light-orange sm:max-w-lg w-full sm:text-4xl text-lg fredoka-bold">
              Your donation helps rescue dogs and provides vital care for
              adoption.
            </p>
            <div className="mt-4 flex sm:justify-center">
              <Link
                to="/donation"
                onClick={() => {
                  setActive("");
                  window.scrollTo(0, 0);
                }}
              >
                <Button className="bg-main-orange text-light-orange w-full sm:w-fit">
                  Donate now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="w-full flex-shrink-0 relative">
          <img
            src={VolunteerImg}
            alt="Slide 3"
            className="w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
          <div className="absolute top-1/2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-bold">
            <p className="text-main-orange quicksand-bold sm:text-base text-sm">
              Helpfurr
            </p>
            <p className="text-light-orange sm:max-w-lg w-full sm:text-4xl text-lg fredoka-bold">
              Your volunteer work helps dogs in shelters become more adoptable.
              Join us in making a difference!
            </p>
            <div className="mt-4 flex sm:justify-center">
              <Link
                to="/volunteer"
                onClick={() => {
                  setActive("");
                  window.scrollTo(0, 0);
                }}
              >
                <Button className="bg-main-orange text-light-orange w-full sm:w-fit">
                  Volunteer now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <div
          className={`w-2.5 h-2.5 rounded-full bg-white opacity-50 cursor-pointer ${
            currentSlide === 0 ? "opacity-100" : ""
          }`}
          onClick={() => setCurrentSlide(0)}
        ></div>
        <div
          className={`w-2.5 h-2.5 rounded-full bg-white opacity-50 cursor-pointer ${
            currentSlide === 1 ? "opacity-100" : ""
          }`}
          onClick={() => setCurrentSlide(1)}
        ></div>
        <div
          className={`w-2.5 h-2.5 rounded-full bg-white opacity-50 cursor-pointer ${
            currentSlide === 2 ? "opacity-100" : ""
          }`}
          onClick={() => setCurrentSlide(2)}
        ></div>
      </div>
    </div>
  );
}

export default CarouselCustomNavigation;
