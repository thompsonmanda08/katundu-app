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
import { APIResponse, ShipmentRecord } from "@/lib/types";
import {} from "@heroui/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LockKeyholeOpenIcon,
  PackageCheck,
  Trash2Icon,
} from "lucide-react";

import { Button } from "../ui/button";
import { cn, formatDate, notify } from "@/lib/utils";
import useMainStore from "@/context/main-store";
import Loader from "../ui/loader";

import { AnimatePresence, motion } from "framer-motion";
import PayToAccessModal from "./pay-to-access-modal";
import PromptModal from "../elements/prompt-modal";
import {
  cancelDelivery,
  deleteDelivery,
  pickUpDelivery,
} from "@/app/_actions/delivery-actions";
import { UseBaseMutationResult, useQueryClient } from "@tanstack/react-query";

type CargoProps = Partial<ShipmentRecord> & {
  isOpen: boolean;
  isDataLoaded?: boolean;
  loadingDetails?: boolean;
  onOpen: (open: boolean) => void;
  onClose: () => void;
  src?: string;
  detailsHandler?: UseBaseMutationResult<APIResponse, Error, string, unknown>;
};

export default function CargoDetailsModal({
  isOpen,
  onOpen,
  onClose,
  isDataLoaded,
  loadingDetails,
  detailsHandler,
  src,
}: CargoProps) {
  const { user, setSelectedShipment, selectedShipment } = useMainStore(
    (state) => state
  );

  const queryClient = useQueryClient();

  const [isDelete, setIsDelete] = React.useState(false);
  const [isPickUp, setIsPickUp] = React.useState(false);
  const [isCancel, setIsCancel] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const toggleDelete = () => setIsDelete(!isDelete);
  const togglePickUp = () => setIsPickUp(!isPickUp);
  const toggleCancel = () => setIsCancel(!isCancel);

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

      // REFETCH DETAILS
      detailsHandler?.mutateAsync(String(selectedShipment?.id));

      if (detailsHandler?.data?.success) {
        setSelectedShipment(detailsHandler?.data?.data?.delivery);
      }
    } else {
      notify({
        title: "Pick up Failed!",
        description: `${response?.message} - Reload and try again!`,
      });
    }

    setIsLoading(false);
    setIsPickUp(false);
  }

  async function handleCancelDelivery() {
    if (!isCancel) {
      toggleCancel();
      return;
    }

    setIsLoading(true);

    const response = await cancelDelivery(String(selectedShipment?.id));

    if (response?.success) {
      notify({
        title: "Success!",
        description: "Shipment picked up successfully!",
      });

      // REFETCH DETAILS
      detailsHandler?.mutateAsync(String(selectedShipment?.id));

      if (detailsHandler?.data?.success) {
        setSelectedShipment(detailsHandler?.data?.data?.delivery);
      }
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
      queryClient.invalidateQueries();
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

  console.log("selectedShipment", selectedShipment);
  // console.log("CONTACTS", selectedShipment?.contacts);

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
                      {selectedShipment?.pickUpCity}
                    </Chip>
                  </Skeleton>

                  <ArrowRightIcon className="h-4 w-4 text-primary-400" />

                  <Skeleton
                    className="max-w-max rounded-lg capitalize"
                    isLoaded={!isDataLoaded}
                  >
                    <Chip color="success" size="sm" variant="flat">
                      {selectedShipment?.deliveryCity ||
                        selectedShipment?.deliveryLocation}
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
                      <p>{selectedShipment?.cargoDescription}</p>
                    </Skeleton>

                    <Skeleton
                      className="w-60 rounded-lg"
                      isLoaded={!isDataLoaded}
                    >
                      <small className="text-xs text-foreground/60">
                        {selectedShipment?.transportDate
                          ? formatDate(selectedShipment?.transportDate)
                          : formatDate(new Date().toISOString())}
                      </small>
                    </Skeleton>
                    <Skeleton
                      className="w-40 rounded-lg capitalize"
                      isLoaded={!isDataLoaded}
                    >
                      <div className="">
                        {selectedShipment?.isPublished ||
                        user?.role == "TRANSPORTER" ? (
                          <span className="flex items-center gap-1 text-xs font-medium">
                            Delivery Status:{" "}
                            <Chip
                              color={
                                selectedShipment?.deliveryStatus == "DELIVERED"
                                  ? "success"
                                  : selectedShipment?.deliveryStatus ==
                                    "IN TRANSIT"
                                  ? "secondary"
                                  : selectedShipment?.deliveryStatus == "READY"
                                  ? "warning"
                                  : selectedShipment?.deliveryStatus ==
                                    "CANCELLED"
                                  ? "danger"
                                  : "default"
                              }
                              size="sm"
                              // variant="flat"
                              classNames={{
                                base: "bg-opacity-30 text-opacity-80",
                                content: "text-xs font-semibold",
                              }}
                            >
                              {selectedShipment?.deliveryStatus?.toLowerCase() ||
                                "LISTED".toLowerCase()}
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
                      <p className="text-right">
                        {selectedShipment?.packaging}
                      </p>
                    </Skeleton>
                    <Skeleton
                      className="w-20 rounded-lg"
                      isLoaded={!isDataLoaded}
                    >
                      <p className="text-right">
                        <span>{selectedShipment?.containerSize}</span>
                        <span> {selectedShipment?.cargoMeasure}</span>
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
                      />
                    </div>

                    {/* CONTACT DETAILS */}

                    {!selectedShipment?.contacts &&
                      user?.role === "TRANSPORTER" &&
                      selectedShipment?.isPublished && (
                        <Button
                          size="md"
                          className="mt-2 text-sm"
                          onPress={openPaymentModal}
                          isLoading={isLoading}
                          startContent={
                            <LockKeyholeOpenIcon className={cn("h-4 w-4 ")} />
                          }
                        >
                          See Contact Details
                        </Button>
                      )}

                    {user?.role == "TRANSPORTER" &&
                      selectedShipment?.contacts &&
                      !selectedShipment?.isPublished &&
                      String(selectedShipment?.deliveryStatus)?.toUpperCase() ==
                        "READY" && (
                        <Button
                          size="sm"
                          radius="sm"
                          onPress={handlePickupDelivery}
                          startContent={
                            <PackageCheck
                              className={cn(
                                "h-4 w-4 transition-all duration-200 ease-in-out"
                              )}
                            />
                          }
                          isLoading={isLoading}
                          loadingText="Picking up..."
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
                />
                {/* **************************************************** */}

                <PromptModal
                  isOpen={isDelete || isPickUp}
                  placement="center"
                  isLoading={deleteLoading || isLoading}
                  title={
                    isDelete
                      ? "Delete Shipment"
                      : isPickUp
                      ? " Pick Up Delivery"
                      : ""
                  }
                  onConfirm={
                    isDelete
                      ? handleDeleteDelivery
                      : isPickUp
                      ? handlePickupDelivery
                      : () => {}
                  }
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
  const { user, selectedShipment } = useMainStore((state) => state);
  const userHasAccess =
    selectedShipment?.contacts &&
    (selectedShipment?.contacts?.sender ||
      selectedShipment?.contacts?.receiver);

  return (
    <Table hideHeader removeWrapper aria-label="Katundu specifications data">
      <TableHeader>
        <TableColumn>KEY</TableColumn>
        <TableColumn>VALUE</TableColumn>
      </TableHeader>
      <TableBody
        isLoading={loadingDetails}
        loadingContent={
          <div className="flex h-full w-full flex-1 flex-col overflow-clip rounded-xl">
            <Skeleton className="flex h-full w-full flex-1">
              <Loader loadingText="Getting details..." />{" "}
            </Skeleton>
          </div>
        }
      >
        <TableRow key="pickup-city">
          <TableCell>Pick-up City </TableCell>
          <TableCell className="text-right font-bold capitalize">
            {`${selectedShipment?.pickUpCity}`}
          </TableCell>
        </TableRow>

        <TableRow key="pickup-location">
          <TableCell>Pick-up Location </TableCell>
          <TableCell className="text-right font-bold capitalize">
            {`${selectedShipment?.pickUpLocation}`}
          </TableCell>
        </TableRow>

        <TableRow key="delivery-city">
          <TableCell>Delivery City </TableCell>
          <TableCell className="text-right font-bold capitalize">
            {`${selectedShipment?.deliveryCity}`}
          </TableCell>
        </TableRow>
        <TableRow key="delivery-location">
          <TableCell>Drop off Location </TableCell>
          <TableCell className="text-right font-bold capitalize">
            {`${selectedShipment?.deliveryLocation}`}
          </TableCell>
        </TableRow>
        <TableRow key="cargo-size-measure">
          <TableCell>Cargo Size (Measurement) </TableCell>
          <TableCell className="text-right font-bold capitalize">
            {`${selectedShipment?.containerSize} ${selectedShipment?.cargoMeasure}`}
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
                  {`${selectedShipment?.contacts?.sender?.firstName} ${selectedShipment?.contacts?.sender?.lastName}`}
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
                  {`${selectedShipment?.contacts?.sender?.phone}`}
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
                  {`${selectedShipment?.contacts?.receiver?.name}`}
                </TableCell>
              ) : (
                <TableCell className="text-right font-bold capitalize">
                  <span className="overflow-clip blur-sm">
                    Pay4This Katundu
                  </span>
                </TableCell>
              )}
            </TableRow>

            <TableRow key="receiver-phone-1">
              <TableCell>Receiver Phone #1 </TableCell>
              {userHasAccess ? (
                <TableCell className="text-right font-bold capitalize">
                  {`${selectedShipment?.contacts?.receiver?.phoneOne}`}
                </TableCell>
              ) : (
                <TableCell className="text-right font-bold capitalize">
                  <span className="overflow-clip blur-sm">
                    Pay4This Katundu
                  </span>
                </TableCell>
              )}
            </TableRow>
            <TableRow key="receiver-phone-2">
              <TableCell>Receiver Phone #2 </TableCell>
              {userHasAccess ? (
                <TableCell className="text-right font-bold capitalize">
                  {`${selectedShipment?.contacts?.receiver?.phoneTwo}`}
                </TableCell>
              ) : (
                <TableCell className="text-right font-bold capitalize">
                  <span className="overflow-clip blur-sm">
                    Pay4This Katundu
                  </span>
                </TableCell>
              )}
            </TableRow>
            <TableRow key="receiver-address">
              <TableCell>Receiver Address</TableCell>
              {userHasAccess ? (
                <TableCell className="text-right font-bold capitalize">
                  {`${selectedShipment?.contacts?.receiver?.address}`}
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
                {`${selectedShipment?.transporterName || "N/A"}`}
              </TableCell>
            </TableRow>
            <TableRow key="transporter-phone">
              <TableCell>Transporter Mobile Number </TableCell>
              <TableCell className="text-right font-bold capitalize">
                {`${selectedShipment?.transporterContact || "N/A"}`}
              </TableCell>
            </TableRow>
          </>
        )}
      </TableBody>
    </Table>
  );
}
