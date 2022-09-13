import Link from "next/link";
import Head from "next/head";
import styles from "../../styles/coffee-stores.module.css";
import Image from "next/image";
import coffeeStoreData from "../../data/coffee-stores.json";
import cls from "classnames";
import { useState } from "react";

export function getStaticProps({ params }) {
  // const params = staticProps.params
  return {
    props: {
      coffeeStore:
        coffeeStoreData.find((coffeeStore) => {
          return coffeeStore.id.toString() === params.id;
        }) || {},
    },
  };
}

export function getStaticPaths() {
  const path = coffeeStoreData.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      },
    };
  });
  return {
    paths: path,
    fallback: true,
  };
}

const CoffeeStore = (props) => {

    const [count,setCount]=useState(0)

  if (Object.keys(props.coffeeStore).length === 0) {
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
    setCount(count+1)
  }

  const { address, name, neighbourhood, imgUrl } = props.coffeeStore;

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
          <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={imgUrl}
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>
        <div className={cls("glass",styles.col2)}>
            <div className={styles.iconWrapper}>
                <Image src="/static/icons/places.svg" width="24" height="24" alt="places" />
            <p className={styles.text}>{address}</p>
            </div>
            <div className={styles.iconWrapper}>
                <Image src="/static/icons/nearMe.svg" width="24" height="24" alt="nearMe" />
                <p className={styles.text}>{neighbourhood}</p>
            </div>
            <div className={styles.iconWrapper}>
                <Image src="/static/icons/star.svg" width="24" height="24" alt="star"/>
                <p className={styles.text}>{count}</p>
            </div>
          
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>UpVote!</button>
          
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
