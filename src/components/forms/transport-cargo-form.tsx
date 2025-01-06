"use client";
import React, { useEffect, useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { Sender, ShipmentRecord, User } from "@/lib/types";
import { ArrowLeftIcon } from "lucide-react";
import { NavIconButton } from "../elements";

type CargoProps = {
  isOpen: boolean;
  isLoading: boolean;
  onOpen: (open: boolean) => void;
  handleSave: () => void;
  handleClose: () => void;
  onClose: () => void;
};

const INIT_STATE = {
  shipperName: "",
  shipperPhone: "",
  pickUpLocation: "",
  deliveryLocation: "",
  cargoDescription: "",
  cargoMeasure: "",
  packaging: "",
  containerSize: "",
  deliveryStatus: "",
  transporterName: "",
  transporterContact: "",
};

export default function TransportCargoForm({
  isOpen,
  onOpen,
  onClose,
  handleClose,
  handleSave,
  isLoading,
  user,
}: CargoProps & {
  user: Partial<User> | Partial<Sender>;
}) {
  const [value, setValue] = React.useState<any>(undefined);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);
  const [cargoFormData, setCargoFormData] =
    React.useState<ShipmentRecord>(INIT_STATE);

  const updateFormData = (field: Partial<ShipmentRecord>) => {
    setCargoFormData((prev) => ({ ...prev, ...field }));
  };

  const CITIES = [
    { id: 1, name: "Lusaka" },
    { id: 2, name: "Ndola" },
    { id: 3, name: "Kitwe" },
  ];

  // useEffect(() => {
  //   // ID VALUE FOR OTHER IS 1
  //   if (value != 1) {
  //     const selectedItem = CITIES.find((item) => item.id == value);
  //     setSelectedItem(selectedItem);
  //     setNewUniversity(selectedItem);
  //   } else {
  //     updateFormData({
  //       name: selectedItem?.name,
  //       location: selectedItem?.location,
  //     });
  //   }
  // }, [value]);

  return (
    <Modal
      isOpen={isOpen}
      size="full"
      isDismissable={false}
      onClose={onClose}
      placement="bottom"
      classNames={{
        base: "rounded-b-none pb-4",
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-row items-center gap-2">
            <Button
              color="primary"
              variant="flat"
              // isIconOnly
              onPress={onClose}
              className="max-w-max min-w-fit "
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
            Transport a Package
          </ModalHeader>
          <ModalBody>
            {/*  */}
            <Autocomplete
              label="From"
              variant="bordered"
              defaultItems={CITIES}
              placeholder="Select a city"
              className="max-w-md"
              selectedKey={value}
              onSelectionChange={setValue}
            >
              {(item) => (
                <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
              )}
            </Autocomplete>
            <Autocomplete
              label="To"
              variant="bordered"
              defaultItems={CITIES}
              placeholder="Select a city"
              className="max-w-md"
              selectedKey={value}
              onSelectionChange={setValue}
            >
              {(item) => (
                <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
              )}
            </Autocomplete>

            {
              <Input
                label="Mobile Number"
                variant="bordered"
                defaultValue={String(user?.mobile)}
                onChange={(e) => {
                  updateFormData({ shipperPhone: e.target.value });
                }}
                className="mt-px"
              />
            }
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              isDisabled={isLoading}
              onPress={() => handleClose()}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              isLoading={isLoading}
              isDisabled={isLoading}
              onPress={() => {
                handleSave();
                handleClose();
                setValue(undefined);
                setSelectedItem(null);
              }}
            >
              Next
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
