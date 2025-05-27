import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Modal from "./Modal";
import styles from "./CountryItem.module.css";
import modalStyles from "./Modal.module.css";
import { formatDate } from "../utils/dates";

function CountryItem({ country }) {
  const [showModal, setShowModal] = useState(false);
  const { user, toggleLikeCountry } = useAuth();
  const navigate = useNavigate();
  const isLiked = user?.likedCountries?.includes(country.country) || false;

  const handleCountryClick = () => {
    setShowModal(true);
  };

  const handleVisitClick = (cityId) => {
    setShowModal(false);
    navigate(`/app/cities/${cityId}`);
  };

  return (
    <>
      <li className={styles.countryItem} onClick={handleCountryClick}>
        <div>
          <span>{country.emoji}</span>
          <span>{country.country}</span>
          <span>
            {" "}
            (Visited {country.visitCount}{" "}
            {country.visitCount === 1 ? "time" : "times"})
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLikeCountry(country.country);
            }}
            className={styles.likeButton}
          >
            {isLiked ? "❤️" : "♡"}
          </button>
        </div>
      </li>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3>
          <span>{country.emoji}</span>
          {country.country} - Visit History
        </h3>

        {country.visits && country.visits.length > 0 ? (
          <ul className={modalStyles.visitsList}>
            {country.visits.map((visit, index) => (
              <li
                key={index}
                className={modalStyles.visitItem}
                onClick={() => handleVisitClick(visit.cityId)}
              >
                <div className={modalStyles.visitDate}>
                  {formatDate(visit.date)}
                </div>
                <div className={modalStyles.visitCity}>{visit.cityName}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={modalStyles.noVisits}>
            No visits recorded for this country yet.
          </div>
        )}
      </Modal>
    </>
  );
}

export default CountryItem;
