import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchNotifications } from "../Services/NotificationService";
import { styles } from "../styles";

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
    <div className={`${styles.paddingX} text-center `}>
      <div className="max-w-screen-2xl w-full mx-auto">
        <h2 className="mt-48">Notifications</h2>
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
          <p>No notifications available.</p>
        )}
      </div>
    </div>
  );
}

export default Notification;
