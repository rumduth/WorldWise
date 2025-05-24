import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import BackButton from "./BackButton";
import styles from "./City.module.css";
import Spinner from "./Spinner";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const { id } = useParams();
  const { getCity, currentCity, isLoading, updateCity } = useCities();

  useEffect(() => {
    getCity(id);
  }, [id, getCity]);

  const { cityName, emoji, date, notes } = currentCity;

  function handleUpdateVisit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedNotes = formData.get("notes");
    const updatedDate = formData.get("date");
    updateCity(id, { notes: updatedNotes, date: updatedDate });
    e.target.reset();
  }

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City Name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You visited on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      <form onSubmit={handleUpdateVisit} className={styles.form}>
        <fieldset className={styles.formGroup}>
          <legend>Update Visit Info</legend>

          <div className={styles.row}>
            <label htmlFor="date">Change the visit date:</label>
            <input
              type="date"
              id="date"
              name="date"
              defaultValue={date ? new Date(date).toISOString().split("T")[0] : ""}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className={styles.row}>
            <label htmlFor="notes">Your notes:</label>
            <input
              type="text"
              id="notes"
              name="notes"
              defaultValue={notes}
              placeholder="Type your notes here..."
            />
          </div>

          <button type="submit" className={styles.saveBtn}>Save</button>
        </fieldset>
      </form>

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;
