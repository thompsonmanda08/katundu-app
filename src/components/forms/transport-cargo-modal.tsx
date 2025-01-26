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
import { Transaction, Transporter, User } from "@/lib/types";
import { StatusBox } from "../elements";
import { CargoDetailsForm } from "./send-cargo-form";
import useCustomTabsHook from "@/hooks/use-custom-tabs";
import useMainStore from "@/context/main-store";
import { containerVariants } from "@/lib/constants";

import { AnimatePresence, motion } from "framer-motion";
import { TransportCargoForm } from "./transport-cargo-form";

type CargoProps = {
  isOpen: boolean;
  onOpen: (open: boolean) => void;
  onClose: () => void;
};

export default function TransportCargoModal({
  isOpen,
  onOpen,
  onClose,
}: CargoProps) {
  const [isCompleteTransaction, setIsCompleteTransaction] =
    React.useState(false);
  const [isPromptSent, setIsPromptSent] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [transaction, setTransaction] = React.useState<Partial<Transaction>>({
    status: "PENDING",
    message: "Transaction Pending Approval",
  });
  const { transportCargoFormData, updateTransportCargoFormData } = useMainStore(
    (state) => state
  );
  const { currentTabIndex, activeTab, isFirstTab, isLastTab, navigateForward } =
    useCustomTabsHook([<TransportCargoForm key={"form"} />]);

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

    // const response = await createNewDelivery(formData);

    // if (response?.success) {
    //   notify({
    //     title: "Success",
    //     description: "Transaction completed!",
    //     variant: "success",
    //   });

    //   //TODO: CONNECT WEBHOOK HERE TO LISTEN TO MNO
    //   setTransaction(response?.data?.transaction);
    //   const transactionID = response?.data?.transaction?.id;

    // } else {
    //   notify({
    //     title: "Error",
    //     description: String(response?.message),
    //     variant: "danger",
    //   });
    //   return;
    // }

    setIsPromptSent(true);
    setIsLoading(false);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      size="full"
      classNames={{
        base: "rounded-b-none -mb-2 sm:-mb-4 pb-4",
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            Transport a Package
          </ModalHeader>
          <ModalBody>
            <AnimatePresence mode="wait">
              <motion.div
                variants={containerVariants}
                key={currentTabIndex}
                initial={"initial"}
                animate={"animate"}
                exit={"exit"}
                className=""
              >
                {isPromptSent ? (
                  <>
                    <StatusBox
                      status={transaction?.status || "PENDING"}
                      title={
                        transaction?.status == "SUCCESS"
                          ? "Shipment Created Successfully!"
                          : transaction?.status == "FAILED"
                          ? "Shipment creation failed!"
                          : "Transaction Pending Approval"
                      }
                      description={
                        transaction?.status == "SUCCESS"
                          ? "You shipment has been created, transporters will now be able to see it and contact you."
                          : transaction?.status == "FAILED"
                          ? String(transaction?.message)
                          : "Transaction Pending Approval"
                      }
                      onPress={handleCloseModal}
                    />
                  </>
                ) : (
                  activeTab
                )}
              </motion.div>
            </AnimatePresence>
          </ModalBody>
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
        </>
      </ModalContent>
    </Modal>
  );
}
