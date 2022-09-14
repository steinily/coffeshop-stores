const https = require('https');
import { createApi } from 'unsplash-js';
const agent = new https.Agent({
  rejectUnauthorized: false
});

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCES_KEY,
  agent
});

const getUrlForCoffeeStores = (latLong,query,limit) =>{

    return `https://api.foursquare.com/v3/places/search?ll=${latLong}&radius=10000&categories=${query}&limit=${limit}`
     
}

const getListCoffeeStoresPhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: 'coffee',
    page: 1,
    perPage: 30
  });
const unsplashResults= photos.response.results
return unsplashResults.map(element => element.urls['small'])
}



export const fetchCoffeStores = async (latLong = '47.69945652066026,17.623320981826044' , limit=30) => {
  
const photos =await getListCoffeeStoresPhotos()


    const options = {
        method: 'GET',
        agent,
        headers: {
          Accept: 'application/json',
          Authorization: process.env.NEXT_PUBLIC_APIKEY
        }
      };
      
      const response = await fetch(getUrlForCoffeeStores(
        latLong,
        '13032',
        limit
      ), options)

      const data = await response.json() 
      return data.results.map( (result,idx) =>{
        return{
        ...result,
        imgUrl:photos.length > 0 ? photos[idx] : null,}
      } )
}

