import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import { TypeAnimation } from 'react-type-animation';
import Head from 'next/head'; // Import Head to include custom styles for animation

const inter = Inter({ subsets: ['latin'] });

const PerlinSketchNoSSR = dynamic(() => import('@/components/perlin'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Head>
        <style>{`
          @keyframes pulse-grow {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.25);
            }
          }
        `}</style>
      </Head>

      <div className='h-screen overflow-hidden'>
        <div className='flex flex-col h-full items-center justify-center relative'>
          <TypeAnimation
            className='-translate-x-1/2 absolute backdrop-blur-lg backdrop-filter bg-opacity-50 drop-shadow-lg font-bold left-1/2 m-4 p-2 text-7xl text-white top-1/4 transform z-10'
            sequence={['Sonoverse', 1500]}
            speed={75}
            repeat={Infinity}
          />
          {/* Ensure the button pulsates continuously */}
          <button
            className='absolute animate-pulse-grow bg-black border border-white bottom-20 duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-white font-semibold hover:bg-white hover:text-black px-6 py-3 rounded shadow text-white transition'
            style={{ animation: 'pulse-grow 3s infinite' }}>
            Begin
          </button>
          <PerlinSketchNoSSR />
        </div>
        <main
          className={`flex min-h-screen flex-col items-center justify-center ${inter.className}`}></main>
      </div>
    </>
  );
}
