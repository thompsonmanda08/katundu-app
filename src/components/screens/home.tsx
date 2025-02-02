"use client";
import {
  getDeliveryDetails,
  getUserDeliveries,
} from "@/app/_actions/delivery-actions";
import { ShipmentCard } from "@/components/elements";
import {
  TransportCargoModal,
  SendCargoModal,
  CargoDetailsModal,
  PayToAccessModal,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import useMainStore from "@/context/main-store";
import { useAccountProfile, useUserDeliveries } from "@/hooks/use-query-data";
import { ShipmentRecord, User } from "@/lib/types";
import { cn, notify } from "@/lib/utils";
import {
  Divider,
  Image,
  Pagination,
  Skeleton,
  useDisclosure,
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect } from "react";
import EmptyState from "../ui/empty-state";

function Home({ user }: { user: User }) {
  const {
    isOpen,
    onOpen: openSendCargoModal,
    onClose: closeSendCargoModal,
  } = useDisclosure();

  const {
    isOpen: showTransportModal,
    onOpen: openTransportCargoModal,
    onClose: closeTransportCargoModal,
  } = useDisclosure();

  const {
    isOpen: showDetailsModal,
    onOpen: openShowDetailsModal,
    onClose: closeShowDetailsModal,
  } = useDisclosure();

  const {
    isOpen: showPaymentModal,
    onOpen: openPaymentModal,
    onClose: closePaymentModal,
  } = useDisclosure();

  const { setSelectedShipment, selectedShipment } = useMainStore(
    (state) => state
  );

  //?? ONLY NEEDS TO FETCH AND SET COOKIE
  const { isLoading } = useAccountProfile();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [size, setSize] = React.useState(3);

  const { data: deliveriesResponse, isLoading: isLoaded } = useUserDeliveries(
    currentPage,
    size
  );

  const deliveryListMutation = useMutation({
    mutationFn: () => getUserDeliveries(currentPage, size),
  });

  const deliveryDetailsMutation = useMutation({
    mutationFn: (ID: string) => getDeliveryDetails(ID),
  });

  const listData = deliveryListMutation?.data;
  const recentDeliveries = deliveriesResponse?.data?.deliveries?.slice(
    0,
    6
  ) as Partial<ShipmentRecord>[];

  async function showDetails(item: Partial<ShipmentRecord>) {
    openShowDetailsModal();

    await deliveryDetailsMutation.mutateAsync(String(item?.id));

    const details = {
      ...item,
      ...deliveryDetailsMutation?.data?.data?.delivery,
    };

    setSelectedShipment(details);
  }

  function openTransporterModal() {
    if (user.role !== "TRANSPORTER") {
      notify({
        title: "Transporter Action",
        description: "You are not logged in as a transporter",
        variant: "warning",
      });
      return;
    }
    openTransportCargoModal();
  }

  function openSenderModal() {
    if (user.role !== "SENDER") {
      notify({
        title: "Sender Action",
        description: "You are not logged in as a sender",
        variant: "warning",
      });
      return;
    }
    openSendCargoModal();
  }

  function handlePublish(item: Partial<ShipmentRecord>) {
    openPaymentModal();
    setSelectedShipment(item);
  }

  // TODO: PAGINATION NOT WORKING
  useEffect(() => {
    const fetchDeliveries = async () =>
      await deliveryListMutation.mutateAsync();
    fetchDeliveries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full flex-col px-4">
        <h2
          className={cn(
            "font-semibold capitalize text-foreground/80 md:text-xl -mb-2 flex items-center gap-1"
          )}
        >
          <span className="text-xl font-bold text-primary">Hello,</span>{" "}
          <Skeleton className="rounded-lg" isLoaded={!isLoading}>
            {`${user?.firstName}`}
          </Skeleton>
        </h2>
      </div>

      <div className="flex w-full flex-col px-4">
        <h3 className="font-semibold">What would you like to do?</h3>
        <p className="mb-2 text-xs leading-6 text-foreground/50">
          You can either send or transport cargo between locations
        </p>
        <Divider className="mb-2" />
      </div>

      <div className="flex h-32 w-full items-center gap-4 px-5">
        <Button
          variant="bordered"
          color="primary"
          className="h-full flex-1 flex-col border bg-primary-50/20 p-4"
          onPress={openSenderModal}
        >
          <div className="max-h-32 max-w-32 flex-1 overflow-clip">
            <Image
              alt="Cargo Image"
              className="h-full w-full rounded-lg object-contain"
              src={"/images/sender.svg"}
            />
          </div>
          {/* <CarIcon className="h-12 w-12 text-foreground" /> */}
          Send Cargo
        </Button>
        <Button
          variant="bordered"
          color="primary"
          className="h-full flex-1 flex-col border bg-primary-50/20 p-4"
          onPress={openTransporterModal}
        >
          <div className="max-h-32 max-w-32 flex-1 overflow-clip">
            <Image
              alt="Cargo Image"
              className="h-full w-full rounded-lg object-contain"
              src={"/images/transporter.svg"}
            />
          </div>
          Transport Cargo
        </Button>
      </div>

      {/* ************ A LIST OF RECENT SHIPMENTS ********************* */}
      <div className="flex w-full flex-col gap-2 p-4">
        <h3 className="font-semibold">Recent Shipments</h3>
        <Divider className="mb-2" />
        <div className="flex w-full flex-col gap-4">
          {isLoaded ? (
            Array.from({ length: 2 })?.map((_, index) => (
              <ShipmentCard key={index} isDataLoaded={isLoaded} />
            ))
          ) : recentDeliveries?.length == 0 ? (
            <>
              {" "}
              <div className="flex items-center justify-center">
                <EmptyState
                  title="No Recent Shipments"
                  description="You have no Katundu moving to any destinations"
                  width={380}
                  height={380}
                  classNames={{ image: "w-80 h-80" }}
                />
              </div>
            </>
          ) : (
            recentDeliveries?.map((item, index) => (
              <ShipmentCard
                key={String(item?.id || index)}
                displayDetails={true}
                isDataLoaded={isLoaded}
                handleOpenDetailsModal={() => showDetails(item)}
                handlePublish={() => handlePublish(item)}
                loadingDetails={deliveryDetailsMutation?.isPending}
                {...item}
              />
            ))
          )}
        </div>
        {/* {(recentDeliveries?.length || currentPage > 1) && (
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
              total={Number(listData?.totalPages)}
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
        )} */}
      </div>

      {/* **************************************************** */}
      <SendCargoModal
        isOpen={isOpen}
        onOpen={openSendCargoModal}
        onClose={closeSendCargoModal}
      />
      {/* **************************************************** */}
      <TransportCargoModal
        isOpen={showTransportModal}
        onOpen={openTransportCargoModal}
        onClose={closeTransportCargoModal}
      />
      {/* **************************************************** */}
      <CargoDetailsModal
        isOpen={showDetailsModal}
        onOpen={openShowDetailsModal}
        onClose={closeShowDetailsModal}
        loadingDetails={deliveryDetailsMutation?.isPending}
        {...selectedShipment}
      />
      {/* **************************************************** */}
      <PayToAccessModal
        isOpen={showPaymentModal}
        onOpen={openPaymentModal}
        onClose={closePaymentModal}
      />
      {/* **************************************************** */}
    </div>
  );
}

export default Home;
