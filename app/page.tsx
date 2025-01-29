import Features from "@/Components/Features";
import Hero from "@/Components/Hero";
import Highlights from "@/Components/Highlights";
import Model from "@/Components/Model";
import Navbar from "@/Components/Navbar";
import "@/app/globals.css"

export default function Home() {
  return (
    <main className="bg-black"> 
      <Navbar/>
      <Hero/>
      <Highlights/>
      <Model/>
      <Features/>
    </main>
  );
}
