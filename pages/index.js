import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Banner from "../components/banner";
import Card from "../components/card";
import { fetchCoffeeStores } from "../lib/caffee-stores";
import useTrackLocation from "../hooks/use-track-location";
import { useEffect, useState ,useContext} from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";


export async function getStaticProps(context) {
  //ideal case is : we fetch data here
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores,
    },
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();
  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };
  const { dispatch ,state} = useContext(StoreContext);
  const {latLong,coffeeStores} = state
  const [coffeeStoresError , setCoffeeStoresError] = useState(null)
  
  useEffect( () => {
    async function setCoffeeStoresByLocation() {
      if (latLong) {
        try {
          const response = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`)
          
          const coffeeStores = await response.json()
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload : {
              coffeeStores: coffeeStores
            }
          })
          
          setCoffeeStoresError("")
        } catch (error) {
           setCoffeeStoresError(error);
        }
      }
    }
    setCoffeeStoresByLocation()
  },[dispatch, latLong]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Created by István Hencz" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError.message}</p> }
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            alt="Hero-Img"
            width={700}
            height={400}
          />
          {coffeeStores.length > 0 && (
            <>
              <h2 className={styles.heading2}>Stores near me!</h2>
              <div className={styles.cardLayout}>
                {coffeeStores.map((coffeeStore) => {
                  return (
                    <Card
                      key={coffeeStore.id}
                      name={coffeeStore.name}
                      imgUrl={coffeeStore.imgUrl || "/static/coffee.jpg"}
                      href={`/coffee-store/${coffeeStore.id}`}
                    />
                  );
                })}
              </div>
            </>
          )}

          {props.coffeeStores.length > 0 && (
            <>
              <h2 className={styles.heading2}>Győr stores</h2>
              <div className={styles.cardLayout}>
                {props.coffeeStores.map((coffeeStore) => {
                  return (
                    <Card
                      key={coffeeStore.id}
                      name={coffeeStore.name}
                      imgUrl={coffeeStore.imgUrl || "/static/coffee.jpg"}
                      href={`/coffee-store/${coffeeStore.id}`}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
