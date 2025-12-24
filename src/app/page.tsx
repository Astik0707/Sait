import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HouseAnimation from "@/components/HouseAnimation";
import Listings from "@/components/Listings";
import Deals from "@/components/Deals";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HouseAnimation />
        <Listings />
        <Deals />
        <Services />
        <Testimonials />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}

