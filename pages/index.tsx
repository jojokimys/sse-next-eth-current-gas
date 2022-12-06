import Head from "next/head";
import Image from "next/image";
import { useEffect, useState, useMemo, useRef } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [gas, setGas] = useState<string>("");

  const sourceRef = useRef<EventSource>();

  useEffect(() => {
    if (!sourceRef.current) {
      console.log("called");
      sourceRef.current = new EventSource("/api/gas", { withCredentials: true });
      sourceRef.current.addEventListener(
        "message",
        function (e) {
          const [a, b, ...rest] = [...e.data];
          setGas(`${a}${b}.${rest.splice(0, 3).join("")}`);
        },
        false,
      );
    }
    return () => {
      // sourceRef.current.removeEventListener("message", () => console.log("listener removed"));
    };
  }, [sourceRef]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Current Eth Gas Fee with SSE</title>
        <meta name="description" content="Current Eth Gas Fee with SSE" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Current Gas Fee <a href="https://etherscan.io/gastracker">{gas} gwei</a>
        </h1>
      </main>
    </div>
  );
}
