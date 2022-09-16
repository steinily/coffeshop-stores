const Airtable = require("airtable");
const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE);

const table = base("CoffeeStores");

const getMinifiedRecord = (record) => {
    return {
        recordId:record.id,
        ...record.fields
    }
}

const getMinifiedRecords = (records) => {
    return records.map((record) => getMinifiedRecord(record));
}

const findRecordByFilter = async (id) => {
    const findCoffeStoreRecords = await table.select({
        filterByFormula: `id="${id}"`
    })
    .firstPage();
      return getMinifiedRecords(findCoffeStoreRecords)
    }


export { table ,getMinifiedRecords ,findRecordByFilter};