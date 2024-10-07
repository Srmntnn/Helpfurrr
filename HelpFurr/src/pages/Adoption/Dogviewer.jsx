import React, { useState } from 'react';
import AdoptForm from '../../components/AdoptForm';
import { formatDistanceToNow } from 'date-fns';

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
    <div className='pet-view-card'>
      <div className='pet-card-pic'>
        <img src={`http://localhost:8080/images/${props.dog.filename}`} alt={props.dog.name} />
      </div>
      <div className='pet-card-details'>
        <h2>{props.dog.name}</h2>
        <p><b>Age:</b> {props.dog.age}</p>
        <p><b>Location:</b> {props.dog.shelter}</p>
        <p><b>Condition:</b> {props.dog.condition}</p>
        <p>{formatTimeAgo(props.dog.updatedAt)}</p>
      </div>
      <div className='show-interest-btn'>
        <button onClick={togglePopup}>Adopt Now <i className="fa fa-paw"></i></button>
      </div>
      {showPopup && (
        <div className='popup'>
          <div className='popup-content'>
            <AdoptForm closeForm={togglePopup} dog={props.dog}/>
          </div>
          <button onClick={togglePopup} className='close-btn'>
            Close <i className="fa fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Dogviewer;