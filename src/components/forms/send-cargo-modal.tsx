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
  Sender,
  ShipmentRecord,
  Transaction,
  User,
} from "@/lib/types";
import {
  CargoDetailsForm,
  PaymentDetailsForm,
  ReceiverDetailsForm,
} from "./send-cargo-form";
import useCustomTabsHook from "@/hooks/use-custom-tabs";
import { NavIconButton, StatusBox } from "../elements";
import useMainStore from "@/context/main-store";
import { containerVariants, QUERY_KEYS } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn, notify } from "@/lib/utils";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { BASE_URL } from "@/lib/api-config";
import { createNewDelivery } from "@/app/_actions/delivery-actions";
import { useCities } from "@/hooks/use-query-data";
import { useQueryClient } from "@tanstack/react-query";

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
  const [socketResponse, setSocketResponse] = React.useState(undefined);
  const [transaction, setTransaction] = React.useState<Partial<Transaction>>({
    status: "PENDING",
    message: "Transaction Pending Approval",
  });

  const queryClient = useQueryClient();

  const { sendCargoFormData, updateSendCargoFormData } = useMainStore(
    (state) => state
  );

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
        deliveryLocation: sendCargoFormData?.deliveryLocation,
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
        phone: sendCargoFormData?.paymentPhone,
        amount: "1.00",
        reference: sendCargoFormData?.paymentReference,
      } as PaymentDetails,
    };

    const response = await createNewDelivery(formData);

    if (response?.success) {
      notify({
        title: "Success",
        description: `Prompt sent to ${formData?.paymentDetails?.phone}`,
        variant: "success",
      });

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_POSTS] });

      //TODO: CONNECT WEBHOOK HERE TO LISTEN TO MNO
      const transactionID = response?.data?.transactionId;

      if (!transactionID) {
        console.error("Transaction ID is required");
        return;
      }

      console.log("TRANSACTION ID - ", transactionID);
      setTransaction(response?.data?.status);
      setIsPromptSent(true);
      runSocket(transactionID);
    } else {
      notify({
        title: "Error",
        description: String(response?.message),
        variant: "danger",
      });
      return;
    }

    // setIsPromptSent(true);
    setIsLoading(false);
  }

  function runSocket(ID: string) {
    const transactionID = ID || transaction?.id;

    if (!Boolean(transactionID)) {
      console.info("Transaction ID is required");
      return;
    }

    if (!socketRef.current || !socketRef.current.connected) {
      console.error("Socket Client Connection Failed");
      return;
    }

    socketRef.current.subscribe(
      `/notifications/transactions/${transactionID}`,

      // Handle the response - this will be called when a message is received
      (statusUpdate: any) => {
        const response = JSON.parse(statusUpdate?.body);
        console.info("SOCKET RESPONSE: ", response);
        setTransaction((prev) => ({ ...prev, ...response }));
        setIsCompleteTransaction(true);
      }
    );
  }

  // WHEN TRANSACTION ID CHANGES, THE SOCKET WILL ACTIVATE
  React.useEffect(() => {
    const socket = new SockJS(`${BASE_URL}/ws`);
    const stompClient = new Client({ webSocketFactory: () => socket });
    socketRef.current = stompClient;

    socketRef.current.onConnect = (frame: any) => {
      console.info("Connected: " + frame);
      runSocket(String(transaction?.id));
    };

    stompClient.activate();

    return () => {
      // Clean up the WebSocket connection when the component unmounts
      if (socketRef.current) {
        socketRef.current.deactivate();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      backdrop="blur"
      placement="bottom"
      classNames={{
        base: "rounded-b-none lg:rounded-b-xl sm:mb-0 lg:my-auto pb-4 min-h-[60svh] lg:min-h-max",
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            Send a Package
          </ModalHeader>
          <ModalBody>
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
                    <>
                      <StatusBox
                        status={transaction?.status?.toUpperCase() || "PENDING"}
                        title={
                          transaction?.status?.toUpperCase() == "SUCCESS"
                            ? "Shipment Created Successfully!"
                            : transaction?.status?.toUpperCase() == "FAILED"
                            ? "Shipment creation failed!"
                            : "Transaction Pending Approval"
                        }
                        description={
                          transaction?.status == "SUCCESS"
                            ? "You shipment has been created, transporters will now be able to see it and contact you."
                            : transaction?.status == "FAILED"
                            ? String(transaction?.message)
                            : "A payment confirmation prompt has been sent to your mobile phone number for approval."
                        }
                      />
                    </>
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
