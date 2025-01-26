"use client";
import { getDeliveryDetails } from "@/app/_actions/delivery-actions";
import { ShipmentCard } from "@/components/elements";
import {
  TransportCargoModal,
  SendCargoModal,
  CargoDetailsModal,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import useMainStore from "@/context/main-store";
import { useAccountProfile, useUserDeliveries } from "@/hooks/use-query-data";
import { ShipmentRecord, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Divider, Image, Skeleton, useDisclosure } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import React from "react";

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

  const { setSelectedShipment, selectedShipment } = useMainStore(
    (state) => state
  );

  //?? ONLY NEEDS TO FETCH AND SET COOKIE
  const { isLoading } = useAccountProfile();
  const { data: deliveriesResponse, isLoading: isLoaded } = useUserDeliveries(
    1,
    3
  );

  const mutation = useMutation({
    mutationFn: (ID: string) => getDeliveryDetails(ID),
  });

  const recentDeliveries = deliveriesResponse?.data
    ?.deliveries as Partial<ShipmentRecord>[];

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
    <div className="flex w-full flex-col gap-4">
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
        <Divider />
      </div>
      <div className="flex h-40 w-full items-center gap-4 px-5">
        <Button
          variant="bordered"
          color="primary"
          className="h-auto flex-1 flex-col border bg-primary-50/20 p-4"
          onPress={openSendCargoModal}
        >
          <div className="aspect-video max-w-32 overflow-clip sm:max-w-40">
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
          className="h-auto flex-1 flex-col border bg-primary-50/20 p-4"
          onPress={openTransportCargoModal}
        >
          <div className="aspect-video max-w-32 overflow-clip sm:max-w-40">
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
      <div className="flex w-full flex-col gap-4 p-4">
        <h3 className="font-semibold">Recent Shipments</h3>
        <Divider />
        <div className="flex w-full flex-col gap-4">
          {isLoaded
            ? Array.from({ length: 2 })?.map((_, index) => (
                <ShipmentCard key={index} isDataLoaded={isLoaded} />
              ))
            : recentDeliveries?.map((item) => (
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
      </div>

      {/* ************************************************************* */}
      <SendCargoModal
        isOpen={isOpen}
        onOpen={openSendCargoModal}
        onClose={closeSendCargoModal}
      />
      {/* ************************************************************* */}
      <TransportCargoModal
        isOpen={showTransportModal}
        onOpen={openSendCargoModal}
        onClose={closeTransportCargoModal}
      />
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

export default Home;
