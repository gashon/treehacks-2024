import React, { useState } from 'react'; // Import useState
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import { TypeAnimation } from 'react-type-animation';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

const PerlinSketchNoSSR = dynamic(() => import('@/components/perlin'), {
  ssr: false,
});

// Updated Simple Modal Component for larger size
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    // Increased z-index for modal overlay to ensure it's above everything
    <div className='bg-black bg-opacity-50 fixed flex inset-0 items-center justify-center z-50'>
      <div
        className='bg-white p-8 rounded-lg'
        style={{ width: '60%', height: 'auto', maxWidth: '800px', zIndex: 60 }}>
        {' '}
        {/* Adjusted size */}
        <button onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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
          <div className='-translate-x-1/2 absolute backdrop-blur-lg backdrop-filter bg-opacity-50 drop-shadow-lg font-bold left-1/2 m-4 p-2 text-9xl text-white top-1/4 transform z-10'>
            Sonoverse
          </div>

          <TypeAnimation
            className='-translate-x-1/2 absolute backdrop-blur-lg backdrop-filter bg-opacity-50 drop-shadow-lg font-bold left-1/2 p-2 rounded text-4xl text-white top-[calc(40%+100px)]'
            sequence={[
              'Own your audio.',
              1500,
              'Automatic DMCA protection.',
              1500,
              'ML-powered analysis.',
              1500,
            ]}
            speed={99}
            deletionSpeed={99}
            repeat={Infinity}
          />

          {/* Button container with increased padding between buttons */}
          <div
            className='absolute bottom-20 flex space-x-12'
            style={{ left: '50%', transform: 'translateX(-50%)' }}>
            <button
              className='animate-pulse-grow bg-black border border-white duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-white font-semibold hover:bg-white hover:text-black px-6 py-3 rounded shadow text-white transition'
              style={{ animation: 'pulse-grow 3s infinite' }}>
              Get Started
            </button>
            <button
              className='animate-pulse-grow bg-black border border-white duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-white font-semibold hover:bg-white hover:text-black px-6 py-3 rounded shadow text-white transition'
              style={{ animation: 'pulse-grow 3s infinite' }}
              onClick={handleOpenModal} // Open Modal
            >
              Learn More
            </button>
          </div>
          <PerlinSketchNoSSR />
        </div>
        <main
          className={`flex min-h-screen flex-col items-center justify-center ${inter.className}`}></main>
      </div>

      {/* Modal with adjusted size */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}>
        <h2 className='font-bold text-xl'>Sonoverse</h2>
        <p>
          We operate our own custom Sonoverse <strong>Ethereum L2 chain</strong>{' '}
          to track ownership of content our artists upload, with the help of
          Caldera. <br />
          <br />
          We use our own <strong>custom LSTM deep learning model</strong> to
          detect proactively detect parodies and fraudulent remixes.
        </p>
      </Modal>
    </>
  );
}
