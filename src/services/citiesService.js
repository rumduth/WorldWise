const SERVER_URL = "http://localhost:9000";

export async function fetchCitiesAPI() {
  const res = await fetch(`${SERVER_URL}/api/cities`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch cities");

  return await res.json();
}

export async function fetchCityAPI(id) {
  const res = await fetch(`${SERVER_URL}/api/cities/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch city");

  return await res.json();
}

export async function createCityAPI(newCity) {
  const res = await fetch(`${SERVER_URL}/api/cities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCity),
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to create city");

  return await res.json();
}

export async function deleteCityAPI(id) {
  const res = await fetch(`${SERVER_URL}/api/cities/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to delete city");
}


export async function updateCityAPI(id, updateData) {
  const res = await fetch(`${SERVER_URL}/api/cities/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to update city");

  return await res.json();
}