"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import {
  Delivery,
  PaymentDetails,
  ShipmentRecord,
  Transaction,
} from "@/lib/types";
import {
  CargoDetailsForm,
  PaymentDetailsForm,
  ReceiverDetailsForm,
} from "./send-cargo-form";
import useCustomTabsHook from "@/hooks/use-custom-tabs";
import { NavIconButton, StatusBox } from "../elements";
import useMainStore from "@/context/main-store";
import { containerVariants } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn, notify } from "@/lib/utils";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { BASE_URL } from "@/lib/api-config";
import { createNewDelivery } from "@/app/_actions/delivery-actions";
import { useCities } from "@/hooks/use-query-data";
import { useQueryClient } from "@tanstack/react-query";
import { getLocalTimeZone, today } from "@internationalized/date";

type CargoProps = {
  isOpen: boolean;
  onOpen: (open: boolean) => void;
  onClose: () => void;
};

export default function SendCargoModal({
  isOpen,
  onOpen,
  onClose,
}: CargoProps) {
  const socketRef = React.useRef<any>(null);
  const { data: cities } = useCities();
  const [isCompleteTransaction, setIsCompleteTransaction] =
    React.useState(false);
  const [isPromptSent, setIsPromptSent] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [transactionId, setTransactionId] = React.useState("");
  const [transactionStatus, setTransactionStatus] = React.useState("PENDING");

  const [transaction, setTransaction] = React.useState<Partial<Transaction>>({
    status: "PENDING",
    message: "Transaction Pending Approval",
  });

  const queryClient = useQueryClient();

  const { sendCargoFormData, user } = useMainStore((state) => state);

  const {
    currentTabIndex,
    activeTab,
    isFirstTab,
    isLastTab,
    navigateForward,
    navigateBackwards,
  } = useCustomTabsHook([
    <CargoDetailsForm key={"form"} />,
    <ReceiverDetailsForm key="receiver" />,
    <PaymentDetailsForm key="payment" />,
  ]);

  function handleCloseModal() {
    setIsCompleteTransaction(false);
    setIsPromptSent(false);
    setIsLoading(false);
    onClose();
  }

  async function handleProceed() {
    setIsLoading(true);

    if (!isLastTab) {
      navigateForward();
      setIsLoading(false);
      return;
    }

    const formData: Delivery = {
      cargoDetails: {
        pickUpCity: sendCargoFormData?.pickUpCity,
        pickUpLocation: sendCargoFormData?.pickUpLocation,
        deliveryCity: sendCargoFormData?.deliveryCity,
        deliveryLocation: sendCargoFormData?.deliveryLocation,
        transportDate:
          sendCargoFormData?.transportDate ||
          today(getLocalTimeZone().toString()),
        cargoDescription: sendCargoFormData?.cargoDescription,
        cargoMeasure: sendCargoFormData?.cargoMeasure,
        packaging: sendCargoFormData?.packaging,
        containerSize: sendCargoFormData?.containerSize,
        receiverName: sendCargoFormData?.receiverName,
        receiverAddress: sendCargoFormData?.receiverAddress,
        receiverPhoneOne: sendCargoFormData?.receiverPhoneOne,
        receiverPhoneTwo: sendCargoFormData?.receiverPhoneTwo,
      } as ShipmentRecord,

      paymentDetails: {
        phone: sendCargoFormData?.paymentPhone || String(user?.phone),
        amount: "1.00", // TODO: ALLOW AMOUNT TO BE SET FROM THE BACKEND
        // reference: sendCargoFormData?.reference,
      } as PaymentDetails,
    };

    const response = await createNewDelivery(formData);

    if (response?.success) {
      notify({
        title: "Success",
        description: `Prompt sent to ${formData?.paymentDetails?.phone}`,
        variant: "success",
      });

      const transactionID = response?.data?.transactionId;

      if (!transactionID) {
        console.error("Transaction ID is required");
        return;
      }

      const transactionResponse = {
        ...response?.data?.status?.payment,
        transactionID,
      };

      setIsPromptSent(true);
      setTransaction(transactionResponse);
      setTransactionId(transactionID);
      runSocket(transactionID);
      setIsLoading(false);
      return;
    }

    notify({
      title: "Error",
      description: String(response?.message),
      variant: "danger",
    });

    setIsPromptSent(false);
    setIsLoading(false);
  }

  function runSocket(ID: string) {
    const transactionID = ID || transactionId;

    if (!Boolean(transactionID)) {
      console.info("Transaction ID is required");
      return;
    }

    if (!socketRef.current || !socketRef.current.connected) {
      console.error("Socket Client Connection Failed");
      return;
    }

    console.info("CONNECTING WITH ID: ", transactionID);
    socketRef.current.subscribe(
      `/notifications/transactions/${transactionID}`,

      // Handle the response - this will be called when a message is received
      (statusUpdate: any) => {
        const response = JSON.parse(statusUpdate?.body);
        console.info("SOCKET RESPONSE: ", response);
        setTransactionStatus(response.status?.toUpperCase());
        setIsCompleteTransaction(true);
        setTransaction((prev) => ({ ...prev, ...response }));
        queryClient.invalidateQueries();
      }
    );
  }

  React.useEffect(() => {
    // const socket = new SockJS(`https://api.katundutransport.com/api/v1/ws`);
    const socket = new SockJS(`${BASE_URL}/ws`);
    const stompClient = new Client({ webSocketFactory: () => socket });
    socketRef.current = stompClient;

    socketRef.current.onConnect = (frame: any) => {
      console.info("Connected: " + frame);
      runSocket(transactionId);
    };

    stompClient.activate();

    return () => {
      // Clean up the WebSocket connection when the component unmounts
      if (socketRef.current) {
        socketRef.current.deactivate();
      }
    };
    // WHEN TRANSACTION ID CHANGES, THE SOCKET WILL ACTIVATE
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      backdrop="blur"
      placement="bottom"
      isDismissable={false}
      classNames={{
        base: "rounded-b-none lg:rounded-b-xl sm:mb-0 lg:my-auto pb-4 min-h-[60svh] lg:min-h-max",
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            Send a Package
          </ModalHeader>
          <ModalBody className="p-0">
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  variants={containerVariants}
                  key={currentTabIndex}
                  initial={"initial"}
                  animate={"animate"}
                  exit={"exit"}
                  className="relative"
                >
                  {!isFirstTab && (
                    <div className="flex w-full items-center justify-between bg-red-500">
                      <NavIconButton
                        className={cn(
                          "absolute -bottom-14 left-2 border-foreground/10 max-w-40 max-h-10 aspect-video",
                          {
                            "bottom-0": isPromptSent,
                          }
                        )}
                        onClick={
                          isPromptSent
                            ? () => setIsPromptSent(false)
                            : navigateBackwards
                        }
                      >
                        <ArrowLeft className="mr-1 aspect-square w-6" /> Back
                      </NavIconButton>
                    </div>
                  )}
                  {isPromptSent ? (
                    <StatusBox
                      status={transactionStatus}
                      title={
                        transactionStatus == "SUCCESS"
                          ? "Shipment Created Successfully!"
                          : transactionStatus == "FAILED"
                          ? "Shipment creation failed!"
                          : "Transaction Pending Approval"
                      }
                      description={
                        transactionStatus == "SUCCESS"
                          ? "You shipment has been created, transporters will now be able to see it and contact you."
                          : transactionStatus == "FAILED"
                          ? `${transaction?.message} - Try reloading and try again.`
                          : "A payment confirmation prompt has been sent to your mobile phone number for approval."
                      }
                    />
                  ) : (
                    activeTab
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          </ModalBody>
          {!isPromptSent && (
            <ModalFooter>
              <Button
                color="danger"
                isDisabled={isLoading}
                onPress={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                isDisabled={isLoading}
                onPress={handleProceed}
              >
                {isLastTab ? "Create" : "Next"}
              </Button>
            </ModalFooter>
          )}
        </>
      </ModalContent>
    </Modal>
  );
}
