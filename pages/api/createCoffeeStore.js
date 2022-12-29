import { table, getMinifiedRecords } from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  try {
    if (req.method === "POST") {
      if (!req.body.id) {
        return res.status(400).json({ message: "ID is missing" });
      }

      const findCoffeeStoreRecords = await table
        .select({ filterByFormula: `id="${req.body.id}"` })
        .firstPage();

      if (findCoffeeStoreRecords.length) {
        const record = getMinifiedRecords(findCoffeeStoreRecords);
        return res.status(200).json(record);
      }

      if (!req.body.name) {
        return res.status(400).json({ message: "name is missing" });
      }

      const createdRecords = await table.create([
        {
          fields: { ...req.body },
        },
      ]);

      const record = getMinifiedRecords(createdRecords);
      return res.status(200).json({ message: "record created", record });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "something went wrong", error: e });
  }
};

export default createCoffeeStore;
