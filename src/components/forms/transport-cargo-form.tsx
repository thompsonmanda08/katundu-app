"use client";
import { OptionItem, ShipmentRecord } from "@/lib/types";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Divider,
  Pagination,
  useDisclosure,
} from "@heroui/react";
import React, { useEffect } from "react";
import { useCities } from "@/hooks/use-query-data";
import { ShipmentCard } from "../elements";
import { getAvailableDeliveries } from "@/app/_actions/delivery-actions";
import { useMutation } from "@tanstack/react-query";
import CargoDetailsModal from "./delivery-details-modal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EmptyState from "../ui/empty-state";

export function TransportCargoForm() {
  const {
    isOpen: showDetailsModal,
    onOpen: openShowDetailsModal,
    onClose: closeShowDetailsModal,
  } = useDisclosure();

  const { data: DISTRICTS } = useCities(100);

  const [selectedDeliveryId, setSelectedDeliveryId] =
    React.useState<string>("");

  const [currentPage, setCurrentPage] = React.useState(1);
  const [size, setSize] = React.useState(3);
  const [city, setCity] = React.useState("");

  const listMutation = useMutation({
    mutationFn: () => getAvailableDeliveries(city, currentPage, size),
  });

  const listData = listMutation?.data?.data;

  const availableDeliveries = (listData?.deliveries ||
    []) as Partial<ShipmentRecord>[];

  async function showDetails(item: Partial<ShipmentRecord>) {
    openShowDetailsModal();
    setSelectedDeliveryId(item?.id as string);
  }

  const fetchAvailableDeliveries = async () => await listMutation.mutateAsync();

  useEffect(() => {
    fetchAvailableDeliveries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      <div className="-mt-6 mb-2 ml-11 flex w-full flex-col gap-1">
        <p className="text-xs text-foreground">
          Where would you like to get cargo pickups
        </p>
      </div>
      <div className="flex w-full flex-1 gap-2">
        <Autocomplete
          label="Pick up city"
          variant="bordered"
          defaultItems={(DISTRICTS || []) as OptionItem[]}
          placeholder="Select a city"
          className=""
          selectedKey={city}
          onSelectionChange={(city) => setCity(String(city))}
        >
          {(item) => (
            <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>
      <Divider />
      {city && (
        <p className="text-sm font-medium text-default-500">
          Katundu from: <span className="font-bold">{city}</span>
        </p>
      )}
      <div className="flex w-full flex-col gap-4">
        {listMutation?.isPending ? (
          Array.from({ length: 3 })?.map((_, index) => (
            <ShipmentCard key={index} isDataLoading={listMutation?.isPending} />
          ))
        ) : availableDeliveries?.length == 0 ? (
          <>
            {" "}
            <div className="flex items-center justify-center">
              <EmptyState
                src="/images/empty-boxes.png"
                title="No Shipments Available"
                description="Oops! There is nothing here..."
                width={380}
                height={380}
                classNames={{ image: "w-80 h-60" }}
              />
            </div>
          </>
        ) : (
          availableDeliveries?.map((item) => (
            <ShipmentCard
              key={String(item?.id)}
              displayDetails={true}
              isDataLoading={listMutation?.isPending}
              handleOpenDetailsModal={() => showDetails(item)}
              {...item}
            />
          ))
        )}

        {(availableDeliveries?.length > 3 || currentPage > 1) && (
          <div className="flex items-center justify-center gap-2">
            <Button
              isIconOnly
              variant="flat"
              isDisabled={!listData?.hasPrevious}
              onPress={() =>
                setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
              }
            >
              <ChevronLeft />
            </Button>
            <Pagination
              page={currentPage}
              total={listData?.totalPages}
              onChange={setCurrentPage}
            />

            <Button
              isIconOnly
              variant="flat"
              isDisabled={!listData?.hasNext}
              onPress={() =>
                setCurrentPage((prev) => (prev < 10 ? prev + 1 : prev))
              }
            >
              <ChevronRight />
            </Button>
          </div>
        )}
      </div>
      {/* ************************************************************* */}
      <CargoDetailsModal
        isOpen={showDetailsModal}
        onOpen={openShowDetailsModal}
        onClose={closeShowDetailsModal}
        deliveryId={selectedDeliveryId}
        setDeliveryId={setSelectedDeliveryId}
      />
      {/* ************************************************************* */}
    </div>
  );
}
