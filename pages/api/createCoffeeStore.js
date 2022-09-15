import { table, getMinifiedRecords } from "../../lib/airtable";

const createCoffeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, address, locality, voting, imgUrl } = req.body;
    try {
      if (id) {
        const findCoffeeStoreById = await table
          .select({
            filterByFormula: `id= "${id}"`,
          })
          .firstPage();
        if (findCoffeeStoreById.length !== 0) {
          const records = getMinifiedRecords(findCoffeeStoreById);
          res.json(records);
        } else {
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  locality,
                  voting,
                  imgUrl,
                },
              },
            ]);
            const records = getMinifiedRecords(createRecords);
            res.json(records);

            res.json({ records });
          } else {
            res.status(400);
            res.json({ message: "Id or name is missing" });
          }
        }
      }
    } catch (err) {
      console.error("Error finding store ", err);
      res.status(500);
      res.json("Error finding store", err);
    }
  }
};
export default createCoffeStore;
