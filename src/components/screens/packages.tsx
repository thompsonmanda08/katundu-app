"use client";
import {
  getDeliveryDetails,
  getUserDeliveries,
} from "@/app/_actions/delivery-actions";
import { ShipmentCard } from "@/components/elements";
import useMainStore from "@/context/main-store";
import {
  useAvailableDeliveries,
  useUserDeliveries,
} from "@/hooks/use-query-data";
import { ShipmentRecord } from "@/lib/types";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Image,
  Pagination,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import {
  ActivityIcon,
  ArrowRightIcon,
  BoxIcon,
  ChevronLeft,
  ChevronRight,
  PackageIcon,
} from "lucide-react";
import React, { useEffect } from "react";
import { CargoDetailsModal } from "../forms";

function Packages() {
  const {
    isOpen: showDetailsModal,
    onOpen: openShowDetailsModal,
    onClose: closeShowDetailsModal,
  } = useDisclosure();
  const { setSelectedShipment, selectedShipment } = useMainStore(
    (state) => state
  );

  const [currentPage, setCurrentPage] = React.useState(1);
  const [size, setSize] = React.useState(3);

  const mutation = useMutation({
    mutationFn: (ID: string) => getDeliveryDetails(ID),
  });

  const deliveriesMutation = useMutation({
    mutationFn: () => getUserDeliveries(currentPage, size),
  });

  const fetchDeliveries = async () => await deliveriesMutation.mutateAsync();

  const deliveryData = deliveriesMutation?.data?.data;

  const allUserDeliveries =
    deliveryData?.deliveries as Partial<ShipmentRecord>[];

  const isLoaded = deliveriesMutation?.isPending;

  useEffect(() => {
    fetchDeliveries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  async function showDetails(item: Partial<ShipmentRecord>) {
    openShowDetailsModal();

    await mutation.mutateAsync(String(item?.id));

    const details = {
      ...item,
      ...mutation?.data?.data?.delivery,
    };

    setSelectedShipment(details);
  }
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-4 p-4 w-full">
        <h3 className="font-semibold">My Packages</h3>
        <Tabs
          aria-label="Options"
          color="primary"
          variant="bordered"
          classNames={{
            tabList: "w-full",
          }}
        >
          <Tab
            key="0"
            title={
              <div className="flex items-center space-x-2">
                <PackageIcon />
                <span>All</span>
                <Chip size="sm" variant="faded" className="scale-75">
                  {deliveryData?.totalElements || 0}
                </Chip>
              </div>
            }
          />
          <Tab
            key="1"
            title={
              <div className="flex items-center space-x-2">
                <ActivityIcon />
                <span>In Transit</span>
              </div>
            }
          />
          <Tab
            key="2"
            title={
              <div className="flex items-center space-x-2">
                <BoxIcon />
                <span>Delivered</span>
              </div>
            }
          />
        </Tabs>
        <Divider />
        <div className="flex w-full flex-col gap-4">
          {isLoaded
            ? Array.from({ length: 3 })?.map((_, index) => (
                <ShipmentCard key={index} isDataLoaded={isLoaded} />
              ))
            : allUserDeliveries?.map((item) => (
                <ShipmentCard
                  key={String(item?.id)}
                  // src={item?.cargo?.image}
                  displayDetails={true}
                  isDataLoaded={isLoaded}
                  handleOpenDetailsModal={() => showDetails(item)}
                  handleViewDetails={async () =>
                    await mutation.mutateAsync(String(item?.id))
                  }
                  loadingDetails={mutation?.isPending}
                  {...item}
                  {...mutation?.data?.data?.delivery}
                />
              ))}
        </div>

        {(allUserDeliveries || currentPage > 1) && (
          <div className="flex items-center gap-2 justify-center">
            <Button
              isIconOnly
              variant="flat"
              isDisabled={!deliveryData?.hasPrevious}
              onPress={() =>
                setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
              }
            >
              <ChevronLeft />
            </Button>
            <Pagination
              page={currentPage}
              total={deliveryData?.totalPages}
              onChange={setCurrentPage}
            />

            <Button
              isIconOnly
              variant="flat"
              isDisabled={!deliveryData?.hasNext}
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
        loadingDetails={mutation?.isPending}
        {...selectedShipment}
      />
      {/* ************************************************************* */}
    </div>
  );
}

export default Packages;
