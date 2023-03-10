import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import cls from 'classnames';
import useSWR from 'swr';

import { fetchCoffeeStores } from '../../lib/fetchCoffeeStores';
import { isEmpty } from '../../utils/isEmpty';
import { StoreContext } from '../../store/storeContext';

import nearMe from '../../public/static/icons/nearMe.svg';
import places from '../../public/static/icons/places.svg';
import star from '../../public/static/icons/star.svg';
import styles from '../../styles/coffee-shop.module.css';
import Spinner from '../../components/Spinner';

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

const fetcher = (url) => fetch(url).then((res) => res.json());

const CoffeeStore = (initialProps) => {
  const { state } = useContext(StoreContext);
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore || {});

  const router = useRouter();
  const id = router.query.id;

  const createCoffeeStore = async (store) => {
    if (!store) return;
    const { name, address, neighborhood, imgUrl, voting } = store;

    try {
      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name,
          imgUrl,
          voting: Number(voting) || 0,
          neighborhood: neighborhood || '',
          address: address || '',
        }),
      });

      const dbCoffeeStore = await response.json();
    } catch (e) {
      console.log({ message: 'error creating store', error: e });
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (state.coffeeStores.length > 0) {
        const findCoffeeStoreById = state.coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id; //dynamic id
        });
        // console.log("state call");
        setCoffeeStore(findCoffeeStoreById);
        createCoffeeStore(findCoffeeStoreById);
      }
    } else {
      // SSG
      // console.log("initial call");
      createCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps.coffeeStore, state.coffeeStores]);

  const { name = '', address = '', neighborhood = '', imgUrl = '' } = coffeeStore;
  const [votingCount, setVotingCount] = useState(0);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (!(data && data.length > 0)) return;

    setCoffeeStore(data[0]);
    setVotingCount(data[0].voting);
  }, [data]);

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch('/api/favouriteCoffeeStoreById', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
        }),
      });
      const dbCoffeeStore = await response.json();

      if (!(dbCoffeeStore && dbCoffeeStore.length > 0)) return;

      setVotingCount((votingCount) => votingCount + 1);
    } catch (e) {
      console.log({ message: 'error voting for store', error: e });
    }
  };

  if (router.isFallback) return <Spinner />;

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee shop`} />
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
              'https://imageio.forbes.com/specials-images/imageserve/60f5b60d124afbc1596f1489/0x0.jpg?format=jpg&width=1200'
            }
            alt={`${name} image`}
            width={600}
            height={360}
            className={styles.storeImg}
          />
        </div>
        <div className={cls('glass', styles.col2)}>
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
