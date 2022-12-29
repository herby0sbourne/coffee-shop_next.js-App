import {
  table,
  getMinifiedRecords,
  findRecordByFilter,
} from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(403).json({ message: "id is missing" });
    }

    const findCoffeeStoreRecords = await table
      .select({ filterByFormula: `id="${id}"` })
      .firstPage();

    if (!findCoffeeStoreRecords.length) {
      return res.status(403).json({ message: "id could not be found" });
    }

    const record = getMinifiedRecords(findCoffeeStoreRecords);
    return res.status(200).json(record);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "error finding coffee store" });
  }
};

export default getCoffeeStoreById;
