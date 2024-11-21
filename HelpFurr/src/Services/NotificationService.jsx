import axios from "axios";

export const fetchNotifications = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:8080/notification/${userId}`);
    return response.data; // Return the notifications data
  } catch (error) {
    console.error("Error fetching notifications:", error); // Log the error for debugging
    return []; // Return an empty array if there is an error
  }
};