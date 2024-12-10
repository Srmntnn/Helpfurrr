import React from "react";
import { Tab } from "@headlessui/react";
import UserRequestedDogs from "./UserRequestedDogs";
import VolunteerRequest from "./VolunteerPage"
import { styles } from "../../styles";
import AdoptionRequest from "./AdoptionRequest";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function RequestPage() {
  return (
    <section className={`${styles.paddingX}  `}>
       <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto max-h-[310px] h-full w-full max-w-[310px] rounded-full bg-main-orange opacity-30 blur-[100px]"></div>
      </div>
      <div className="md:mt-56 mt-20 ">
        <Tab.Group>
          <div className="w-full max-w-lg mx-auto">
            <Tab.List className="sm:flex-row rounded-xl p-2 flex-col flex quicksand-semi-bold border border-main-orange">
              <Tab
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                    "ring-white/60 ring-offset-2 ring-main-orange focus:outline-none focus:ring-2",
                    selected
                      ? "bg-main-orange text-light-orange shadow"
                      : "text-orange-200 hover:bg-white/[0.12] hover:text-secondary-orange"
                  )
                }
              >
                Post Dog Request
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    "w-full mr-1 rounded-lg py-2.5 text-sm font-medium leading-5",
                    "ring-white/60 ring-offset-2 ring-main-orange focus:outline-none focus:ring-2 mr-[-2px]",
                    selected
                      ? "bg-main-orange text-light-orange shadow"
                      : "text-orange-200 hover:bg-white/[0.12] hover:text-secondary-orange"
                  )
                }
              >
                Adoption Request
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                    "ring-white/60 ring-offset-2 ring-main-orange focus:outline-none focus:ring-2",
                    selected
                      ? "bg-main-orange text-light-orange shadow"
                      : "text-orange-200 hover:bg-white/[0.12] hover:text-secondary-orange"
                  )
                }
              >
                Volunteer Request
              </Tab>
            </Tab.List>
          </div>

          <Tab.Panels>
            <Tab.Panel>
              <UserRequestedDogs />
            </Tab.Panel>
            <Tab.Panel>
              <AdoptionRequest />
            </Tab.Panel>
            <Tab.Panel>
              <VolunteerRequest />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  );
}

export default RequestPage;
