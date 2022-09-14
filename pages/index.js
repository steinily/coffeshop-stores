import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Banner from "../components/banner";
import Card from "../components/card";
import { fetchCoffeStores } from "../lib/caffee-stores";
import useTrackLocation from "../hooks/use-track-location";
import { useEffect, useState ,useContext} from "react";
import { ACTION_TYPES , StoreContext} from "./_app";

export async function getStaticProps(context) {
  //ideal case is : we fetch data here
  const coffeeStores = await fetchCoffeStores();

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
  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (latLong) {
        try {
          const fetchedCoffeStores = await fetchCoffeStores(latLong);
          //setCoffeeStores(fetchedCoffeStores);
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload : {
              coffeeStores: fetchedCoffeStores
            }
          })
          
        } catch (error) {
          setCoffeeStoresError(error);
        }
      }
    }
    setCoffeeStoresByLocation()
  });
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
                      key={coffeeStore.fsq_id}
                      name={coffeeStore.name}
                      imgUrl={coffeeStore.imgUrl || "/static/coffee.jpg"}
                      href={`/coffee-store/${coffeeStore.fsq_id}`}
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
                      key={coffeeStore.fsq_id}
                      name={coffeeStore.name}
                      imgUrl={coffeeStore.imgUrl || "/static/coffee.jpg"}
                      href={`/coffee-store/${coffeeStore.fsq_id}`}
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
