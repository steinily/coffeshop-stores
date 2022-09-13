import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Banner from "../components/banner";
import Card from "../components/card";
import { fetchCoffeStores } from "../lib/caffee-stores";

export async function getStaticProps(context){
  //ideal case is : we fetch data here
  const coffeeStores = await fetchCoffeStores()

  return {
    props: {
      coffeeStores
    },
  }
}



export default function Home(props) { 
  const handleOnBannerBtnClick = () => {
    console.log("banner Button");
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Created by István Hencz" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText="View stores nearby"
          handleOnClick={handleOnBannerBtnClick}
        />
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            alt="Hero-Img"
            width={700}
            height={400}
          />

          {props.coffeeStores.length > 0 && (<><h2 className={styles.heading2}>Kecskemét stores</h2>
          <div className={styles.cardLayout}>
            {props.coffeeStores.map((coffeeStore) => {
              return (
                <Card
                  key={coffeeStore.fsq_id}
                  name={coffeeStore.name}
                  imgUrl={coffeeStore.imgUrl || "/static/coffee.jpg"  }
                  href={`/coffee-store/${coffeeStore.fsq_id}`}
                />
              
              )})}
          </div> </> )}
        </div>
      </main>
    </div>
  );
}
