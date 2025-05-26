import { Link } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import { useNotification } from "../contexts/NotificationContext";
import styles from "./CityItem.module.css";
import { formatDate } from "../utils/dates";

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  const { addNotification } = useNotification();

  const { cityName, emoji, date, _id: id, position } = city;

  async function handleClick(e) {
    e.preventDefault();
    await deleteCity(id);
    addNotification("City deleted successfully", "success");
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity._id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn} onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
