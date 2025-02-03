"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Divider,
  useDisclosure,
} from "@heroui/react";
import { NavIconButton } from "../elements";
import useCustomTabsHook from "@/hooks/use-custom-tabs";
import { containerVariants } from "@/lib/constants";
import { ShipmentRecord } from "@/lib/types";
import {} from "@heroui/react";
import { ArrowLeftIcon, ArrowRightIcon, Trash2Icon } from "lucide-react";

import { Button } from "../ui/button";
import { cn, formatDate, notify } from "@/lib/utils";
import useMainStore from "@/context/main-store";
import Loader from "../ui/loader";

import { AnimatePresence, motion } from "framer-motion";
import PayToAccessModal from "./pay-to-access-modal";
import PromptModal from "../elements/prompt-modal";
import {
  deleteDelivery,
  pickUpDelivery,
} from "@/app/_actions/delivery-actions";

type CargoProps = Partial<ShipmentRecord> & {
  isOpen: boolean;
  isDataLoaded?: boolean;
  loadingDetails?: boolean;
  onOpen: (open: boolean) => void;
  onClose: () => void;
  src?: string;
};

export default function CargoDetailsModal({
  isOpen,
  onOpen,
  onClose,
  isDataLoaded,
  loadingDetails,
  src,
  ...props
}: CargoProps) {
  const { user, setSelectedShipment, selectedShipment } = useMainStore(
    (state) => state
  );

  const [isDelete, setIsDelete] = React.useState(false);
  const [isPickUp, setIsPickUp] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const toggleDelete = () => setIsDelete(!isDelete);
  const togglePickUp = () => setIsPickUp(!isPickUp);

  const {
    isOpen: showPaymentModal,
    onOpen: openPaymentModal,
    onClose: closePaymentModal,
  } = useDisclosure();

  function handleCloseModal() {
    setSelectedShipment(null);
    onClose();
  }

  async function handlePickupDelivery() {
    if (!isPickUp) {
      togglePickUp();
      return;
    }

    setIsLoading(true);

    const response = await pickUpDelivery(String(selectedShipment?.id));

    if (response?.success) {
      notify({
        title: "Success!",
        description: "Shipment picked up successfully!",
      });
    } else {
      notify({
        title: "Pick up Failed!",
        description: `${response?.message} - Reload and try again!`,
      });
    }

    setIsLoading(false);
    setIsPickUp(false);
  }
  async function handleDeleteDelivery() {
    if (!isDelete) {
      toggleDelete();
      return;
    }

    setDeleteLoading(true);

    const response = await deleteDelivery(String(selectedShipment?.id));

    if (response?.success) {
      notify({
        title: "Deleted!",
        description: "Shipment deleted successfully!",
        variant: "success",
      });
    } else {
      notify({
        title: "Delete Failed!",
        description: `${response?.message} - Reload and try again!`,
        variant: "danger",
      });
    }

    setDeleteLoading(false);
    setIsDelete(false);
  }

  // console.log("selectedShipment", selectedShipment);
  // console.log("CONTACTS", props?.contacts);

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
          <ModalHeader className="flex items-center gap-2">
            <NavIconButton onClick={handleCloseModal}>
              <ArrowLeftIcon className="h-5 w-5"></ArrowLeftIcon>
            </NavIconButton>
            <small>Shipment Details</small>
          </ModalHeader>
          <ModalBody className="items-center p-0">
            <Card className="flex flex-col border border-default-100/20 p-2 shadow-none">
              <CardHeader className="flex-row justify-between py-1 text-sm font-semibold">
                Shipment Route
                <div className="flex flex-row items-center gap-2 text-sm">
                  <Skeleton
                    className="max-w-max rounded-lg capitalize"
                    isLoaded={!isDataLoaded}
                  >
                    <Chip variant="flat" size="sm" color="primary">
                      {props?.pickUpCity}
                    </Chip>
                  </Skeleton>

                  <ArrowRightIcon className="h-4 w-4 text-primary-400" />

                  <Skeleton
                    className="max-w-max rounded-lg capitalize"
                    isLoaded={!isDataLoaded}
                  >
                    <Chip color="success" size="sm" variant="flat">
                      {props?.deliveryCity || props?.deliveryLocation}
                    </Chip>
                  </Skeleton>
                </div>
              </CardHeader>
              <CardBody className="flex-row gap-4 py-2">
                <div className="aspect-square w-16 overflow-clip">
                  <Skeleton className="rounded-lg" isLoaded={!isDataLoaded}>
                    <Image
                      alt="Cargo Image"
                      className="h-full w-full rounded-lg object-cover"
                      src={src || "/images/fallback.svg"}
                    />
                  </Skeleton>
                </div>
                <div className="flex flex-1 justify-between gap-2">
                  <div
                    className={cn(
                      "flex flex-col text-sm max-w-[185px] sm:max-w-max",
                      {
                        "gap-2": isDataLoaded,
                      }
                    )}
                  >
                    <Skeleton
                      className="max-w-max rounded-lg"
                      isLoaded={!isDataLoaded}
                    >
                      <p>{props?.cargoDescription}</p>
                    </Skeleton>

                    <Skeleton
                      className="w-60 rounded-lg"
                      isLoaded={!isDataLoaded}
                    >
                      <small className="text-xs text-foreground/60">
                        {props?.transportDate
                          ? formatDate(props?.transportDate)
                          : formatDate(new Date().toISOString())}
                      </small>
                    </Skeleton>
                    <Skeleton
                      className="w-40 rounded-lg capitalize"
                      isLoaded={!isDataLoaded}
                    >
                      <div className="">
                        {props?.isPublished || user?.role == "TRANSPORTER" ? (
                          <span className="flex items-center gap-1 text-xs font-medium">
                            Delivery Status:{" "}
                            <Chip
                              color={
                                props?.deliveryStatus == "DELIVERED"
                                  ? "success"
                                  : props?.deliveryStatus == "IN TRANSIT"
                                  ? "warning"
                                  : props?.deliveryStatus == "CANCELLED"
                                  ? "danger"
                                  : "warning"
                              }
                              size="sm"
                              // variant="flat"
                              classNames={{
                                base: "bg-opacity-30 text-opacity-80",
                                content: "text-xs font-semibold",
                              }}
                            >
                              {props?.deliveryStatus?.toLowerCase() ||
                                "READY".toLowerCase()}
                            </Chip>
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            radius="sm"
                            onPress={openPaymentModal}
                            className="h-6 text-xs"
                          >
                            Publish
                          </Button>
                        )}
                      </div>
                    </Skeleton>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-xs">
                    <Skeleton
                      className="w-20 rounded-lg"
                      isLoaded={!isDataLoaded}
                    >
                      <p className="text-right">{props?.packaging}</p>
                    </Skeleton>
                    <Skeleton
                      className="w-20 rounded-lg"
                      isLoaded={!isDataLoaded}
                    >
                      <p className="text-right">
                        <span>{props?.containerSize}</span>
                        <span> {props?.cargoMeasure}</span>
                      </p>
                    </Skeleton>

                    <span>ETA</span>
                  </div>
                </div>
              </CardBody>
              <Divider className="my-2 bg-slate-100" />
              <CardFooter className={cn("flex-col p-0")}>
                <AnimatePresence>
                  <motion.div
                    variants={containerVariants}
                    // key={currentTabIndex}
                    initial="hidden"
                    animate="visible"
                    exit={"hidden"}
                    className={cn("flex flex-col w-full")}
                  >
                    {/* DETAILS */}
                    <div className="flex w-full flex-col">
                      <CargoDetails
                        key={"cargo-details"}
                        loadingDetails={loadingDetails}
                        {...props}
                      />
                    </div>

                    {/* CONTACT DETAILS */}

                    {!props?.contacts && user?.role === "TRANSPORTER" && (
                      <Button
                        size="md"
                        className="mt-2 text-sm"
                        onPress={openPaymentModal}
                      >
                        Pay To See Contacts
                      </Button>
                    )}

                    {props?.contacts && user?.role == "TRANSPORTER" && (
                      <Button
                        size="sm"
                        radius="sm"
                        onPress={handlePickupDelivery}
                        className="mt-2 text-sm"
                      >
                        Pick up Delivery
                      </Button>
                    )}

                    {/* ONLY SENDERS CAN DELETE */}
                    {user?.role === "SENDER" && (
                      <Button
                        startContent={<Trash2Icon className={cn("h-4 w-4 ")} />}
                        onPress={handleDeleteDelivery}
                        isDisabled={isDataLoaded || isLoading || deleteLoading}
                        isLoading={deleteLoading}
                        size="sm"
                        radius="sm"
                        color="danger"
                        className="mt- text-sm"
                      >
                        Delete
                      </Button>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* **************************************************** */}
                <PayToAccessModal
                  isOpen={showPaymentModal}
                  onOpen={openPaymentModal}
                  onClose={closePaymentModal}
                  {...props}
                />
                {/* **************************************************** */}

                <PromptModal
                  isOpen={isDelete}
                  placement="center"
                  isLoading={deleteLoading || isLoading}
                  title={
                    isDelete
                      ? "Delete Shipment"
                      : isPickUp
                      ? " Pick Up Delivery"
                      : ""
                  }
                  onConfirm={handleDeleteDelivery}
                >
                  <p>
                    Are you sure you want to{" "}
                    {isDelete ? "delete" : isPickUp ? " pick up" : ""} this
                    shipment?
                  </p>
                </PromptModal>
              </CardFooter>
            </Card>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
}

export function CargoDetails({
  loadingDetails,
  ...props
}: Partial<CargoProps>) {
  const { user } = useMainStore((state) => state);
  const userHasAccess =
    props?.contacts && (props?.contacts?.sender || props?.contacts?.receiver);

  return (
    <Table hideHeader removeWrapper aria-label="Katundu specifications data">
      <TableHeader>
        <TableColumn>KEY</TableColumn>
        <TableColumn>VALUE</TableColumn>
      </TableHeader>
      <TableBody
        isLoading={loadingDetails}
        loadingContent={
          <div className="flex w-full flex-1 flex-col overflow-clip rounded-xl">
            <Skeleton className="flex w-full flex-1">
              <Loader loadingText="Getting details..." />{" "}
            </Skeleton>
          </div>
        }
      >
        <TableRow key="pickup-city">
          <TableCell>Pick-up City </TableCell>
          <TableCell className="text-right font-bold capitalize">
            {`${props?.pickUpCity}`}
          </TableCell>
        </TableRow>

        <TableRow key="pickup-location">
          <TableCell>Pick-up Location </TableCell>
          <TableCell className="text-right font-bold capitalize">
            {`${props?.pickUpLocation}`}
          </TableCell>
        </TableRow>

        <TableRow key="delivery-city">
          <TableCell>Delivery City </TableCell>
          <TableCell className="text-right font-bold capitalize">
            {`${props?.deliveryCity}`}
          </TableCell>
        </TableRow>
        <TableRow key="delivery-location">
          <TableCell>Drop off Location </TableCell>
          <TableCell className="text-right font-bold capitalize">
            {`${props?.deliveryLocation}`}
          </TableCell>
        </TableRow>
        <TableRow key="cargo-size-measure">
          <TableCell>Cargo Size (Measurement) </TableCell>
          <TableCell className="text-right font-bold capitalize">
            {`${props?.containerSize} ${props?.cargoMeasure}`}
          </TableCell>
        </TableRow>

        {/* SENDER & TRANSPORTER DETAILS */}
        {user?.role == "TRANSPORTER" ? (
          <>
            <TableRow key="shipper-name">
              <TableCell>Shipper Name</TableCell>
              {/* TODO: IF USER HAS PAID */}
              {userHasAccess ? (
                <TableCell className="text-right font-bold capitalize">
                  {`${props?.contacts?.sender?.firstName} ${props?.contacts?.sender?.lastName}`}
                </TableCell>
              ) : (
                <TableCell className="text-right font-bold capitalize">
                  <span className="overflow-clip blur-sm">
                    Pay4This Katundu
                  </span>
                </TableCell>
              )}
            </TableRow>

            <TableRow key="shipper-phone">
              <TableCell>Shipper Mobile Number </TableCell>
              {userHasAccess ? (
                <TableCell className="text-right font-bold capitalize">
                  {`${props?.contacts?.sender?.phone}`}
                </TableCell>
              ) : (
                <TableCell className="text-right font-bold capitalize">
                  <span className="overflow-clip blur-sm">
                    Pay4This Katundu
                  </span>
                </TableCell>
              )}
            </TableRow>

            <TableRow key="receiver-name">
              <TableCell>Receiver Name</TableCell>
              {/* TODO: IF USER HAS PAID */}
              {userHasAccess ? (
                <TableCell className="text-right font-bold capitalize">
                  {`${props?.contacts?.receiver?.firstName} ${props?.contacts?.receiver?.lastName}`}
                </TableCell>
              ) : (
                <TableCell className="text-right font-bold capitalize">
                  <span className="overflow-clip blur-sm">
                    Pay4This Katundu
                  </span>
                </TableCell>
              )}
            </TableRow>

            <TableRow key="receiver-phone">
              <TableCell>Receiver Mobile Number </TableCell>
              {userHasAccess ? (
                <TableCell className="text-right font-bold capitalize">
                  {`${props?.contacts?.receiver?.phone}`}
                </TableCell>
              ) : (
                <TableCell className="text-right font-bold capitalize">
                  <span className="overflow-clip blur-sm">
                    Pay4This Katundu
                  </span>
                </TableCell>
              )}
            </TableRow>
          </>
        ) : (
          <>
            <TableRow key="transporter-name">
              <TableCell>Transporter Name </TableCell>
              <TableCell className="text-right font-bold capitalize">
                {`${props?.transporterName || "N/A"}`}
              </TableCell>
            </TableRow>
            <TableRow key="transporter-phone">
              <TableCell>Transporter Mobile Number </TableCell>
              <TableCell className="text-right font-bold capitalize">
                {`${props?.transporterContact || "N/A"}`}
              </TableCell>
            </TableRow>
          </>
        )}
      </TableBody>
    </Table>
  );
}
