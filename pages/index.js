import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

import { fetchCoffeeStores } from '../lib/fetchCoffeeStores';
import useTrackLocation from '../hooks/getUserLocation';
import { StoreContext } from '../store/storeContext';
import Banner from '../components/Banner';
import Card from '../components/Card';

import styles from '../styles/Home.module.css';

import heroImage from '../public/static/hero-image.png';

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores: coffeeStores,
    },
  };
}

export default function Home({ coffeeStores }) {
  const { state, getCoffeeStoreNearBy } = useContext(StoreContext);
  const { coffeeStores: nearByCoffeeStores, latLong } = state;
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation();

  useEffect(() => {
    if (!Boolean(latLong)) return;

    const fetchNearByCoffeeShop = async () => {
      try {
        const response = await fetch(
          `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=${20}`
        );

        const nearByCoffeeStores = await response.json();

        // const nearByCoffeeStores = await fetchCoffeeStores(
        //   "40.7420277,-74.0684579",
        //   20
        // );
        getCoffeeStoreNearBy(nearByCoffeeStores);
      } catch (e) {
        console.log(e);
      }
    };
    fetchNearByCoffeeShop();
  }, [latLong]);

  const handleOnClick = () => {
    handleTrackLocation();
  };

  return (
    <>
      <Head>
        <title>Coffee Shop</title>
        <meta name="description" content="find the best coffee shop near your location" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner
          buttonText={`${isFindingLocation ? 'Locating...' : 'View stores nearby'}`}
          handleOnClick={handleOnClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {/*<div className={styles.heroImage}>*/}
        {/*  <Image*/}
        {/*    placeholder={"blur"}*/}
        {/*    src={heroImage}*/}
        {/*    width={700}*/}
        {/*    height={400}*/}
        {/*    alt={"hero image"}*/}
        {/*  />*/}
        {/*</div>*/}
        {nearByCoffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>Coffee Stores Near You</h2>
            <div className={styles.cardLayout}>
              {nearByCoffeeStores.map(({ id, name, imgUrl }) => {
                return (
                  <Card
                    key={id}
                    name={name}
                    href={`/coffee-shop/${id}`}
                    imgUrl={
                      imgUrl ||
                      'https://media.gettyimages.com/id/1216782625/photo/chilling-out-at-a-coffee-shop.jpg?s=612x612&w=gi&k=20&c=C6HwgYTOjj_WbVjsRgVVC7z2erW8nqUDjSmHIjYdATU='
                    }
                    className={styles.card}
                  />
                );
              })}
            </div>
          </>
        )}
        {/* TORONTO'S STORES*/}
        {coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>Toronto Stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map(({ id, name, imgUrl }) => {
                return (
                  <Card
                    key={name}
                    name={name}
                    href={`/coffee-shop/${id}`}
                    imgUrl={
                      imgUrl ||
                      'https://media.gettyimages.com/id/1216782625/photo/chilling-out-at-a-coffee-shop.jpg?s=612x612&w=gi&k=20&c=C6HwgYTOjj_WbVjsRgVVC7z2erW8nqUDjSmHIjYdATU='
                    }
                    className={styles.card}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>
    </>
  );
}
