import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchNotifications } from "../Services/NotificationService";
import { styles } from "../styles";
import { Helmet } from "react-helmet";

function Notification({ userId }) {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const getNotifications = async () => {
      const data = await fetchNotifications(userId);
      setNotifications(data);
    };

    getNotifications();
  }, [userId]);

  return (
    <section className="w-full items-center justify-center h-full gap-10 flex">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div classname="absolute left-0 right-0 top-0 -z-10 m-auto max-h-[310px] h-full w-full max-w-[310px] rounded-full bg-main-orange opacity-30 blur-[100px]"></div>
      </div>
      <div
        className={`${styles.paddingX} max-w-screen-xl justify-center w-full`}
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
        <div className="flex flex-col lg:flex-row py-4 gap-6 sm:pt-76 pt-72 mt-24 w-full">
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notification) => (
                <li key={notification._id}>
                  {notification.message} -{" "}
                  {new Date(notification.createdAt).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center w-full">No notifications available.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Notification;
