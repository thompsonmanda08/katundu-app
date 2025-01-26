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
import useMainStore from "@/context/main-store";
import { useCities } from "@/hooks/use-query-data";
import { ShipmentCard } from "../elements";
import {
  getAvailableDeliveries,
  getDeliveryDetails,
} from "@/app/_actions/delivery-actions";
import { useMutation } from "@tanstack/react-query";
import CargoDetailsModal from "./delivery-details-modal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import EmptyState from "../ui/empty-state";

export function TransportCargoForm() {
  const {
    isOpen: showDetailsModal,
    onOpen: openShowDetailsModal,
    onClose: closeShowDetailsModal,
  } = useDisclosure();

  const { data: DISTRICTS } = useCities(100);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [size, setSize] = React.useState(3);
  const [city, setCity] = React.useState("");
  const debouncedSearch = useDebounce(city);

  const { selectedShipment, setSelectedShipment } = useMainStore(
    (state) => state
  );

  const listMutation = useMutation({
    mutationFn: () => getAvailableDeliveries(city, currentPage, size),
  });

  const listData = listMutation?.data?.data;

  const detailsMutation = useMutation({
    mutationFn: (ID: string) => getDeliveryDetails(ID),
  });

  const availableDeliveries = (detailsMutation?.data?.data?.deliveries ||
    []) as Partial<ShipmentRecord>[];

  async function showDetails(item: Partial<ShipmentRecord>) {
    openShowDetailsModal();

    await detailsMutation.mutateAsync(String(item?.id));

    const details = {
      ...item,
      ...detailsMutation?.data?.data?.delivery,
    };

    setSelectedShipment(details);
  }

  useEffect(() => {
    const loadShipments = async () => await listMutation.mutateAsync();

    console.log("SEARCH DATA==> ", listData);

    loadShipments();
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
          defaultItems={DISTRICTS as OptionItem[]}
          placeholder="Select a city"
          className=""
          selectedKey={city}
          onSelectionChange={(city) => setCity(String(city))}
        >
          {(item) => (
            <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>
      <Divider />
      {city && (
        <p className="text-default-500 font-medium text-sm">
          Katundu from:{" "}
          <span className="font-bold">
            {(DISTRICTS as OptionItem[])?.find((c) => c.id == city)?.name}
          </span>
        </p>
      )}
      <div className="flex w-full flex-col gap-4">
        {listMutation?.isPending ? (
          Array.from({ length: 3 })?.map((_, index) => (
            <ShipmentCard key={index} isDataLoaded={listMutation?.isPending} />
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
              // src={item?.cargo?.image}
              displayDetails={true}
              isDataLoaded={detailsMutation?.isPending}
              handleOpenDetailsModal={() => showDetails(item)}
              handleViewDetails={async () =>
                await detailsMutation.mutateAsync(String(item?.id))
              }
              loadingDetails={detailsMutation?.isPending}
              {...item}
              {...detailsMutation?.data?.data?.delivery}
            />
          ))
        )}

        {(availableDeliveries?.length || currentPage > 1) && (
          <div className="flex items-center gap-2 justify-center">
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
        loadingDetails={detailsMutation?.isPending}
        {...selectedShipment}
      />
      {/* ************************************************************* */}
    </div>
  );
}
