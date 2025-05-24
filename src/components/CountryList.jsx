import Spinner from "./Spinner";
import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  // Updated reduction to include visitCount for each country
  const countries = cities.reduce((acc, city) => {
    const existing = acc.find((el) => el.country === city.country);
    if (existing) {
      existing.visitCount += 1; // Increment count if country already exists
      return acc;
    } else {
      return [
        ...acc,
        { country: city.country, emoji: city.emoji, visitCount: 1 }, // Initialize count
      ];
    }
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        // Updated to pass visitCount prop
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}
export default CountryList;
