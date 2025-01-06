"use client";
import { ShipmentCard } from "@/components/elements";
import { TransportCargoForm, SendCargoForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Image,
  Link,
  useDisclosure,
} from "@nextui-org/react";
import { ArrowRightIcon, CarIcon, Plus } from "lucide-react";
import React from "react";

function Home() {
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
  // TODO: Use Zustand to manage state - Create Forms

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col px-4 w-full">
        <h3 className="font-semibold">What would you like to do?</h3>
        <p className="leading-6 text-xs text-foreground/50 mb-2">
          You can either send or transport cargo between locations
        </p>
        <Divider />
      </div>
      <div className="flex gap-4 h-40 w-full px-5 items-center ">
        <Button
          variant="bordered"
          color="primary"
          className="flex-col h-auto p-4 flex-1 border bg-primary-50/20"
          onPress={openSendCargoModal}
        >
          <div className="max-w-32 sm:max-w-40 aspect-video  overflow-clip">
            <Image
              alt="Cargo Image"
              className="w-full h-full object-contain rounded-lg"
              src={"/images/sender.svg"}
            />
          </div>
          {/* <CarIcon className="w-12 h-12 text-foreground" /> */}
          Send Cargo
        </Button>
        <Button
          variant="bordered"
          color="primary"
          className="flex-col h-auto p-4 flex-1 border bg-primary-50/20"
          onPress={openTransportCargoModal}
        >
          <div className="max-w-32 sm:max-w-40 aspect-video overflow-clip">
            <Image
              alt="Cargo Image"
              className="w-full h-full object-contain rounded-lg"
              src={"/images/transporter.svg"}
            />
          </div>
          Transport Cargo
        </Button>
      </div>
      {/* ************************************************************* */}
      <SendCargoForm
        isOpen={isOpen}
        onOpen={openSendCargoModal}
        onClose={closeSendCargoModal}
        user={{}}
        isLoading={false}
        handleSave={function (): void {
          throw new Error("Function not implemented.");
        }}
        handleClose={function () {
          closeSendCargoModal();
        }}
      />
      {/* ************************************************************* */}
      <TransportCargoForm
        isOpen={showTransportModal}
        onOpen={openSendCargoModal}
        onClose={closeTransportCargoModal}
        user={{}}
        isLoading={false}
        handleSave={function (): void {
          throw new Error("Function not implemented.");
        }}
        handleClose={function () {
          closeTransportCargoModal();
        }}
      />
      {/* ************************************************************* */}

      <div className="flex flex-col gap-4 p-4 w-full">
        <h3 className="font-semibold">Recent Activity</h3>
        <Divider />
        <div className="flex flex-col gap-4 w-full">
          <ShipmentCard />
        </div>
      </div>
    </div>
  );
}

export default Home;
