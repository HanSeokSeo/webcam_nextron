import React from "react";
import Head from "next/head";
import Link from "next/link";
import Cams from "./cams";

function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>QRAY VIEWER</title>
      </Head>
      <main className="flex flex-col items-center justify-center min-w-screen min-h-screen p-24">
        <Link href="/cams">
          <a className="btn-blue text-5xl">Go to Qray Viewer</a>
        </Link>
      </main>
    </React.Fragment>
  );
}

export default Home;
