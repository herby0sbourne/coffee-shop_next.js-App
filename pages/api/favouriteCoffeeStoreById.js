import {
  table,
  getMinifiedRecords,
  findRecordByFilter,
} from "../../lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method === "PATCH") {
    try {
      const { id } = req.body;

      if (!id) {
        res.status(400).json({ message: "Id Missing cannot vote" });
      }

      const findCoffeeStoreRecords = await findRecordByFilter(id);

      if (!findCoffeeStoreRecords.length) {
        return res
          .status(400)
          .json({ message: "coffee store with that id does not exist", id });
      }

      const record = findCoffeeStoreRecords[0];
      const calculateVoting = parseInt(record.voting) + 1;

      const updateRecord = await table.update([
        {
          id: record.recordId,
          fields: {
            voting: calculateVoting,
          },
        },
      ]);

      if (!updateRecord) return;

      return res.status(200).json(getMinifiedRecords(updateRecord));
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "something went wrong voting for coffee store",
        error: e,
      });
    }
  }
};

export default favouriteCoffeeStoreById;
