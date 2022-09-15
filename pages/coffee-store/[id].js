import Link from "next/link";
import Head from "next/head";
import styles from "../../styles/coffee-stores.module.css";
import Image from "next/future/image";
import { fetchCoffeStores } from "../../lib/caffee-stores";
import cls from "classnames";
import { useContext, useEffect, useState } from "react";

import { isEmpty } from "../../utils/index";
import { StoreContext } from "../../store/store-context";
import { useRouter } from "next/router";
export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  const coffeeStores = await fetchCoffeStores();
  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.fsq_id.toString() === params.id;
  });
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}
export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeStores();
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.fsq_id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();
  const [count, setCount] = useState(0);

  const id = router.query.id;
  const { state } = useContext(StoreContext);
  const { coffeeStores } = state;
   

  const handleCreateCoffeStore = async (coffeeStore) => {
    try {
      const { id, name, address, locality, voting, imgUrl } = coffeeStore;
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          address: address || "",
          locality: locality || "",
          voting: 0,
          imgUrl,
        }),
      });
      const dbCoffeeStore = response.json();
      console.log({ dbCoffeeStore });
    } catch (err) {
      console.error("Error creating coffe store", err);
    }
  };

  let store = 0
  if (initialProps || initialProps=={}) {
    if (coffeeStores.length > 0) {
      console.log('itt vagyok')
      const coffeeStoreFromContext = coffeeStores.filter(coffeeStore => {
        return coffeeStore.fsq_id == id;
      });
      console.log(coffeeStoreFromContext)
      if (coffeeStoreFromContext) {
        handleCreateCoffeStore(coffeeStoreFromContext);
         store = coffeeStoreFromContext
      }
      
    } else {
      handleCreateCoffeStore(initialProps.coffeeStore);
    }
  }
  const handleUpvoteButton = () => {
    setCount(count + 1);
  };

  const name = store[0].name
  const imgUrl = 2
  const address = 3
  const locality = 4

//debugger
  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a> ⬅ Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>

          <Image
            src={imgUrl || "/static/coffee.jpg"}
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              width="24"
              height="24"
              alt="places"
            />
            <p className={styles.text}>{locality}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/nearMe.svg"
              width="24"
              height="24"
              alt="nearMe"
            />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="star"
            />
            <p className={styles.text}>{count}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            UpVote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
