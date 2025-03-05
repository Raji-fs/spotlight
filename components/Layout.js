import Head from 'next/head';
import Header from './Header';

export default function Layout({ children, page }) {
  return (
    <>
        <Head>
            <title>Spotlight</title>
            <meta name="description" content="Modern platform to form build and showcase portfolios. Make meaningful connections with people and your teams." />
            <link rel="icon" href="/images/spotlight_icon.svg" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Manrope:wght@200..800&display=swap" rel="stylesheet" />
        </Head>
        {page === 'dashboard' && <Header />}
        <main className="min-h-screen">{children}</main>
    </>
  );
}
