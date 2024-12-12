import React, { useState } from "react";
import AdoptForm from "../../components/AdoptForm";
import { formatDistanceToNow } from "date-fns";
import { styles } from "../../styles";
import "../../index.css";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

function CampaignViewer(props) {
  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  return (
    <section className="w-full">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <figure className="w-full overflow-hidden">
          <img
            className="  object-cover  md:w-96 w-full md:h-80  rounded-t-lg "
            src={props.campaign.image[0]}
            alt={props.campaign.name}
          />
        </figure>
        <div className="flex flex-col p-6 gap-2">
          <h2 className="text-main-brown fredoka-bold tracking-wider text-2xl font-bold">
            {props.campaign.campaignName}
          </h2>
          <p className="quicksand-regular text-secondary-brown">
            {formatTimeAgo(props.campaign.updatedAt)}
          </p>
          <Link
            className="bg-light-orange text-center quicksand-bold md:py-3 md:px-6 py-2 px-6 rounded-lg text-main-orange hover:bg-main-orange hover:text-light-orange transition duration-200 shadow-sm"
            to={`/campaigndetails/${props.campaign._id}`}
          >
            View details
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CampaignViewer;
