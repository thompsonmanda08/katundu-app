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
import { NavIconButton } from "../elements";
import { containerVariants } from "@/lib/constants";

import { AnimatePresence, motion } from "framer-motion";
import { TransportCargoForm } from "./transport-cargo-form";
import { ArrowLeftIcon } from "lucide-react";

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
  function handleCloseModal() {
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      size="full"
      classNames={{
        base: "overflow-y-auto max-h-[820px] max-w-2xl",
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex gap-2">
            <NavIconButton onClick={handleCloseModal}>
              <ArrowLeftIcon className="h-5 w-5"></ArrowLeftIcon>
            </NavIconButton>
            Transport a Package
          </ModalHeader>
          <ModalBody className="overflow-y-auto overflow-x-clip">
            <AnimatePresence mode="wait">
              <motion.div
                variants={containerVariants}
                initial={"initial"}
                animate={"animate"}
                exit={"exit"}
                className=""
              >
                <TransportCargoForm />
              </motion.div>
            </AnimatePresence>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={handleCloseModal}>
              Close
            </Button>
            {/* <Button
              color="primary"
              isLoading={isLoading}
              isDisabled={isLoading}
              onPress={handleProceed}
            >
              {isLastTab ? "Create" : "Next"}
            </Button> */}
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
