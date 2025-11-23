import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-purple-500/30">
      <Navbar />
      <Hero />
    </main>
  );
}
