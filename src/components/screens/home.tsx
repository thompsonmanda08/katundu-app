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
import {
  ButtonProps,
  Chip,
  Divider,
  Image,
  Skeleton,
  useDisclosure,
} from "@heroui/react";
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

      <div className="flex  items-center gap-4 px-5">
        <ActionButton
          title="Send Cargo"
          description="Send cargo between locations"
          src="/images/sender.svg"
          onPress={openSenderModal}
        />
        <ActionButton
          title="Transport Cargo"
          description="Transport cargo between locations"
          // icon={<Truck className="h-6 w-6 text-primary" />}
          src="/images/transporter.svg"
          onPress={openTransporterModal}
        />
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

import { Truck } from "lucide-react";

type ActionButtonProps = ButtonProps & {
  title: string;
  description: string;
  icon?: React.ReactNode;
  src?: string;
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  description,
  src,
  icon = <Truck className="h-6 w-6 text-primary" />,
  ...props
}) => {
  return (
    <Button
      className={cn(
        "flex flex-col w-full items-center justify-center gap-2 border-1 rounded-lg bg-white p-2 shadow-sm h-fit bg-transparent border-primary/20",
        props.className
      )}
      variant="bordered"
      color="primary"
      {...props}
    >
      {icon && !src ? (
        <div className="flex h-14 w-14 aspect-square col-span-1 items-center justify-center rounded-lg bg-primary/5">
          {icon}
        </div>
      ) : (
        <div className="flex h-20 w-20 aspect-square col-span-1 items-center justify-center rounded-lg bg-primary/5">
          <Image
            alt="Cargo Image"
            className="w-full rounded-lg object-cover"
            src={src || "/images/fallback.svg"}
          />
        </div>
      )}
      <div className="flex flex-col items-center col-span-4">
        <Chip
          color="primary"
          classNames={{
            base: "rounded-lg mb-1",
            content: "flex items-center gap-2 p-4 py-8",
          }}
        >
          {title}
        </Chip>
        {/* <h3 className="text-sm font-medium text-gray-900">{title}</h3> */}
        {/* <p className="text-xs font-normal text-foreground/60">{description}</p> */}
      </div>
    </Button>
  );
};
