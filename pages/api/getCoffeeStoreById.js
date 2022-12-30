import { findRecordByFilter } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "id is missing" });
    }

    const record = await findRecordByFilter(id);

    if (!record.length) {
      return res.status(400).json({ message: "id could not be found" });
    }

    return res.status(200).json(record);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "error finding coffee store" });
  }
};

export default getCoffeeStoreById;
