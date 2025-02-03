import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
} from "@heroui/modal";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type PromptModalProps = ModalProps & {
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  hideActionButtons?: boolean;
  hideTitle?: boolean;
};

function PromptModal({
  size = "sm",
  isOpen,
  onClose,
  onConfirm,
  title = "Prompt",
  cancelText = "Cancel",
  confirmText = "Confirm",
  isDisabled,
  isLoading,
  isDismissable = false,
  hideActionButtons,
  hideTitle,
  children,
  ...props
}: PromptModalProps) {
  return (
    <Modal
      size={size}
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={isDismissable}
      className={""}
      {...props}
    >
      <ModalContent>
        <>
          {!hideTitle && (
            <ModalHeader className="font-bold tracking-tight xl:text-base">
              {title}
            </ModalHeader>
          )}
          <ModalBody className={cn("gap-0", {})}>{children}</ModalBody>
          {!hideActionButtons && (
            <ModalFooter>
              <Button
                color="danger"
                isDisabled={isDisabled || isLoading}
                onPress={onClose}
              >
                {cancelText}
              </Button>
              <Button
                color="primary"
                isDisabled={isDisabled}
                isLoading={isLoading}
                onPress={onConfirm}
              >
                {confirmText}
              </Button>
            </ModalFooter>
          )}
        </>
      </ModalContent>
    </Modal>
  );
}

export default PromptModal;
