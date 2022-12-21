const HERE_PLACES_URL =
  "https://places.ls.hereapi.com/places/v1/discover/search?";

const searchParams = (latLong, query, limit) => {
  return new URLSearchParams({
    at: latLong,
    q: query,
    limit,
    apiKey: process.env.HERE_PLACES_API_KEY,
  });
};

export const fetchCoffeeStores = async () => {
  const searchQuery = searchParams(
    "43.65267326999575,-79.39545615725015",
    "coffee",
    6
  );

  const res = await fetch(`${HERE_PLACES_URL}${searchQuery}`);

  return await res.json();
};
