import { APIResponse, ShipmentRecord } from "@/lib/types";
import {
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
} from "@heroui/react";
import {
  ArrowRightIcon,
  ChevronDown,
  LockKeyholeOpen,
  PackageCheck,
  SquareArrowOutUpRight,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { slideDownInView } from "@/lib/constants";
import { cn, formatDate, notify } from "@/lib/utils";
import useMainStore from "@/context/main-store";
import NavIconButton from "./nav-icon-button";
import { pickUpDelivery } from "@/app/_actions/delivery-actions";
import { UseBaseMutationResult, useQueryClient } from "@tanstack/react-query";

type CardProps = Partial<ShipmentRecord> & {
  src?: string;
  displayDetails?: boolean;
  isDataLoading?: boolean;
  loadingDetails?: boolean;
  handleViewDetails?: () => Promise<APIResponse>;
  handleOpenDetailsModal?: () => void;
  handlePublish?: () => void;

  mutationHandler?: UseBaseMutationResult<APIResponse, Error, string, unknown>;
};

function ShipmentCard({
  src,
  displayDetails = false,
  isDataLoading,
  loadingDetails,
  handlePublish,
  handleViewDetails,
  handleOpenDetailsModal,
  mutationHandler,
  ...props
}: CardProps) {
  const queryClient = useQueryClient();
  const [showMore, setShowMore] = React.useState(false);
  const toggleShowMore = () => setShowMore(!showMore);
  const [isLoading, setIsLoading] = React.useState(false);

  const { user } = useMainStore((state) => state);

  const hasMoreInfo = Boolean(props?.containerSize);

  async function handlePickupDelivery() {
    if (user?.role === "SENDER") {
      notify({
        title: "Transporter Action",
        description: "You are a sender, you can't pick up a cargo",
      });
      return;
    }

    setIsLoading(true);

    const response = await pickUpDelivery(String(props?.id));

    if (response?.success) {
      notify({
        title: "Success",
        description: "Successfully picked up the cargo",
      });

      queryClient.invalidateQueries();
    } else {
      notify({
        title: "Error",
        description: response?.message,
        variant: "danger",
      });
    }

    setIsLoading(false);
  }

  return (
    <Card className="flex flex-col border border-default-100/80 p-2 shadow-none">
      <CardHeader className="flex-row justify-between py-1">
        <h4 className="text-xs font-semibold sm:text-sm">Shipment Route</h4>{" "}
        <div className="flex items-center">
          <div className="flex flex-row items-center gap-2 text-sm">
            <Skeleton
              className={cn("max-w-max rounded-lg  capitalize", {
                "min-w-16 h-6": isDataLoading,
              })}
              isLoaded={!isDataLoading}
            >
              <Chip variant="flat" size="sm" color="primary">
                {props?.pickUpCity}
              </Chip>
            </Skeleton>

            <ArrowRightIcon className="h-4 w-4 text-primary-400" />

            <Skeleton
              className={cn("max-w-max rounded-lg  capitalize", {
                "min-w-16 h-6": isDataLoading,
              })}
              isLoaded={!isDataLoading}
            >
              <Chip color="success" size="sm" variant="flat">
                {props?.deliveryCity || props?.deliveryLocation}
              </Chip>
            </Skeleton>
          </div>
        </div>
      </CardHeader>
      <CardBody className="grid grid-cols-4 gap-2 overflow-hidden py-2">
        <div className="col-span-1 aspect-square w-full flex-1 overflow-clip">
          <Skeleton className="rounded-lg" isLoaded={!isDataLoading}>
            <Image
              alt="Cargo Image"
              className="w-full rounded-lg object-cover"
              src={src || "/images/fallback.svg"}
            />
          </Skeleton>
        </div>
        <div className="col-span-3 grid w-full grid-cols-4 justify-between">
          <div
            className={cn(
              "flex flex-col col-span-3 gap-1 text-sm w-full flex-[1.5] ",
              {
                "gap-2": isDataLoading,
              }
            )}
          >
            <Skeleton
              className="max-w-max rounded-lg"
              isLoaded={!isDataLoading}
            >
              <p>{props?.cargoDescription}</p>
            </Skeleton>

            <Skeleton
              className="w-60 max-w-40 rounded-lg"
              isLoaded={!isDataLoading}
            >
              <small className="text-xs text-foreground/60">
                {props?.transportDate
                  ? formatDate(props?.transportDate)
                  : formatDate(new Date().toISOString())}
              </small>
            </Skeleton>
            {!isDataLoading && (
              <div className="">
                {props?.isPublished || user?.role == "TRANSPORTER" ? (
                  <span className="flex items-center gap-1 text-xs font-medium">
                    Delivery Status:{" "}
                    <Chip
                      color={
                        props?.deliveryStatus == "DELIVERED"
                          ? "success"
                          : props?.deliveryStatus == "IN TRANSIT"
                          ? "secondary"
                          : props?.deliveryStatus == "READY"
                          ? "warning"
                          : props?.deliveryStatus == "CANCELLED"
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
                      {props?.deliveryStatus?.toLowerCase() ||
                        "LISTED".toLowerCase()}
                    </Chip>
                  </span>
                ) : (
                  <Button
                    size="md"
                    radius="sm"
                    onPress={handlePublish}
                    className="h-8 text-sm"
                  >
                    Publish
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* FAR RIGHT */}
          <div className={cn("flex flex-col text-right gap-2 text-sm flex-1")}>
            <Skeleton
              className="w-16 max-w-20 rounded-lg"
              isLoaded={!isDataLoading}
            >
              <div className="flex flex-col gap-1 text-right">
                <p>{props?.packaging}</p>
                <p>
                  <span>{props?.containerSize}</span>
                  <span> {props?.cargoMeasure}</span>
                </p>
                <p>Qty: {props?.quantity}</p>
              </div>
            </Skeleton>

            {!isDataLoading && (
              <>
                {user?.role === "TRANSPORTER" && props?.hasPaid ? (
                  <Button
                    startContent={
                      <PackageCheck
                        className={cn(
                          "h-4 w-4 transition-all duration-200 ease-in-out"
                        )}
                      />
                    }
                    onPress={handlePickupDelivery}
                    // variant="light"
                    isLoading={isLoading}
                    size="sm"
                    className="-mt-1 text-xs"
                  >
                    Pick Up
                  </Button>
                ) : user?.role === "TRANSPORTER" && !props?.hasPaid ? (
                  <Button
                    startContent={
                      <LockKeyholeOpen
                        className={cn(
                          "h-4 w-4 transition-all duration-200 ease-in-out"
                        )}
                      />
                    }
                    onPress={handleOpenDetailsModal}
                    isLoading={loadingDetails}
                    variant="light"
                    size="sm"
                    className="-mt-2 bg-transparent p-0 text-xs data-[hover=true]:bg-transparent"
                  >
                    Access
                  </Button>
                ) : null}
              </>
            )}
          </div>
        </div>
      </CardBody>
      <CardFooter
        className={cn("flex-col -mt-1", {
          "p-0 ": !showMore,
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
                <div className="flex w-full flex-col">
                  <div className="flex items-center justify-between rounded-md bg-default-50/50 px-4 py-2 text-sm font-semibold text-primary-900/80 dark:bg-primary/20 dark:font-bold dark:tracking-wide">
                    <span>Shipment Record Details</span>
                  </div>
                  <Table
                    hideHeader
                    removeWrapper
                    aria-label="Katundu specifications data"
                  >
                    <TableHeader>
                      <TableColumn>KEY</TableColumn>
                      <TableColumn>VALUE</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow key="cargo-size-measure">
                        <TableCell>Cargo Size (Measurement) </TableCell>
                        <TableCell className="text-right font-bold capitalize">
                          {`${props?.containerSize} ${props?.cargoMeasure}`}
                        </TableCell>
                      </TableRow>
                      <TableRow key="quantity">
                        <TableCell>Quantity </TableCell>
                        <TableCell className="text-right font-bold capitalize">
                          {`${props?.quantity} ${props?.packaging}`}
                        </TableCell>
                      </TableRow>
                      <TableRow key="date">
                        <TableCell>Transport Date </TableCell>
                        <TableCell className="text-right font-bold capitalize">
                          {`${formatDate(
                            new Date(Number(props?.transportDate))
                          )}`}
                        </TableCell>
                      </TableRow>
                      <TableRow key="cargo-details-btn">
                        <TableCell>Display Full Details</TableCell>
                        <TableCell className="text-right font-bold capitalize">
                          <NavIconButton
                            isLoading={loadingDetails}
                            onClick={handleOpenDetailsModal}
                          >
                            <SquareArrowOutUpRight className="h-4 w-4" />
                          </NavIconButton>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* SEE MORE DETAILS */}
        {displayDetails && hasMoreInfo && (
          <Button
            variant="light"
            endContent={
              <ChevronDown
                className={cn(
                  "h-6 w-6 transition-all duration-200 ease-in-out",
                  {
                    "-rotate-180": showMore,
                  }
                )}
              />
            }
            onPress={toggleShowMore}
            size="sm"
            radius="sm"
            className="w-full p-0 text-xs"
          >
            {!showMore ? "See more" : "Show less"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShipmentCard;
