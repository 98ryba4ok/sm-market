import { HeroSlider } from "../../components/home/HeroSlider/HeroSlider";
import { BrandsSection } from "../../components/home/BrandsSection/BrandsSection";
import { CategoriesSection } from "../../components/home/CategoriesSection/CategoriesSection";
import { NewProductsSection } from "../../components/home/NewProductsSection/NewProductsSection";
import { ContactFormSection } from "../../components/home/ContactFormSection/ContactFormSection";
import "./HomePage.css";

export const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSlider />
      <BrandsSection />
      <CategoriesSection />
      <NewProductsSection />
      <ContactFormSection />
    </div>
  );
};

