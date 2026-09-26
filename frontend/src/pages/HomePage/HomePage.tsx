import { HeroSlider } from "../../components/home/HeroSlider/HeroSlider";
import { HomeEssentialsSection } from "../../components/home/HomeEssentialsSection/HomeEssentialsSection";
import { BrandsSection } from "../../components/home/BrandsSection/BrandsSection";
import { CategoriesSection } from "../../components/home/CategoriesSection/CategoriesSection";
import { HomeProductsSection } from "../../components/home/HomeProductsSection/HomeProductsSection";
import { NewProductsSection } from "../../components/home/NewProductsSection/NewProductsSection";
import { ContactFormSection } from "../../components/home/ContactFormSection/ContactFormSection";
import "./HomePage.css";

export const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSlider />
      <BrandsSection />
      <HomeEssentialsSection />
      <CategoriesSection />
      <HomeProductsSection />
      <NewProductsSection />
      <ContactFormSection />
    </div>
  );
};

