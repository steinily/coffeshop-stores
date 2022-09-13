const getUrlForCoffeeStores = (latLong,query,limit) =>{

    return `https://api.foursquare.com/v3/places/search?ll=${latLong}&radius=1000&categories=${query}&limit=${limit}`
     
}


export const fetchCoffeStores = async () => {
    const options = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: process.env.NEXT_APIKEY
        }
      };
      
      const response = await fetch(getUrlForCoffeeStores(
        '46.909918%2C19.681020',
        '13032',
        10
      ), options)
      const data = await response.json() 
      return data.results
}

