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
  getDeliveryDetails,
  pickUpDelivery,
} from "@/app/_actions/delivery-actions";
import {
  UseBaseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

type CargoProps = Partial<ShipmentRecord> & {
  isOpen: boolean;
  onOpen: (open: boolean) => void;
  onClose: () => void;
  deliveryId: string;
  setDeliveryId: React.Dispatch<React.SetStateAction<string>>;
};

export default function CargoDetailsModal({
  isOpen,
  onOpen,
  onClose,
  deliveryId,
  setDeliveryId,
}: CargoProps) {
  const { user } = useMainStore((state) => state);

  const queryClient = useQueryClient();

  const deliveryDetails = useMutation({
    mutationFn: (ID: string) => getDeliveryDetails(ID),
  });

  const selectedShipment = deliveryDetails?.data?.data?.delivery;

  const isLoadingDetails = Boolean(
    !selectedShipment || deliveryDetails.isPending
  );

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
    setDeliveryId("");
    onClose();
    return;
  }
  
  function handleClosePrompts() {
    setIsDelete(false);
    setIsPickUp(false);
    setIsCancel(false);

    setIsLoading(false);
    setDeleteLoading(false);
    return;
  }

  async function handlePickupDelivery() {
    if (!isPickUp) {
      togglePickUp();
      return;
    }

    setIsLoading(true);

    const response = await pickUpDelivery(String(deliveryId));

    if (response?.success) {
      notify({
        title: "Success!",
        description: "Shipment picked up successfully!",
      });

      // REFETCH DETAILS
      deliveryDetails?.mutateAsync(String(deliveryId));
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

    const response = await cancelDelivery(String(deliveryId));

    if (response?.success) {
      notify({
        title: "Success!",
        description: "Shipment picked up successfully!",
      });

      // REFETCH DETAILS
      deliveryDetails?.mutateAsync(String(deliveryId));
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

    const response = await deleteDelivery(String(deliveryId));

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

  async function showDetails(ID: string) {
    await deliveryDetails.mutateAsync(String(ID));
  }

  React.useEffect(() => {
    if (!deliveryId) {
      handleCloseModal();
      return;
    }

    showDetails(deliveryId);

    return () => {
      handleCloseModal();
    };
  }, [deliveryId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      size="full"
      backdrop="blur"
      classNames={{
        base: "overflow-y-auto max-h-[820px] max-w-2xl",
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
          <ModalBody className="w-full flex-1 items-center overflow-y-auto p-0">
            <Card className="flex w-full flex-col border border-default-100/20 p-2 shadow-none">
              <CardHeader className="flex-row justify-between py-1 text-sm font-semibold">
                Shipment Route
                <div className="flex max-w-[50%] flex-row items-center gap-2 text-sm">
                  <Skeleton
                    className="min-w-14 max-w-max rounded-lg capitalize"
                    isLoaded={!isLoadingDetails}
                  >
                    <Chip variant="flat" size="sm" color="primary">
                      {selectedShipment?.pickUpCity}
                    </Chip>
                  </Skeleton>

                  <ArrowRightIcon className="h-4 w-4 text-primary-400" />

                  <Skeleton
                    className="min-w-14 max-w-max rounded-lg capitalize"
                    isLoaded={!isLoadingDetails}
                  >
                    <Chip color="success" size="sm" variant="flat">
                      {selectedShipment?.deliveryCity}
                    </Chip>
                  </Skeleton>
                </div>
              </CardHeader>
              <CardBody className="flex-1 flex-col overflow-y-auto">
                <div className="flex flex-row gap-2 py-2">
                  <div className="aspect-square w-16 overflow-clip">
                    <Skeleton
                      className="rounded-lg"
                      isLoaded={!isLoadingDetails}
                    >
                      <Image
                        alt="Cargo Image"
                        className="h-full w-full rounded-lg object-cover"
                        src={selectedShipment?.src || "/images/fallback.svg"}
                      />
                    </Skeleton>
                  </div>
                  <div className="flex flex-1 justify-between gap-2">
                    <div
                      className={cn(
                        "flex flex-col text-sm max-w-[185px] sm:max-w-max",
                        {
                          "gap-1": isLoadingDetails,
                        }
                      )}
                    >
                      <Skeleton
                        className="max-w-max rounded-lg"
                        isLoaded={!isLoadingDetails}
                      >
                        <p>{selectedShipment?.cargoDescription}</p>
                      </Skeleton>

                      <Skeleton
                        className="min-w-32 max-w-max rounded-lg"
                        isLoaded={!isLoadingDetails}
                      >
                        <small className="text-xs text-foreground/60">
                          {selectedShipment?.transportDate
                            ? formatDate(selectedShipment?.transportDate)
                            : formatDate(new Date().toISOString())}
                        </small>
                      </Skeleton>
                      <Skeleton
                        className="w-40 rounded-lg capitalize"
                        isLoaded={!isLoadingDetails}
                      >
                        <div className="">
                          {selectedShipment?.isPublished ||
                          user?.role == "TRANSPORTER" ? (
                            <span className="flex items-center gap-1 text-xs font-medium">
                              Status:{" "}
                              <Chip
                                color={
                                  selectedShipment?.deliveryStatus ==
                                  "DELIVERED"
                                    ? "success"
                                    : selectedShipment?.deliveryStatus ==
                                      "IN TRANSIT"
                                    ? "secondary"
                                    : selectedShipment?.deliveryStatus ==
                                      "READY"
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
                                  "Published".toLowerCase()}
                              </Chip>
                            </span>
                          ) : (
                            <Chip
                              color={"default"}
                              size="sm"
                              // variant="flat"
                              classNames={{
                                base: "bg-opacity-30 text-opacity-80",
                                content: "text-xs font-semibold",
                              }}
                            >
                              {selectedShipment?.deliveryStatus?.toLowerCase() ||
                                // true ? "Published".toLowerCase() :
                                "Not Published".toLowerCase()}
                            </Chip>
                          )}
                        </div>
                      </Skeleton>
                    </div>
                    <div className="flex flex-col items-end justify-end gap-2 text-right text-xs">
                      <Skeleton
                        className="w-20 rounded-lg"
                        isLoaded={!isLoadingDetails}
                      >
                        <p className="text-right">
                          {selectedShipment?.packaging}
                        </p>
                      </Skeleton>
                      <Skeleton
                        className="w-20 rounded-lg"
                        isLoaded={!isLoadingDetails}
                      >
                        <p className="text-right">
                          <span>{selectedShipment?.containerSize}</span>
                          <span> {selectedShipment?.cargoMeasure}</span>
                        </p>
                      </Skeleton>

                      {!isLoadingDetails && (
                        <span>Qty: {selectedShipment?.quantity}</span>
                      )}
                    </div>
                  </div>
                </div>

                <Divider className="my-2 bg-slate-100" />
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
                        isLoading={isLoadingDetails}
                        selectedShipment={selectedShipment}
                      />
                    </div>

                    {/* TRANSPORTER ACTION - PAY TO SEE CONTACT */}
                    {user?.role === "TRANSPORTER" &&
                      selectedShipment?.isPublished &&
                      !selectedShipment?.contacts && (
                        <Button
                          size="md"
                          className="mt-2 text-sm"
                          onPress={openPaymentModal}
                          isLoading={isLoading}
                          startContent={
                            <LockKeyholeOpenIcon className={cn("h-4 w-4 ")} />
                          }
                        >
                          Access Contact Details
                        </Button>
                      )}

                    {/* TRANSPORTER ACTION - PICK UP */}
                    {user?.role == "TRANSPORTER" &&
                      selectedShipment?.contacts && (
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

                    {/* SENDER ACTION - PUBLISH */}
                    {user?.role == "SENDER" &&
                      !isLoadingDetails &&
                      !selectedShipment?.isPublished && (
                        <Button
                          size="md"
                          radius="sm"
                          onPress={openPaymentModal}
                          className="my-1 text-sm"
                        >
                          Publish
                        </Button>
                      )}

                    {/* SENDER ACTION - DELETE */}
                    {user?.role === "SENDER" && !isLoadingDetails && (
                      <Button
                        startContent={<Trash2Icon className={cn("h-4 w-4 ")} />}
                        onPress={handleDeleteDelivery}
                        isDisabled={
                          isLoadingDetails || isLoading || deleteLoading
                        }
                        isLoading={deleteLoading}
                        size="md"
                        radius="sm"
                        color="danger"
                        className="my-1 text-sm"
                      >
                        Delete
                      </Button>
                    )}
                  </motion.div>
                </AnimatePresence>
              </CardBody>
              <CardFooter className={cn("flex-col p-0")}>
                {/* **************************************************** */}
                <PayToAccessModal
                  isOpen={showPaymentModal}
                  onOpen={openPaymentModal}
                  onClose={closePaymentModal}
                />
                {/* **************************************************** */}

                <PromptModal
                  isOpen={isDelete || isPickUp}
                  onClose={handleClosePrompts}
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
  isLoading = false,
  selectedShipment,
}: Partial<CargoProps> & {
  isLoading: boolean;
  selectedShipment: Partial<ShipmentRecord>;
}) {
  const { user } = useMainStore((state) => state);
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
        isLoading={isLoading}
        loadingContent={
          <div className="flex h-full w-full flex-1 flex-col overflow-clip rounded-xl">
            <Skeleton className="flex h-full w-full flex-1"></Skeleton>
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
        <TableRow key="quantity">
          <TableCell>Quantity </TableCell>
          <TableCell className="text-right font-bold capitalize">
            {`${selectedShipment?.quantity} ${selectedShipment?.packaging}`}
          </TableCell>
        </TableRow>
        <TableRow key="date">
          <TableCell>Transport Date </TableCell>
          <TableCell className="text-right font-bold capitalize">
            {`${formatDate(new Date(Number(selectedShipment?.transportDate)))}`}
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
