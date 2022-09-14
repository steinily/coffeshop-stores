import { fetchCoffeStores } from "../../lib/caffee-stores";

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query;
    const response  = await fetchCoffeStores(latLong, limit);
    res.status(200)
    res.json(response)
  } catch (err) {
    console.log("There is an error", err);
    res.status(500)
    res.json({message:'There was an error!'})
  }
};

export default getCoffeeStoresByLocation;
