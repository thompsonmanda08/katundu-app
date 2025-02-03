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
import { useQueryClient } from "@tanstack/react-query";

type CardProps = Partial<ShipmentRecord> & {
  src?: string;
  displayDetails?: boolean;
  isDataLoaded?: boolean;
  loadingDetails?: boolean;
  handleViewDetails?: () => Promise<APIResponse>;
  handleOpenDetailsModal?: () => void;
  handlePublish?: () => void;
};

function ShipmentCard({
  src,
  displayDetails = false,
  isDataLoaded,
  loadingDetails,
  handlePublish,
  handleViewDetails,
  handleOpenDetailsModal,
  ...props
}: CardProps) {
  const queryClient = useQueryClient();
  const [showMore, setShowMore] = React.useState(false);
  const toggleShowMore = () => setShowMore(!showMore);
  const [isLoading, setIsLoading] = React.useState(false);

  const { user } = useMainStore((state) => state);

  const hasMoreInfo = Boolean(props?.containerSize);

  async function handlePickupDelivery() {
    if (user?.role === "TRANSPORTER") {
      notify({
        title: "Transporter Action",
        description: "You are a transporter, you can't pick up a cargo",
      });
      return;
    }

    setIsLoading(true);

    const response = await pickUpDelivery(String(props?.id));

    if (response?.success) {
      queryClient.invalidateQueries();
      notify({
        title: "Success",
        description: "Successfully picked up the cargo",
      });
    } else {
      notify({
        title: "Error",
        description: response?.message,
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
                "min-w-16 h-6": isDataLoaded,
              })}
              isLoaded={!isDataLoaded}
            >
              <Chip variant="flat" size="sm" color="primary">
                {props?.pickUpCity}
              </Chip>
            </Skeleton>

            <ArrowRightIcon className="h-4 w-4 text-primary-400" />

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
        </div>
      </CardHeader>
      <CardBody className="flex-row gap-2 overflow-hidden py-2 sm:gap-4">
        <div className="aspect-square w-full min-w-12 max-w-16 overflow-clip">
          <Skeleton className="rounded-lg" isLoaded={!isDataLoaded}>
            <Image
              alt="Cargo Image"
              className="h-full w-full rounded-lg object-cover"
              src={src || "/images/fallback.svg"}
            />
          </Skeleton>
        </div>
        <div className="flex justify-between gap-2">
          <div
            className={cn("flex flex-col text-sm max-w-[180px] sm:max-w-max", {
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
                    onPress={handlePublish}
                    className="h-6 text-xs"
                  >
                    Publish
                  </Button>
                )}
              </div>
            </Skeleton>
          </div>
          <div className="flex flex-col items-end gap-2 text-xs">
            {!isDataLoaded && (
              <div className="flex flex-col items-end justify-end text-right">
                <span>{props?.packaging}</span>
                <div>
                  <span>{props?.containerSize}</span>
                  <span> {props?.cargoMeasure}</span>
                </div>
              </div>
            )}

            {!isDataLoaded && (
              <>
                {user?.role === "TRANSPORTER" && !props?.hasPaid ? (
                  <Button
                    startContent={
                      <LockKeyholeOpen
                        className={cn(
                          "h-4 w-4 transition-all duration-200 ease-in-out"
                        )}
                      />
                    }
                    onPress={handleOpenDetailsModal}
                    variant="light"
                    size="sm"
                    className="-mt-2 bg-transparent p-0 text-xs data-[hover=true]:bg-transparent"
                  >
                    Access
                  </Button>
                ) : user?.role === "TRANSPORTER" && props?.hasPaid ? (
                  <Button
                    startContent={
                      <PackageCheck
                        className={cn(
                          "h-4 w-4 transition-all duration-200 ease-in-out"
                        )}
                      />
                    }
                    // TODO:
                    onPress={handlePickupDelivery}
                    // variant="light"
                    size="sm"
                    className="-mt-2 bg-transparent p-0 text-xs data-[hover=true]:bg-transparent"
                  >
                    Pickup Delivery
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
                      <TableRow key="cargo-details-btn">
                        <TableCell>Display Full Details</TableCell>
                        <TableCell className="text-right font-bold capitalize">
                          <NavIconButton onClick={handleOpenDetailsModal}>
                            <SquareArrowOutUpRight className="h-4 w-4"></SquareArrowOutUpRight>
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
