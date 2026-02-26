import { Filter, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator from "@radix-ui/react-separator";

import { CategoryFilter } from "../CategoryFilter/CategoryFilter";
import { ProductFilters } from "../ProductFilters/ProductFilters";
import type { Brand } from "../../../types";
import type { CategoryListItem } from "../../../types/category";
import type { Room } from "../../../types/room";
import "./MobileFilters.css";

interface MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  selectedRoom: string | null;
  categories: CategoryListItem[];
  selectedCategories: number[];
  brands: Brand[];
  minPrice: number | undefined;
  maxPrice: number | undefined;
  inStock: boolean;
  onSale: boolean;
  minRating: number | undefined;
  selectedLabels: string[];
  selectedBrands: number[];
  onSelectRoom: (roomSlug: string | null) => void;
  onToggleCategory: (categoryId: number) => void;
  onMinPriceChange: (value: number | undefined) => void;
  onMaxPriceChange: (value: number | undefined) => void;
  onInStockChange: (value: boolean) => void;
  onSaleChange: (value: boolean) => void;
  onMinRatingChange: (value: number | undefined) => void;
  onLabelsChange: (labels: string[]) => void;
  onBrandsChange: (brandIds: number[]) => void;
}

export const MobileFilters = ({
  isOpen,
  onClose,
  rooms,
  selectedRoom,
  categories,
  selectedCategories,
  brands,
  minPrice,
  maxPrice,
  inStock,
  onSale,
  minRating,
  selectedLabels,
  selectedBrands,
  onSelectRoom,
  onToggleCategory,
  onMinPriceChange,
  onMaxPriceChange,
  onInStockChange,
  onSaleChange,
  onMinRatingChange,
  onLabelsChange,
  onBrandsChange,
}: MobileFiltersProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="mobile-filters__overlay" />
        <Dialog.Content className="mobile-filters__content">
          <div className="mobile-filters__header">
            <div className="mobile-filters__header-left">
              <Filter size={20} />
              <Dialog.Title className="mobile-filters__title">
                Фильтры
              </Dialog.Title>
            </div>
            <Dialog.Close className="mobile-filters__close">
              <X size={24} />
            </Dialog.Close>
          </div>

          <Separator.Root className="mobile-filters__separator" />

          <ScrollArea.Root className="mobile-filters__scroll-area">
            <ScrollArea.Viewport className="mobile-filters__viewport">
              <div className="mobile-filters__body">
                <CategoryFilter
                  rooms={rooms}
                  selectedRoom={selectedRoom}
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onSelectRoom={onSelectRoom}
                  onToggleCategory={onToggleCategory}
                />
                <ProductFilters
                  brands={brands}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  inStock={inStock}
                  onSale={onSale}
                  minRating={minRating}
                  selectedLabels={selectedLabels}
                  selectedBrands={selectedBrands}
                  onMinPriceChange={onMinPriceChange}
                  onMaxPriceChange={onMaxPriceChange}
                  onInStockChange={onInStockChange}
                  onSaleChange={onSaleChange}
                  onMinRatingChange={onMinRatingChange}
                  onLabelsChange={onLabelsChange}
                  onBrandsChange={onBrandsChange}
                />
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar className="mobile-filters__scrollbar" orientation="vertical">
              <ScrollArea.Thumb className="mobile-filters__thumb" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>

          <div className="mobile-filters__footer">
            <Dialog.Close className="mobile-filters__apply-button">
              Показать результаты
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};