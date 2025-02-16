"use client";
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
import { Chip, Divider, Image, Skeleton, useDisclosure } from "@heroui/react";
import React from "react";
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

  const { setSelectedShipment } = useMainStore((state) => state);

  const { data: userInfo } = useAccountProfile();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [size, setSize] = React.useState(2);

  const [selectedDeliveryId, setSelectedDeliveryId] =
    React.useState<string>("");

  const { data, isLoading: isLoaded } = useUserDeliveries(currentPage, size);

  const listData = data?.data;
  const recentDeliveries = listData?.deliveries as Partial<ShipmentRecord>[];

  async function showDetails(item: Partial<ShipmentRecord>) {
    openShowDetailsModal();
    setSelectedDeliveryId(item?.id as string);
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

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full flex-col px-4">
        <h2
          className={cn(
            "font-semibold capitalize text-foreground/80 md:text-xl -mb-2 flex items-center gap-1"
          )}
        >
          <span className="text-xl font-bold text-primary">Hello,</span>{" "}
          <Skeleton className="rounded-lg" isLoaded={Boolean(user?.firstName)}>
            {`${user?.firstName || "there!"}`}
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
        {user.role === "SENDER" ? (
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
            <Chip
              color="primary"
              classNames={{
                content: "flex items-center gap-2 p-4 py-8",
              }}
            >
              Send Katundu
            </Chip>
          </Button>
        ) : (
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

            <Chip
              color="primary"
              classNames={{
                content: "flex items-center gap-2 p-4 py-8",
              }}
            >
              Transport Katundu
            </Chip>
          </Button>
        )}
      </div>

      {/* ************ A LIST OF RECENT SHIPMENTS ********************* */}
      <div className="flex w-full flex-col gap-2 p-4">
        <h3 className="font-semibold">Recent Shipments</h3>
        <Divider className="mb-2" />
        <div className="flex w-full flex-col gap-4">
          {isLoaded ? (
            Array.from({ length: 2 })?.map((_, index) => (
              <ShipmentCard key={index} isDataLoading={isLoaded} />
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
                isDataLoading={isLoaded}
                handleOpenDetailsModal={() => showDetails(item)}
                handlePublish={() => handlePublish(item)}
                {...item}
              />
            ))
          )}
        </div>
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
        deliveryId={selectedDeliveryId}
        setDeliveryId={setSelectedDeliveryId}
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
