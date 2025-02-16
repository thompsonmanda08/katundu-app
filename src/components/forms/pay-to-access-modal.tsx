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
  APIResponse,
  Delivery,
  PaymentDetails,
  Transaction,
} from "@/lib/types";
import { PaymentDetailsForm } from "./send-cargo-form";
import { StatusBox } from "../elements";
import useMainStore from "@/context/main-store";
import { containerVariants } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { notify } from "@/lib/utils";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { BASE_URL } from "@/lib/api-config";
import {
  payToSeeContacts,
  publishCargoListing,
} from "@/app/_actions/delivery-actions";
import { useQueryClient } from "@tanstack/react-query";

type CargoProps = {
  title?: string;
  isOpen: boolean;
  onOpen: (open: boolean) => void;
  onClose: () => void;
  deliveryId?: string;
  setDeliveryId?: React.Dispatch<React.SetStateAction<string>>;
  handleRefetch?: () => void;
};

export default function PayToAccessModal({
  title,
  isOpen,
  onOpen,
  onClose,
  deliveryId,
  setDeliveryId,
  handleRefetch,
}: CargoProps) {
  const queryClient = useQueryClient();
  const socketRef = React.useRef<any>(null);

  const [isCompleteTransaction, setIsCompleteTransaction] =
    React.useState(false);

  const [isPromptSent, setIsPromptSent] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [transactionId, setTransactionId] = React.useState("");
  const [transactionStatus, setTransactionStatus] = React.useState("PENDING");
  const [dismissText, setDismissText] = React.useState("");
  const [count, setCount] = React.useState(30);

  const [transaction, setTransaction] = React.useState<Partial<Transaction>>({
    status: "PENDING",
    message: "Transaction Pending Approval",
  });

  const { sendCargoFormData, selectedShipment, user } = useMainStore(
    (state) => state
  );

  function handleCloseModal() {
    setIsCompleteTransaction(false);
    setIsPromptSent(false);
    setIsLoading(false);
    onClose();
  }

  async function handleProceed() {
    setIsLoading(true);

    // PAY TO SEE CONTACT DETAILS
    const paymentDetails: PaymentDetails = {
      phone: sendCargoFormData?.paymentPhone || String(user?.phone),
      amount: "1.00", // TODO: ALLOW AMOUNT TO BE SET FROM THE BACKEND
      // reference: sendCargoFormData?.reference,
    };

    // FOR PAYMENT TO PUBLISH
    const formData: Partial<Delivery> = {
      paymentDetails: paymentDetails,
    };

    let response = {} as APIResponse;

    if (user?.role === "TRANSPORTER") {
      response = await payToSeeContacts(paymentDetails, String(deliveryId));
    } else if (user?.role === "SENDER") {
      response = await publishCargoListing(paymentDetails, String(deliveryId));
    }

    if (response?.success) {
      const transactionID = response?.data?.transactionId;

      if (!transactionID) {
        console.error("Transaction ID is required");
        notify({
          title: "Failed",
          description: `Transaction ID is required`,
          variant: "danger",
        });
        setIsLoading(false);
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

      notify({
        title: "Success",
        description: `Prompt sent to ${formData?.paymentDetails?.phone}`,
        variant: "success",
      });
    } else {
      notify({
        title: "Error",
        description: String(response?.message),
        variant: "danger",
      });
    }

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
        setTransaction((prev) => ({ ...prev, ...response }));

        queryClient.invalidateQueries();
        handleRefetch?.();
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

  // Render a text after 45 seconds later if isPromptSent is true

  React.useEffect(() => {
    if (!isPromptSent) return;

    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(interval);
          // setIsDownToZero(true);
          setDismissText(
            "Transaction may have completed already. If yes, please refresh the page."
          );
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPromptSent]);

  return (
    <Modal
      key={"pay-to-access-modal"}
      isOpen={isOpen}
      onClose={handleCloseModal}
      backdrop="blur"
      placement="center"
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 font-bold">
            {title}
          </ModalHeader>
          <ModalBody>
            <AnimatePresence mode="wait">
              <motion.div
                variants={containerVariants}
                key={"currentTabIndex"}
                initial={"initial"}
                animate={"animate"}
                exit={"exit"}
                className="relative"
              >
                {isPromptSent ? (
                  <StatusBox
                    status={transactionStatus}
                    title={
                      transactionStatus == "SUCCESS"
                        ? "Shipment Created Successfully!"
                        : transactionStatus == "FAILED"
                        ? "Shipment creation failed!"
                        : "Offline Payment"
                    }
                    description={
                      transactionStatus == "SUCCESS"
                        ? "You shipment has been created, transporters will now be able to see it and contact you."
                        : transactionStatus == "FAILED"
                        ? `${transaction?.message} - Try reloading and try again.`
                        : "A confirmation prompt has been sent to your mobile phone number for approval. Complete the transaction and refresh the screen."
                    }
                    dismissText={dismissText}
                  />
                ) : (
                  <PaymentDetailsForm key="payment" />
                )}
              </motion.div>
            </AnimatePresence>
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
                Pay Now
              </Button>
            </ModalFooter>
          )}
        </>
      </ModalContent>
    </Modal>
  );
}
