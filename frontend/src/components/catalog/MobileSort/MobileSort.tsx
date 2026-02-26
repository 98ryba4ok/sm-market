import { ArrowUpDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import "./MobileSort.css";

interface MobileSortProps {
  ordering: string;
  onOrderingChange: (ordering: string) => void;
}

const SORT_OPTIONS = [
  { value: "price", label: "Цена: по возрастанию" },
  { value: "-price", label: "Цена: по убыванию" },
  { value: "-discount_percentage", label: "По размеру скидки" },
  { value: "-orders_count", label: "По популярности" },
  { value: "-created_at", label: "По новизне" },
];

export const MobileSort = ({ ordering, onOrderingChange }: MobileSortProps) => {
  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === ordering);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="mobile-sort__trigger">
        <ArrowUpDown size={18} />
        <span className="mobile-sort__label">
          {selectedOption?.label || "Сортировка"}
        </span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="mobile-sort__content" align="end">
          {SORT_OPTIONS.map((option) => (
            <DropdownMenu.Item
              key={option.value}
              className={`mobile-sort__item ${
                ordering === option.value ? "mobile-sort__item--active" : ""
              }`}
              onClick={() => onOrderingChange(option.value)}
            >
              {option.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};