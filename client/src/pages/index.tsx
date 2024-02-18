import dynamic from "next/dynamic";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const PerlinSketchNoSSR = dynamic(() => import("@/components/perlin"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="bg-white h-auto w-auto">
      <PerlinSketchNoSSR />

      <main
        className={`flex min-h-screen flex-col items-center justify-between ${inter.className}`}
      >
        tmp de
      </main>
    </div>
  );
}
