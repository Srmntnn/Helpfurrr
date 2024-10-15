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

const Dogviewer = (props) => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <section className="">
      <div className="card bg-base-100  w-full max-w-screen-2xl mx-auto shadow-xl flex h-full">
        <figure>
          <img
            className="  object-contain w-96 h-96"
            src={`http://localhost:8080/images/${props.dog.filename}`}
            alt={props.dog.name}
          />
        </figure>
        <div className="card-body">
          <h2 className="text-main-brown text-2xl font-bold">
            {props.dog.name}
          </h2>
          <p>{formatTimeAgo(props.dog.updatedAt)}</p>
          <div className="bg-light-orange text-center py-4 px-6 rounded-lg text-main-orange hover:bg-main-orange hover:text-light-orange transition duration-200 shadow-sm">
            <button onClick={togglePopup} className=" whitespace-nowrap ">
              Adopt Now <i className="fa fa-paw"></i>
            </button>
          </div>
        </div>
      </div>

      {/* <div className="pet-card-details">
            
            <p>
              <b>Age:</b> {props.dog.age}
            </p>
            <p>
              <b>Location:</b> {props.dog.shelter}
            </p>
            <p>
              <b>Condition:</b> {props.dog.condition}
            </p>
            <p>{formatTimeAgo(props.dog.updatedAt)}</p>
          </div> */}

      {showPopup && (
        <Dialog
          open={showPopup}
          onClose={setShowPopup}
          className="relative z-10"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
          />

          <div className="fixed inset-0 z-10 mt-12 m-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-lg bg-white items-center flex flex-col justify-center text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[800px] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
              >
                <div className="mt-3 text-center  sm:mt-0 sm:text-left">
                  <div className="">
                    <div className="">
                      <AdoptForm closeForm={togglePopup} dog={props.dog} />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={togglePopup}
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </section>
  );
};

export default Dogviewer;
