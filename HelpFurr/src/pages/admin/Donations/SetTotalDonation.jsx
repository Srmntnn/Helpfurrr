import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import to use the URL params

const SetTotalDonation = () => {
  const { campaignId } = useParams(); // Get campaignId from the URL params
  const [item, setItem] = useState("");
  const [cost, setCost] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [campaign, setCampaign] = useState(null); // Store campaign data

  // Fetch campaign data when the component mounts or when campaignId changes
  useEffect(() => {
    if (campaignId) {
      axios
        .get(
          `${
            import.meta.env.VITE_BASE_URL
          }/campaigns/get-campaignbyid/${campaignId}`
        )
        .then((response) => {
          setCampaign(response.data); // Set the campaign data
        })
        .catch((err) => {
          setError("Failed to fetch campaign data");
        });
    }
  }, [campaignId]);

  const handlePostBudget = async () => {
    if (!item || !cost || isNaN(cost) || cost <= 0) {
      setError("Please provide valid item name and cost");
      return;
    }

    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_BASE_URL
        }/campaigns/${campaignId}/post-budget-usage`,
        { item, cost: parseFloat(cost) }
      );
      setSuccess("Budget usage updated successfully!");
      setError("");
    } catch (err) {
      setError("Failed to post budget usage");
      setSuccess("");
    }
  };

  return (
    <div>
      <h3>Post Budget Usage</h3>

      {/* Display campaign name if available */}
      {campaign && <h4>Campaign: {campaign.campaignName}</h4>}

      <input
        type="text"
        value={item}
        onChange={(e) => setItem(e.target.value)}
        placeholder="Item Name (e.g., Dog Food)"
      />
      <input
        type="number"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        placeholder="Cost of Item"
      />
      <button onClick={handlePostBudget}>Post Expense</button>

      {/* Show success or error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default SetTotalDonation;
