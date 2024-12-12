import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { fetchNotifications } from "../Services/NotificationService";
import { styles } from "../styles";
import { Helmet } from "react-helmet";
import { SlOptionsVertical } from "react-icons/sl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Dialog, Transition } from "@headlessui/react";

function Notification({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const data = await fetchNotifications(userId);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    getNotifications();
  }, [userId]);

  const handleDelete = async (notificationId) => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/notification/delete/${notificationId}`
      );

      if (response.status === 200) {
        setNotifications((prev) =>
          prev.filter((notification) => notification._id !== notificationId)
        );
        setModalMessage("Notification deleted successfully.");
      } else {
        throw new Error("Failed to delete notification.");
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
      setModalMessage("Failed to delete the notification. Please try again.");
    } finally {
      setIsDeleting(false);
      setIsOpen(true);
    }
  };

  const closeModal = () => setIsOpen(false);

  return (
    <section className="w-full items-center justify-center h-full gap-10 flex ">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto max-h-[310px] h-full w-full max-w-[310px] rounded-full bg-main-orange opacity-30 blur-[100px]"></div>
      </div>
      <div
        className={`${styles.paddingX} max-w-screen-xl justify-center w-full min-h-screen`}
      >
        <Helmet>
          <title>HelpFur | Notifications</title>
          <meta name="Helpfur-all dogs" content="Helmet application" />
        </Helmet>
        <div className="sm:bg-light-orange bg-secondary-orange sm:h-76 h-80 flex absolute left-0 right-0 flex-col items-center justify-center">
          <h1
            className={`${styles.heroHeadText} text-5xl sm:text-secondary-orange text-light-orange font-bold text-center fredoka-bold`}
          >
            Notification
          </h1>
          <p
            className={`${styles.heroSubText} text-secondary-brown text-center quicksand-regular`}
          ></p>
        </div>
        <div className="flex flex-col lg:flex-row py-4 gap-6 sm:pt-76 pt-72 mt-24 w-full ">
          {notifications.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className="quicksand-regular border sm:px-6 px-4 py-8 flex items-center justify-between rounded-md gap-3"
                >
                  <div>
                    {notification.message} -{" "}
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                  <div className="text-main-brown cursor-pointer">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <SlOptionsVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel className="quicksand-regular">
                          Action
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          as="div"
                          className="hover:bg-gray-200"
                        >
                          <button
                            className="text-main-brown px-4 py-2 rounded-lg quicksand-regular"
                            onClick={() =>
                              window.confirm(
                                "Are you sure you want to delete this notification?"
                              ) && handleDelete(notification._id)
                            }
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center w-full quicksand-semi-bold text-xl text-secondary-brown">No notifications available.</p>
          )}
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 quicksand-bold"
                  >
                    Notification
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 quicksand-regular">
                      {modalMessage}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-light-orange px-4 py-2 text-sm font-medium text-main-orange hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
}

export default Notification;
