import Link from "next/link";
import Head from "next/head";
import styles from "../../styles/coffee-stores.module.css";
import Image from "next/future/image";
import { fetchCoffeStores } from "../../lib/caffee-stores";
import cls from "classnames";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { StoreContext } from "../_app";

import { isEmpty } from "../../utils/index";
export async function getStaticProps({ params }) {
  // const params = staticProps.params
  const coffeeStores = await fetchCoffeStores();
  return {
    props: {
      coffeeStore:
        coffeeStores.find((coffeeStore) => {
          return coffeeStore.fsq_id.toString() === params.id;
        }) || {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeStores();
  const path = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.fsq_id.toString(),
      },
    };
  });
  return {
    paths: path,
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const id = router.query.id;
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const [coffeeStore, setCoffeeStore] = useState(
    initialProps.coffeeStore || {}
  );

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
          return coffeeStore.fsq_id.toString() === id;
        });
        setCoffeeStore(findCoffeeStoreById);
      }
    }
  }, [coffeeStores,id,initialProps]);

  if (Object.keys(initialProps.coffeeStore).length === 0) {
    return (
      <div>
        <h2>Record not found</h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </div>
    );
  }

  const handleUpvoteButton = () => {
    setCount(count + 1);
  };

  const { location, name, imgUrl } = coffeeStore;

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
            <p className={styles.text}>{location.address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/nearMe.svg"
              width="24"
              height="24"
              alt="nearMe"
            />
            <p className={styles.text}>{location.locality}</p>
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
