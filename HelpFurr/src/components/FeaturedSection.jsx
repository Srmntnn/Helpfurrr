import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";
import { Button } from "./button";

import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MdOutlinePets } from "react-icons/md";
import { useEffect, useState } from "react";
export function FeaturedSection() {
  const [dogsData, setDogsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://localhost:8080/dogs/approvedPets");
        if (!response.ok) {
          throw new Error("An error occurred");
        }
        const data = await response.json();
        setDogsData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getRandomDogs = () => {
    // Shuffle the dog data to randomize the order
    const shuffledDogs = [...dogsData].sort(() => Math.random() - 0.5);
    // Select only the first 6 dogs
    return shuffledDogs.slice(0, 6);
  };
  return (
    <div className="w-full max-w-screen-2xl flex sm:flex-row flex-col-reverse items-center justify-center gap-10 sm:py-40 py-10 ">
      <div className="flex gap-6 items-center md:flex-row flex-col justify-center w-full">
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center w-full space-y-12 lg:space-y-0">
          <div className="flex-1 flex items-center justify-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold fredoka-bold text-main-brown">
                <span className="text-main-orange ">Helpfur:</span> Your Gateway
                to Canine Companionship
              </h1>
              <p className="text-justify max-w-xl quicksand-regular text-secondary-brown">
                Discover loyal and playful dogs seeking loving homes. From
                energetic pups to calm senior companions, find your perfect
                furry friend. Each dog has a unique story and is ready to bring
                joy and unconditional love into your life.
              </p>
              <div>
                <Link to={"/adoption"}>
                  <Button className="text-main-orange quicksand-regular hover:text-light-orange">
                    <MdOutlinePets className="mr-2 h-4 w-4" /> Adopt Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="lg:flex-1 flex items-center justify-end pb-20 lg:pb-0">
            <Carousel
              opts={{
                align: "start",
              }}
              orientation="vertical"
              className="w-full lg:max-w-md"
            >
              <CarouselContent className="h-[490px]">
                {loading ? (
                  <p>loading</p>
                ) : dogsData.length > 0 ? (
                  getRandomDogs().map((dog) => (
                    <CarouselItem key={dog._id} className="md:basis-1/2">
                      <Card>
                        <CardHeader>
                          <div className="space-y-4">
                            <img
                              className="rounded-xl h-52 w-full object-cover"
                              src={dog.image[0]}
                              alt=""
                            />
                            <div className="flex justify-between items-center w-full">
                              <div className="space-y-4 w-full">
                                <div className="flex justify-between items-center w-full">
                                  <div>
                                    <CardTitle>{dog.name}</CardTitle>
                                  </div>
                                </div>
                                <CardDescription>
                                  {dog.condition}{" "}
                                  {/* Use dog.condition for condition */}
                                </CardDescription>
                                <CardDescription className="text-sm text-gray-600">
                                  Age: {dog.age} {/* Use dog.age for age */}
                                </CardDescription>
                                <CardDescription className="text-sm text-gray-600">
                                  Location: {dog.shelter}{" "}
                                  {/* Use dog.shelter for shelter */}
                                </CardDescription>
                              </div>
                            </div>
                          </div>
                          <div>
                            <Link to={`/dogdetails/${dog._id}`}>
                              {/* Use dog._id for link */}
                              <Button className="w-full mt-5 text-main-orange quicksand-regular hover:text-light-orange">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </CardHeader>
                      </Card>
                    </CarouselItem>
                  ))
                ) : (
                  <p>No dogs found</p>
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}
