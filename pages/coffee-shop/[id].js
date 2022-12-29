import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import cls from "classnames";

import { fetchCoffeeStores } from "../../lib/fetchCoffeeStores";
import { isEmpty } from "../../utils/isEmpty";
import { StoreContext } from "../../store/storeContext";

import nearMe from "../../public/static/icons/nearMe.svg";
import places from "../../public/static/icons/places.svg";
import star from "../../public/static/icons/star.svg";
import styles from "../../styles/coffee-shop.module.css";

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  // "40.7420277,-74.0684579"
  const coffeeStores = await fetchCoffeeStores();
  const coffeeStore = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id;
  });

  return {
    props: {
      coffeeStore: coffeeStore ? coffeeStore : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();

  const paths = coffeeStores.map((coffeeStore) => {
    return { params: { id: coffeeStore.id.toString() } };
  });

  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {
  const { state } = useContext(StoreContext);
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const router = useRouter();

  const id = router.query.id;

  const createCoffeeStore = async (store) => {
    const { id, name, address, neighborhood, imgUrl, voting } = store;
    try {
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name,
          imgUrl,
          voting: Number(voting) || 0,
          neighborhood: neighborhood || "",
          address: address || "",
        }),
      });

      const dbCoffeeStore = await response.json();
      console.log({ dbCoffeeStore });
    } catch (e) {
      console.log({ message: "error creating store", error: e });
    }
  };

  useEffect(() => {
    if (!isEmpty(initialProps.coffeeStore)) {
      //SSG
      createCoffeeStore(initialProps.coffeeStore);
      return;
    }

    if (!state.coffeeStores.length) return;

    const coffeeStore = state.coffeeStores.find((coffeeStore) => {
      return coffeeStore.id.toString() === id;
    });

    if (coffeeStore) {
      setCoffeeStore(coffeeStore);
      createCoffeeStore(coffeeStore);
      return;
    }
    //SSG
    // createCoffeeStore(initialProps.coffeeStore);
  }, [id, initialProps, initialProps.coffeeStore]);

  // if (router.isFallback) return <div>Loading...</div>;
  const isLoading = router.isFallback;
  const { name, address, neighborhood, imgUrl } = coffeeStore;
  const [votingCount, setVotingCount] = useState(0);

  const handleUpvoteButton = () => {
    console.log("upvote");
    setVotingCount((votingCount) => votingCount + 1);
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <h1>coffee shop</h1>
          <div className={styles.backToHomeLink}>
            <Link href="/">&larr; Back to Home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://imageio.forbes.com/specials-images/imageserve/60f5b60d124afbc1596f1489/0x0.jpg?format=jpg&width=1200"
            }
            alt={`${name} image`}
            width={600}
            height={360}
            className={styles.storeImg}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src={places} width={25} height={25} alt="location icon" />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src={nearMe} width={25} height={25} alt="location icon" />
            <p className={styles.text}>{neighborhood}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src={star} width={25} height={25} alt="location icon" />
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
