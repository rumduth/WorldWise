import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>{country.emoji}</span>
      <span>{country.country}</span>
      <span>
        {" "}
        (Visited {country.visitCount}{" "}
        {country.visitCount === 1 ? "time" : "times"})
      </span>
    </li>
  );
}

export default CountryItem;
