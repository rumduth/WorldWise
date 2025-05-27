// src/components/CountryList.jsx
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

  // Updated reduction to include visitCount and visitDates for each country
  const countries = cities.reduce((acc, city) => {
    const existing = acc.find((el) => el.country === city.country);
    if (existing) {
      existing.visitCount += 1; // Increment count if country already exists
      // Add the visit info (date and city ID) to the visits array if date exists
      if (city.date) {
        existing.visitDates.push(city.date);
        if (!existing.visits) existing.visits = [];
        existing.visits.push({
          date: city.date,
          cityId: city._id || city.id,
          cityName: city.cityName,
        });
      }
      return acc;
    } else {
      // Initialize with visitDates array containing the first date if it exists
      const visitDates = city.date ? [city.date] : [];
      const visits = city.date
        ? [
            {
              date: city.date,
              cityId: city._id || city.id,
              cityName: city.cityName,
            },
          ]
        : [];
      return [
        ...acc,
        {
          country: city.country,
          emoji: city.emoji,
          visitCount: 1,
          visitDates: visitDates,
          visits: visits,
        },
      ];
    }
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}
export default CountryList;
