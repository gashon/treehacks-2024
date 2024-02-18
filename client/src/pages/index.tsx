import dynamic from "next/dynamic";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const PerlinSketchNoSSR = dynamic(() => import("@/components/perlin"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="bg-white h-screen overflow-hidden">
      <div className="h-full relative">
        <p className="absolute left-0 m-4 top-0 z-10">Sonoverse</p>
        <PerlinSketchNoSSR />
      </div>
      <main
        className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`}
      ></main>
    </div>
  );
}
