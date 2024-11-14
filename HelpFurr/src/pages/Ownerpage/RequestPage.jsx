import React from "react";
import { Tab } from "@headlessui/react";
import UserRequestedDogs from "./UserRequestedDogs";
import { styles } from "../../styles";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function RequestPage() {
  return (
    <section className={`${styles.paddingX}  `}>
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
                Campaign Request
              </Tab>
            </Tab.List>
          </div>

          <Tab.Panels>
            <Tab.Panel>
              <UserRequestedDogs />
            </Tab.Panel>
            <Tab.Panel><UserRequestedDogs /></Tab.Panel>
            <Tab.Panel><UserRequestedDogs /></Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  );
}

export default RequestPage;
