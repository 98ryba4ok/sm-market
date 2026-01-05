import { useState, useEffect } from "react";
import { brandsApi } from "../../../api";
import type { Brand } from "../../../types";
import "./BrandsSection.css";

export const BrandsSection = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    brandsApi
      .list()
      .then((response) => setBrands(response.data))
      .catch((error) => console.error("Failed to load brands:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return null; // or a loading spinner
  }

  if (brands.length === 0) {
    return null;
  }

  return (
    <section className="brands-section">
      <div className="brands-section__container">
        <div className="brands-section__grid">
          {brands.map((brand) => (
            <div key={brand.id} className="brands-section__brand">
              <span className="brands-section__logo">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
