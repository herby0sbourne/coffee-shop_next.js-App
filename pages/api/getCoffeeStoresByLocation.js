import {fetchCoffeeStores} from "../../lib/fetchCoffeeStores";

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const {latLong, limit} = req.query;

    const response = await fetchCoffeeStores(latLong, limit);

    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({message: "some thing went wrong", error: e});
  }
};

export default getCoffeeStoresByLocation;
