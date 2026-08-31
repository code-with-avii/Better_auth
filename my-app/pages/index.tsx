import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero"
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Security from "@/components/landing/Security";
import Technology from "@/components/landing/Technology";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
         <HowItWorks />
        <Security />
        <Technology />
        <CTA /> 
      </main>
      <Footer />
    </>
  );
}