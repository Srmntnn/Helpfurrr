import React from "react";
import Notification from "../../components/Notification";
import { useAuthStore } from "../../store/authStore";

function NotificationPage() {
  const { user, isLoading, error } = useAuthStore(); // Assuming you have loading and error states
  const userId = user?._id;

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state
  }

  if (error) {
    return <div>Error loading user data. Please try again.</div>; // Handle error state
  }

  if (!userId) {
    return <div>Please log in to see your notifications.</div>; // Handle case where user is not logged in
  }

  return (
    <div>
      <h1></h1>
      <Notification userId={userId} />
    </div>
  );
}

export default NotificationPage;
