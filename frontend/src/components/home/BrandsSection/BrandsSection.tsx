import cieloLogo from "../../../assets/brands/cielo.png";
import devonLogo from "../../../assets/brands/DevoN.png";
import gessiLogo from "../../../assets/brands/GESSI.png";
import jorgerLogo from "../../../assets/brands/Jorger.png";
import kronosLogo from "../../../assets/brands/KRONOS_ceramiche.png";
import sicisLogo from "../../../assets/brands/SICIS.png";
import "./BrandsSection.css";

export const BrandsSection = () => {
  const brands = [
    { id: 1, name: "GESSI", logo: gessiLogo },
    { id: 2, name: "Cielo", logo: cieloLogo },
    { id: 3, name: "Jorger", logo: jorgerLogo },
    { id: 4, name: "KRONOS Ceramiche", logo: kronosLogo },
    { id: 5, name: "DevoN", logo: devonLogo },
    { id: 6, name: "SICIS", logo: sicisLogo },
  ];

  return (
    <section className="brands-section">
      <div className="brands-section__container">
        <div className="brands-section__grid">
          {brands.map((brand) => (
            <div key={brand.id} className="brands-section__brand">
              <img
                src={brand.logo}
                alt={brand.name}
                className="brands-section__logo"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
