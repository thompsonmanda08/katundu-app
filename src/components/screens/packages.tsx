"use client";
import { ShipmentCard } from "@/components/elements";
import useMainStore from "@/context/main-store";
import { ShipmentRecord, User } from "@/lib/types";
import {
  Button,
  Chip,
  Divider,
  Pagination,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ActivityIcon,
  BoxIcon,
  ChevronLeft,
  ChevronRight,
  PackageIcon,
} from "lucide-react";
import React, { Key } from "react";
import { CargoDetailsModal, PayToAccessModal } from "../forms";
import EmptyState from "../ui/empty-state";
import { useUserDeliveries } from "@/hooks/use-query-data";
import { QUERY_KEYS } from "@/lib/constants";

function Packages({ user }: { user: User }) {
  const {
    isOpen: showDetailsModal,
    onOpen: openShowDetailsModal,
    onClose: closeShowDetailsModal,
  } = useDisclosure();
  const { setSelectedShipment } = useMainStore((state) => state);

  const [selectedDeliveryId, setSelectedDeliveryId] =
    React.useState<string>("");

  const [currentPage, setCurrentPage] = React.useState(1);
  const [size, setSize] = React.useState(3);
  const [currentTab, setCurrentTab] = React.useState<Key | string>("ALL");

  const {
    isOpen: showPaymentModal,
    onOpen: openPaymentModal,
    onClose: closePaymentModal,
  } = useDisclosure();

  const queryClient = useQueryClient();

  const { data: deliveriesResponse, isLoading: isLoaded } = useUserDeliveries(
    currentPage,
    size
  );

  const listData = deliveriesResponse?.data;
  const allUserDeliveries = listData?.deliveries as Partial<ShipmentRecord>[];

  async function showDetails(item: Partial<ShipmentRecord>) {
    openShowDetailsModal();
    setSelectedDeliveryId(item?.id as string);
  }

  function handlePublish(item: Partial<ShipmentRecord>) {
    openPaymentModal();
    setSelectedShipment(item);
  }

  const filteredItems = React.useMemo(() => {
    let FilteredData = [...allUserDeliveries];

    if (currentTab !== "ALL" && allUserDeliveries?.length > 0) {
      FilteredData = allUserDeliveries.filter((shipment) =>
        shipment?.deliveryStatus
          ?.toUpperCase()
          .includes(currentTab?.toString()?.toUpperCase())
      );
    }

    return FilteredData;
  }, [allUserDeliveries, currentTab]);

  React.useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.USER_DELIVERIES, currentPage, size],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  console.log("filteredItems", filteredItems);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-4 p-4">
        <h3 className="font-semibold">My Packages</h3>
        <Tabs
          aria-label="Options"
          color="primary"
          variant="bordered"
          selectedKey={String(currentTab)}
          onSelectionChange={setCurrentTab}
          classNames={{
            tabList: "w-full",
          }}
        >
          <Tab
            key="ALL"
            title={
              <div className="flex items-center space-x-2">
                <PackageIcon />
                <span>All</span>
                <Chip size="sm" variant="faded" className="scale-75">
                  {listData?.totalElements || 0}
                </Chip>
              </div>
            }
          />
          <Tab
            key="IN TRANSIT"
            title={
              <div className="flex items-center space-x-2">
                <ActivityIcon />
                <span>In Transit</span>
              </div>
            }
          />
          <Tab
            key="DELIVERED"
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
          {isLoaded ? (
            Array.from({ length: 3 })?.map((_, index) => (
              <ShipmentCard key={index} isDataLoading={isLoaded} />
            ))
          ) : filteredItems?.length == 0 ? (
            <>
              <div className="flex items-center justify-center">
                <EmptyState
                  title={
                    currentTab == "IN TRANSIT"
                      ? "No Shipments in Transit"
                      : currentTab == "DELIVERED"
                      ? "No Shipments Delivered"
                      : "No Shipments"
                  }
                  description="You have no Katundu here yet"
                  width={380}
                  height={380}
                  classNames={{ image: "w-80 h-80" }}
                />
              </div>
            </>
          ) : (
            filteredItems?.map((item) => (
              <ShipmentCard
                key={String(item?.id)}
                displayDetails={true}
                handlePublish={() => handlePublish(item)}
                handleOpenDetailsModal={() => showDetails(item)}
                {...item}
              />
            ))
          )}
        </div>

        {(allUserDeliveries?.length > 3 || currentPage > 1) && (
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
              total={listData?.totalPages || 3}
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
      {/* **************************************************** */}
      <PayToAccessModal
        isOpen={showPaymentModal}
        onOpen={openPaymentModal}
        onClose={closePaymentModal}
      />
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

export default Packages;
