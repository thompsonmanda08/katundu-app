"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Link,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  Tab,
  Divider,
} from "@heroui/react";
import { Transaction, Transporter, User } from "@/lib/types";
import { NavIconButton, StatusBox } from "../elements";
import { CargoDetailsForm } from "./send-cargo-form";
import useCustomTabsHook from "@/hooks/use-custom-tabs";
import { containerVariants } from "@/lib/constants";
import { APIResponse, ShipmentRecord } from "@/lib/types";
import {} from "@heroui/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Box,
  Car,
  ChevronDown,
  ChevronUp,
  UserIcon,
  Users,
} from "lucide-react";

import { Button } from "../ui/button";
import { slideDownInView } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import useMainStore from "@/context/main-store";
import { useMutation } from "@tanstack/react-query";
import { useAvailableDeliveries } from "@/hooks/use-query-data";
import Loader from "../ui/loader";

import { AnimatePresence, motion } from "framer-motion";
import { TransportCargoForm } from "./transport-cargo-form";

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
  const {
    currentTabIndex,
    activeTab,
    isFirstTab,
    isLastTab,
    navigateForward,
    navigateTo,
  } = useCustomTabsHook([
    <CargoDetails
      key={"cargo-details"}
      loadingDetails={loadingDetails}
      {...props}
    />,
    // <SenderDetails
    //   key={"cargo-details"}
    //   loadingDetails={loadingDetails}
    //   {...props}
    // />,
  ]);

  function handleCloseModal() {
    setSelectedShipment(null);
    onClose();
  }

  async function handleProceed() {
    if (!isLastTab) {
      navigateForward();
      return;
    }
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
          <ModalHeader className="flex items-center gap-2">
            <NavIconButton onClick={handleCloseModal}>
              <ArrowLeftIcon className="w-5 h-5"></ArrowLeftIcon>
            </NavIconButton>
            <small>Shipment Details</small>
          </ModalHeader>
          <ModalBody className="items-center p-0 ">
            <Card className="flex flex-col shadow-none border border-default-100/20 p-2">
              <CardHeader className="flex-row justify-between py-1">
                Shipment Route
                <div className="flex flex-row items-center text-sm gap-2">
                  <Skeleton
                    className=" max-w-max rounded-lg capitalize"
                    isLoaded={!isDataLoaded}
                  >
                    <Chip variant="flat" size="sm" color="primary">
                      {props?.pickUpCity}
                    </Chip>
                  </Skeleton>

                  <ArrowRightIcon className="w-4 h-4 text-primary-400" />

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
                <div className="w-16 aspect-square overflow-clip ">
                  <Skeleton className="rounded-lg" isLoaded={!isDataLoaded}>
                    <Image
                      alt="Cargo Image"
                      className="w-full h-full object-cover rounded-lg"
                      src={src || "/images/fallback.svg"}
                    />
                  </Skeleton>
                </div>
                <div className="flex gap-2 justify-between flex-1">
                  <div
                    className={cn("flex flex-col text-sm", {
                      "gap-2": isDataLoaded,
                    })}
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
                          <span className="text-xs font-medium flex items-center gap-1">
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
                            onPress={() => {}}
                            className="h-6 text-xs"
                          >
                            Publish
                          </Button>
                        )}
                      </div>
                    </Skeleton>
                  </div>
                  <div className="flex flex-col gap-2 items-end text-xs">
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
              <Divider className="bg-slate-100 my-2" />
              <CardFooter className={cn("flex-col p-0")}>
                <AnimatePresence>
                  <motion.div
                    variants={containerVariants}
                    key={currentTabIndex}
                    initial="hidden"
                    animate="visible"
                    exit={"hidden"}
                    className={cn("flex flex-col w-full")}
                  >
                    {/* DETAILS */}
                    <div className="flex flex-col w-full">{activeTab}</div>

                    {props?.contacts && user?.role === "TRANSPORTER" && (
                      <Button size="md" className="text-sm">
                        Pay To See Contacts
                      </Button>
                    )}
                  </motion.div>
                </AnimatePresence>
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
          <>
            <Loader loadingText="Getting details..." />{" "}
          </>
        }
      >
        <TableRow key="pickup-city">
          <TableCell>Pick-up City </TableCell>
          <TableCell className="font-bold text-right capitalize ">
            {`${props?.pickUpCity}`}
          </TableCell>
        </TableRow>

        <TableRow key="pickup-location">
          <TableCell>Pick-up Location </TableCell>
          <TableCell className="font-bold text-right capitalize ">
            {`${props?.pickUpLocation}`}
          </TableCell>
        </TableRow>

        <TableRow key="delivery-city">
          <TableCell>Delivery City </TableCell>
          <TableCell className="font-bold text-right capitalize ">
            {`${props?.deliveryCity}`}
          </TableCell>
        </TableRow>
        <TableRow key="delivery-location">
          <TableCell>Drop off Location </TableCell>
          <TableCell className="font-bold text-right capitalize ">
            {`${props?.deliveryLocation}`}
          </TableCell>
        </TableRow>
        <TableRow key="cargo-size-measure">
          <TableCell>Cargo Size (Measurement) </TableCell>
          <TableCell className="font-bold text-right capitalize ">
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
                <TableCell className="font-bold text-right capitalize ">
                  {`${props?.contacts?.sender?.firstName} ${props?.contacts?.sender?.lastName}`}
                </TableCell>
              ) : (
                <TableCell className="font-bold text-right capitalize ">
                  <span className="blur-sm overflow-clip">
                    Pay4This Katundu
                  </span>
                </TableCell>
              )}
            </TableRow>

            <TableRow key="shipper-phone">
              <TableCell>Shipper Mobile Number </TableCell>
              {userHasAccess ? (
                <TableCell className="font-bold text-right capitalize ">
                  {`${props?.contacts?.sender?.phone}`}
                </TableCell>
              ) : (
                <TableCell className="font-bold text-right capitalize ">
                  <span className="blur-sm overflow-clip">
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
              <TableCell className="font-bold text-right capitalize">
                {`${props?.transporterName || "N/A"}`}
              </TableCell>
            </TableRow>
            <TableRow key="transporter-phone">
              <TableCell>Transporter Mobile Number </TableCell>
              <TableCell className="font-bold text-right capitalize ">
                {`${props?.transporterContact || "N/A"}`}
              </TableCell>
            </TableRow>
          </>
        )}
      </TableBody>
    </Table>
  );
}
