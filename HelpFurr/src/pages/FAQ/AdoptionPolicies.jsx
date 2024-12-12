import { styles } from "@/styles";
import React from "react";
import { IoBookOutline } from "react-icons/io5";
import { Disclosure } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";

function AdoptionPolicies() {
  return (
    <div className={`${styles.paddingX}`}>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto max-h-[310px] h-full w-full max-w-[310px] rounded-full bg-main-orange opacity-30 blur-[100px]"></div>
      </div>
      <div className="mt-[78px]">
        <div className="md:pt-32 pt-16">
          <p className="md:text-4xl text-2xl text-center fredoka-bold tracking-wider text-main-brown">
            Adoption Policy
          </p>
        </div>
        <div className="quicksand-semi-bold max-w-screen-md mx-auto mt-8 flex flex-col gap-2">
          <div className="w-full border hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4 text-sm">
            <div className="flex items-center gap-3 ">
              <div className="p-4 bg-light-orange w-fit rounded-lg">
                <IoBookOutline className="text-main-orange" />
              </div>

              <div>
                <p className=" rounded-md">
                  - Applicants must be at least 21 years od to adopt. Please
                  bring a valid form of I.D.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full border hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4 text-sm">
            <div className="flex items-center gap-3 justify-between">
              <div className="p-4 bg-light-orange w-fit rounded-lg">
                <IoBookOutline className="text-main-orange" />
              </div>

              <div>
                <p className=" rounded-md">
                  - Anyone renting or leasing must have a written permission
                  from their landlord before an adoption can be approved. Any
                  restrictions regarding type or size of animal must be noted.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full border hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4 text-sm">
            <div className="flex items-center gap-3 ">
              <div className="p-4 bg-light-orange w-fit rounded-lg">
                <IoBookOutline className="text-main-orange" />
              </div>

              <div>
                <p className=" rounded-md">
                  - If applicants have a dog at home, they must bring their dog
                  to the shelter to meet the new pet before adoption will be
                  approved. We want to make sure that this dog is happy with
                  their selection and that the transition for both dogs will be
                  relatively smooth.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full border hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4 text-sm">
            <div className="flex items-center gap-3 ">
              <div className="p-4 bg-light-orange w-fit rounded-lg">
                <IoBookOutline className="text-main-orange" />
              </div>

              <div>
                <p className=" rounded-md">
                  - We cannot place puppies younger than four months of age in a
                  home where some is consistently absent from the home for long
                  period of time. Young puppies require intensive training and
                  care and this apply with our kittens as well.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full border hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4 text-sm">
            <div className="flex items-center gap-3 ">
              <div className="p-4 bg-light-orange w-fit rounded-lg">
                <IoBookOutline className="text-main-orange" />
              </div>

              <div>
                <p className=" rounded-md">
                  - We do not adopt out dogs as guard dogs or “yard” dogs. Dogs
                  and cats are family and must be treated as a family member. We
                  require that our cats live safely inside only in their new
                  homes and dogs must receive adequate exercise and attention.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full border hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4 text-sm">
            <div className="flex items-center gap-3 ">
              <div className="p-4 bg-light-orange w-fit rounded-lg">
                <IoBookOutline className="text-main-orange" />
              </div>

              <div>
                <p className=" rounded-md">
                  - We do not adopt out animals as gifts.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full border hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4 text-sm">
            <div className="flex items-center gap-3 ">
              <div className="p-4 bg-light-orange w-fit rounded-lg">
                <IoBookOutline className="text-main-orange" />
              </div>

              <div>
                <p className=" rounded-md">
                  - If at anytime you are unable to keep the pet or offer it
                  proper care, it must be offered back to C.A.R.E before
                  alternate arrangements are made.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full border hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4 text-sm">
            <div className="flex items-center gap-3 ">
              <div className="p-4 bg-light-orange w-fit rounded-lg">
                <IoBookOutline className="text-main-orange" />
              </div>

              <div>
                <p className=" rounded-md">
                  - No animal will be adopted to an individual who has failed to
                  comply with the conditions of a previous adoption, including
                  but not limited to the spaying or neutering of the pet.
                  Adoption Procedures
                </p>
              </div>
            </div>
          </div>
          <div className="w-full border hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4 text-sm">
            <div className="flex items-center gap-3 ">
              <div className="p-4 bg-light-orange w-fit rounded-lg">
                <IoBookOutline className="text-main-orange" />
              </div>

              <div>
                <p className=" rounded-md">
                  - No animal will be adopted to an individual who has failed to
                  comply with the conditions of a previous adoption, including
                  but not limited to the spaying or neutering of the pet.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="mx-auto w-full rounded-2xl bg-white">
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full items-center justify-between rounded-lg bg-light-orange px-4 py-2 text-left text-sm font-medium text-main-orange hover:bg-orange-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/75">
                      <div className="flex flex-col gap-2 justify-center place-content-center">
                        <p>Adoption Procedures </p>{" "}
                        <p>
                          Prospective adopters will be required to complete an
                          adoption process, which includes:
                        </p>
                      </div>
                      <IoIosArrowDown
                        className={`${
                          open ? "rotate-180 transform" : ""
                        } h-5 w-5 text-orange-500`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                      <p>-Adoption Application</p>
                      <p>-An interview to review the application</p>
                      <p>-Reference check</p>
                      <p>
                        -A home visit with the pet ( this allows us the
                        opportunity to see where our pet would be living )
                      </p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdoptionPolicies;
