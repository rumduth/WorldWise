// src/components/CountryItem.jsx
import { useState } from "react";
import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
  const [showDates, setShowDates] = useState(false);

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <li className={styles.countryItem}>
      <div 
        onClick={() => setShowDates(!showDates)} 
        style={{ cursor: "pointer" }}
      >
        <span>{country.emoji}</span>
        <span>{country.country}</span>
        <span>
          {" "}
          (Visited {country.visitCount}{" "}
          {country.visitCount === 1 ? "time" : "times"})
        </span>
      </div>
      
      {showDates && country.visitDates && country.visitDates.length > 0 && (
        <div className={styles.datesList}>
          <h4>Visit Dates:</h4>
          <ul>
            {country.visitDates.map((date, index) => (
              <li key={index}>{formatDate(date)}</li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default CountryItem;