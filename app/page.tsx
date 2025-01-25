import Hero from "@/Components/Hero";
import Highlights from "@/Components/Highlights";
import Navbar from "@/Components/Navbar";
import "@/app/globals.css"

export default function Home() {
  return (
    <main className="bg-black"> 
      <Navbar/>
      <Hero/>
      <Highlights/>
    </main>
  );
}
