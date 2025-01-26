import { APIResponse, ShipmentRecord } from "@/lib/types";
import {
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
} from "@heroui/react";
import {
  ArrowRightIcon,
  ChevronDown,
  ChevronUp,
  SquareArrowOutUpRight,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { slideDownInView } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import useMainStore from "@/context/main-store";
import { useMutation } from "@tanstack/react-query";
import { useAvailableDeliveries } from "@/hooks/use-query-data";
import Loader from "../ui/loader";
import NavIconButton from "./nav-icon-button";

type CardProps = Partial<ShipmentRecord> & {
  src?: string;
  displayDetails?: boolean;
  isDataLoaded?: boolean;
  loadingDetails?: boolean;
  handleViewDetails?: () => Promise<APIResponse>;
  handleOpenDetailsModal?: () => void;
};

function ShipmentCard({
  src,
  displayDetails = false,
  isDataLoaded,
  loadingDetails,
  handleViewDetails,
  handleOpenDetailsModal,
  ...props
}: CardProps) {
  const [showMore, setShowMore] = React.useState(false);
  const toggleShowMore = () => setShowMore(!showMore);

  const { user } = useMainStore((state) => state);

  const userHasAccess =
    props?.contacts && (props?.contacts?.sender || props?.contacts?.receiver);

  return (
    <Card className="flex flex-col shadow-none border border-default-100/80 p-2 ">
      <CardHeader className="flex-row justify-between py-1">
        <h4 className="font-semibold text-sm">Shipment Information</h4>{" "}
        <div className="flex gap-2 items-center">
          <div className="flex flex-row items-center text-sm gap-2">
            <Skeleton
              className={cn("max-w-max rounded-lg  capitalize", {
                "min-w-16 h-6": isDataLoaded,
              })}
              isLoaded={!isDataLoaded}
            >
              <Chip variant="flat" size="sm" color="primary">
                {props?.pickUpCity}
              </Chip>
            </Skeleton>

            <ArrowRightIcon className="w-4 h-4 text-primary-400" />

            <Skeleton
              className={cn("max-w-max rounded-lg  capitalize", {
                "min-w-16 h-6": isDataLoaded,
              })}
              isLoaded={!isDataLoaded}
            >
              <Chip color="success" size="sm" variant="flat">
                {props?.deliveryCity || props?.deliveryLocation}
              </Chip>
            </Skeleton>
          </div>
          <NavIconButton onClick={handleOpenDetailsModal}>
            <SquareArrowOutUpRight className="w-4 h-4"></SquareArrowOutUpRight>
          </NavIconButton>
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
            <Skeleton className="max-w-max rounded-lg" isLoaded={!isDataLoaded}>
              <p>{props?.cargoDescription}</p>
            </Skeleton>

            <Skeleton className="w-60 rounded-lg" isLoaded={!isDataLoaded}>
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
                    onPress={toggleShowMore}
                    className="h-6 text-xs"
                  >
                    Publish
                  </Button>
                )}
              </div>
            </Skeleton>
          </div>
          <div className="flex flex-col gap-2 items-end text-xs">
            <Skeleton className="w-20 rounded-lg" isLoaded={!isDataLoaded}>
              <p className="text-right">{props?.packaging}</p>
            </Skeleton>
            <Skeleton className="w-20 rounded-lg" isLoaded={!isDataLoaded}>
              <p className="text-right">
                <span>{props?.containerSize}</span>
                <span> {props?.cargoMeasure}</span>
              </p>
            </Skeleton>

            {!isDataLoaded && ( // HIDE ON LOADING
              <>
                {displayDetails && !showMore ? (
                  <Button
                    variant="light"
                    size="sm"
                    onPress={() => {
                      toggleShowMore();
                      handleViewDetails!();
                    }}
                    className="p-0 bg-transparent data-[hover=true]:bg-transparent text-xs"
                  >
                    View Details
                  </Button>
                ) : (
                  <span>ETA</span>
                )}
              </>
            )}
          </div>
        </div>
      </CardBody>
      <CardFooter
        className={cn("flex-col", {
          "p-0": !showMore,
        })}
      >
        {displayDetails && (
          <AnimatePresence>
            {showMore && (
              <motion.div
                variants={slideDownInView}
                initial="hidden"
                animate="visible"
                exit={"hidden"}
                className={cn("flex flex-col w-full", {
                  "": showMore,
                })}
              >
                {/* DETAILS */}
                <div className="flex flex-col w-full">
                  <h3 className="text-primary-900/80 dark:font-bold dark:tracking-wide font-semibold dark:bg-primary/20 bg-default-50/50 text-sm rounded-md px-4 py-2 -mt-2 mb-2">
                    Shipment Record Details
                  </h3>
                  <Table
                    hideHeader
                    removeWrapper
                    aria-label="Katundu specifications data"
                  >
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
                    </TableBody>
                  </Table>
                </div>

                <Button
                  variant="light"
                  endContent={<ChevronUp className="h-6 w-6" />}
                  onPress={toggleShowMore}
                  size="sm"
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent text-xs"
                >
                  Show less
                </Button>

                {props?.contacts && user?.role === "TRANSPORTER" && (
                  <Button size="md" className="text-sm mt-2">
                    Pay To See Contacts
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShipmentCard;
