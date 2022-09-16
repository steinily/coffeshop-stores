import {table,getMinifiedRecords, findRecordByFilter } from "../../lib/airtable";

const votingCountCofferStoreById = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { id } = req.query;
      if (id) {
        
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {
          
          const record = records[0];
          const calculateVoting = parseInt(record.voting) + parseInt(1);
          
          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculateVoting,
              },
            },
          ]);
          
          if(updateRecord){
            const minifiedRecords = getMinifiedRecords(updateRecord);
            res.json(minifiedRecords)
          }
        } else {
          res.json({ message: "No record whit the specific id", id });
        }
      } else {
        res.status(400);
        res.json({ message: "Record did not exist" });
      }
    } catch (error) {
      res.status(500);
      res.json({ message: "Something went wrong", error });
    }
  }
};

export default votingCountCofferStoreById;
