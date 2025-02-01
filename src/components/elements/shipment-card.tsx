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
  const [showMore, setShowMore] = React.useState(false);
  const toggleShowMore = () => setShowMore(!showMore);

  const { user } = useMainStore((state) => state);

  const userHasAccess =
    props?.contacts && (props?.contacts?.sender || props?.contacts?.receiver);

  return (
    <Card className="flex flex-col border border-default-100/80 p-2 shadow-none">
      <CardHeader className="flex-row justify-between py-1">
        <h4 className="text-sm font-semibold">Shipment Information</h4>{" "}
        <div className="flex items-center gap-2">
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
          <NavIconButton onClick={handleOpenDetailsModal}>
            <SquareArrowOutUpRight className="h-4 w-4"></SquareArrowOutUpRight>
          </NavIconButton>
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
                    className="bg-transparent p-0 text-xs data-[hover=true]:bg-transparent"
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
                <div className="flex w-full flex-col">
                  <h3 className="-mt-2 mb-2 rounded-md bg-default-50/50 px-4 py-2 text-sm font-semibold text-primary-900/80 dark:bg-primary/20 dark:font-bold dark:tracking-wide">
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
                        <Skeleton className="grid w-full flex-1 rounded-lg">
                          <Loader loadingText="Getting details..." />{" "}
                        </Skeleton>
                      }
                    >
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

                <Button
                  variant="light"
                  endContent={<ChevronUp className="h-6 w-6" />}
                  onPress={toggleShowMore}
                  size="sm"
                  className="bg-transparent p-0 text-xs data-[hover=true]:bg-transparent"
                >
                  Show less
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShipmentCard;
