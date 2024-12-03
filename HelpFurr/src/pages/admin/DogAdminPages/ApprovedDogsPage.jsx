import React from "react";
import { styles } from "../../../styles";
import ApprovedDogs from "./ApprovedDogs";

function ApprovedDogsPage() {
  return (
    <section className={`${styles.paddingX}  `}>
      <div className=" ">
        <ApprovedDogs />
      </div>
    </section>
  );
}

export default ApprovedDogsPage;
