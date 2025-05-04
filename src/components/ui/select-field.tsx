import { Select, SelectItem } from "@heroui/react";

import { cn } from "@/lib/utils";

import React from "react";
import { OptionItem } from "@/lib/types";

type SelectFieldProps = {
  value: string | number | string[] | number[];
  onChange: (value: string | number | string[] | number[]) => void;
  options: OptionItem[] | string[] | number[];
  placeholder?: string;
  listItemName?: string; // CHOOSE THE VALUE TO BE DISPLAYED
  selector?: string; // CHOOSE THE VALUE TO BE SELECTED
  label?: string;
  name?: string;
  selectedItem?: string | number;
  defaultValue?: string | number;
  className?: string;
  classNames?: {
    base?: string;
    wrapper?: string;
    label?: string;
    trigger?: string;
    value?: string;
    placeholder?: string;
    listbox?: string;
    popoverContent?: string;
    selectorIcon?: string;
  };
  onError?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  required?: boolean;
  prefilled?: boolean;
};

function SelectField({
  value,
  onChange,
  options,
  placeholder,
  listItemName, // CHOOSE THE VALUE TO BE DISPLAYED
  selector, // CHOOSE THE VALUE TO BE SELECTED
  name,
  label,
  className,
  classNames,
  onError,
  prefilled = false,
  ...props
}: SelectFieldProps) {
  return (
    <Select
      required={props?.required}
      className={cn("font-medium", className)}
      id={name}
      isInvalid={onError}
      isRequired={props?.required}
      name={name}
      label={label}
      placeholder={placeholder}
      selectedKeys={
        (Boolean(prefilled) && typeof value === "string") ||
        typeof value === "number"
          ? [value]
          : undefined
      }
      value={Array.isArray(value) ? value.map(String) : value}
      variant="bordered"
      onChange={(event) => onChange(event.target.value)}
      {...props}
    >
      {/* OPTIONS ARRAY MUST BE AN ARRAY OF OBJECTS WITH ID, NAME AND VALUE PROPERTIES. */}
      {options &&
        options.map((item, index) => {
          const ItemValue = String(
            (selector &&
            typeof item === "object" &&
            item !== null &&
            selector in item
              ? String(item[selector as keyof typeof item])
              : undefined) ||
              (typeof item === "object" && item !== null
                ? item?.id
                : undefined) ||
              item ||
              index
          );

          const ItemLabel = String(
            (listItemName &&
            typeof item === "object" &&
            item !== null &&
            listItemName in item
              ? item[listItemName as keyof typeof item]
              : undefined) ||
              (typeof item === "object" && item !== null && "name" in item
                ? item.name
                : undefined) ||
              (typeof item === "object" && item !== null && "label" in item
                ? item.label
                : undefined) ||
              item ||
              index
          );

          return (
            <SelectItem
              key={ItemValue}
              className="font-medium"
              value={ItemValue}
            >
              {ItemLabel}
            </SelectItem>
          );
        })}
    </Select>
  );
}

export default SelectField;
