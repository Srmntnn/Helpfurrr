import moment from "moment";
import { useEffect, useState } from "react";

const TimeDisplay = () => {
    const [currentTime, setCurrentTime] = useState(moment().format('MMMM Do YYYY, h:mm:ss a'));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(moment().format('MMMM Do YYYY, h:mm:ss a'));
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return <span>{currentTime}</span>;
};

export default TimeDisplay;