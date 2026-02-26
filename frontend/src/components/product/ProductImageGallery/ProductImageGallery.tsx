import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { getImageUrl } from "../../../utils/imageUrl";
import "./ProductImageGallery.css";

interface ProductImage {
  id: number;
  image: string;
  alt_text?: string;
  is_main?: boolean;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string>(() => {
    const mainImg = images.find(img => img.is_main);
    return getImageUrl(mainImg?.image || images[0]?.image || "");
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = () => {
    setIsFullscreen(true);
    const index = images.findIndex(img => getImageUrl(img.image) === selectedImage);
    setCurrentImageIndex(index >= 0 ? index : 0);
  };

  const handleNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(getImageUrl(images[nextIndex].image));
  };

  const handlePrevImage = () => {
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(getImageUrl(images[prevIndex].image));
  };

  const handleThumbnailClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    const index = images.findIndex(img => getImageUrl(img.image) === imageUrl);
    setCurrentImageIndex(index >= 0 ? index : 0);
  };

  return (
    <>
      <div className="product-image-gallery">
        {/* Thumbnails - Horizontal Scroll on Mobile */}
        {images.length > 1 && (
          <div className="product-image-gallery__thumbnails">
            {images.map((img) => {
              const imageUrl = getImageUrl(img.image);
              return (
                <button
                  key={img.id}
                  className={`product-image-gallery__thumbnail ${
                    selectedImage === imageUrl ? "product-image-gallery__thumbnail--active" : ""
                  }`}
                  onClick={() => handleThumbnailClick(imageUrl)}
                  aria-label={`Выбрать изображение ${img.alt_text || productName}`}
                >
                  <img src={imageUrl} alt={img.alt_text || productName} />
                </button>
              );
            })}
          </div>
        )}

        {/* Main Image */}
        <div className="product-image-gallery__main-image-container">
          <button
            className="product-image-gallery__main-image"
            onClick={handleImageClick}
            aria-label="Открыть изображение на весь экран"
          >
            {selectedImage ? (
              <img src={selectedImage} alt={productName} />
            ) : (
              <div className="product-image-gallery__no-image">Нет изображения</div>
            )}
            <div className="product-image-gallery__zoom-hint">
              <ZoomIn size={24} />
            </div>
          </button>
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      <Dialog.Root open={isFullscreen} onOpenChange={setIsFullscreen}>
        <Dialog.Portal>
          <Dialog.Overlay className="product-image-gallery__overlay" />
          <Dialog.Content className="product-image-gallery__fullscreen-content">
            <Dialog.Close className="product-image-gallery__close-button">
              <X size={32} />
            </Dialog.Close>

            <button
              className="product-image-gallery__nav-button product-image-gallery__nav-button--prev"
              onClick={handlePrevImage}
              aria-label="Предыдущее изображение"
            >
              <ChevronLeft size={32} />
            </button>

            <div className="product-image-gallery__fullscreen-image">
              <img src={getImageUrl(images[currentImageIndex].image)} alt={productName} />
            </div>

            <button
              className="product-image-gallery__nav-button product-image-gallery__nav-button--next"
              onClick={handleNextImage}
              aria-label="Следующее изображение"
            >
              <ChevronRight size={32} />
            </button>

            {/* Thumbnails in fullscreen */}
            {images.length > 1 && (
              <div className="product-image-gallery__fullscreen-thumbnails">
                {images.map((img, index) => {
                  const imageUrl = getImageUrl(img.image);
                  return (
                    <button
                      key={img.id}
                      className={`product-image-gallery__fullscreen-thumbnail ${
                        index === currentImageIndex ? "product-image-gallery__fullscreen-thumbnail--active" : ""
                      }`}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setSelectedImage(imageUrl);
                      }}
                      aria-label={`Перейти к изображению ${index + 1}`}
                    >
                      <img src={imageUrl} alt={img.alt_text || productName} />
                    </button>
                  );
                })}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};