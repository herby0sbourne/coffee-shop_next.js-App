import { createApi } from 'unsplash-js';

// const HERE_PLACES_URL ="https://places.ls.hereapi.com/places/v1/discover/search?";
const FOURSQUARE_URL = 'https://api.foursquare.com/v3/places/search?';

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const searchParams = (latLong, query, limit) => {
  return new URLSearchParams({
    ll: latLong,
    query,
    limit,
  });
};

const getCoffeeShopImages = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: 'coffee shop',
    perPage: 20,
  });
  return photos.response.results.map((image) => image.urls.small);
};

export const fetchCoffeeStores = async (
  latLong = '43.65267326999575,-79.39545615725015',
  limit = 6
) => {
  const photos = await getCoffeeShopImages();
  const searchQuery = searchParams(latLong, 'coffee', limit);

  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const res = await fetch(`${FOURSQUARE_URL}${searchQuery}`, options);

  const data = await res.json();

  return data.results.map((coffeeShop, idx) => {
    const { neighborhood, cross_street, address } = coffeeShop.location;
    return {
      id: coffeeShop.fsq_id,
      name: coffeeShop.name,
      address,
      neighborhood: `${
        (neighborhood && neighborhood.length > 0 && neighborhood[0]) || cross_street || ''
      }`,
      imgUrl: photos[idx],
    };
  });
};
