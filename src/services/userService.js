const SERVER_URL = "http://localhost:9000";

export async function userAPI(endpoint, method, data = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${SERVER_URL}/api/user/${endpoint}`, options);
  const responseData = await res.json();

  if (!res.ok)
    throw new Error(responseData.message || `${method} request failed`);

  return responseData;
}
