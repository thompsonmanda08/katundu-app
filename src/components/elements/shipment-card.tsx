import { ShipmentRecord } from "@/lib/types";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { ArrowRightIcon, ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { slideDownInView } from "@/lib/constants";
import { cn } from "@/lib/utils";

type CardProps = Partial<ShipmentRecord> & {
  src?: string;
  displayDetails?: boolean;
};

function ShipmentCard({ src, displayDetails = false }: CardProps) {
  const [showMore, setShowMore] = React.useState(false);
  const toggleShowMore = () => setShowMore(!showMore);

  const chipColor = {
    isDelivered: "success",
    isPending: "warning",
    isCancelled: "error",
  };
  return (
    <Card className="flex flex-col shadow-none border border-default-100/80 p-2">
      <CardHeader className="flex-row justify-between">
        <h4 className="font-semibold text-sm">Shipment Information</h4>
        <div className="flex flex-row items-center text-sm gap-2">
          <Chip variant="flat" size="sm" color="primary">
            Lusaka
          </Chip>
          <ArrowRightIcon className="w-4 h-4 text-primary-400" />
          <Chip color="success" size="sm" variant="flat">
            Solwezi
          </Chip>
        </div>
      </CardHeader>
      <CardBody className="flex-row gap-4">
        <div className="w-16 aspect-square overflow-clip">
          <Image
            alt="Cargo Image"
            className="w-full h-full object-cover rounded-lg"
            src={src || "/images/fallback.svg"}
          />
        </div>
        <div className="flex gap-2 justify-between flex-1">
          <div className="flex flex-col gap-1 text-sm">
            <p>Package Name</p>
            <p>Package Description</p>
            <p>Transport Date</p>
          </div>
          <div className="flex flex-col gap-2 items-end text-xs">
            <p>Package Size</p>
            <p>Package Type</p>

            {displayDetails && !showMore ? (
              <Button
                variant="light"
                size="sm"
                onPress={toggleShowMore}
                className="p-0 bg-transparent data-[hover=true]:bg-transparent text-xs"
              >
                View Details
              </Button>
            ) : (
              <span>ETA</span>
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
                    <TableBody>
                      <TableRow key="shipper-name">
                        <TableCell>Shipper Name</TableCell>
                        <TableCell className="font-bold  text-right ">
                          John Bwalya
                        </TableCell>
                      </TableRow>
                      <TableRow key="shipper-phone">
                        <TableCell>Shipper Mobile Number </TableCell>
                        <TableCell className="font-bold  text-right ">
                          +260977556633
                        </TableCell>
                      </TableRow>
                      <TableRow key="pickup-location">
                        <TableCell>Pick-up Location </TableCell>
                        <TableCell className="font-bold  text-right ">
                          John Bwalya
                        </TableCell>
                      </TableRow>
                      <TableRow key="delivery-location">
                        <TableCell>Delivery Location </TableCell>
                        <TableCell className="font-bold  text-right ">
                          John Bwalya
                        </TableCell>
                      </TableRow>
                      <TableRow key="cargo-size-measure">
                        <TableCell>Cargo Size(Measure) </TableCell>
                        <TableCell className="font-bold  text-right ">
                          John Bwalya
                        </TableCell>
                      </TableRow>
                      <TableRow key="transporter-name">
                        <TableCell>Transporter Name </TableCell>
                        <TableCell className="font-bold  text-right ">
                          Bob Mwale
                        </TableCell>
                      </TableRow>
                      <TableRow key="transporter-phone">
                        <TableCell>Transporter Mobile Number </TableCell>
                        <TableCell className="font-bold  text-right ">
                          Bob Mwale
                        </TableCell>
                      </TableRow>

                      <TableRow key="delivery-status">
                        <TableCell>Delivery Status</TableCell>
                        <TableCell className="font-bold  text-right ">
                          <Chip color="success" variant="flat" size="sm">
                            Delivered
                          </Chip>
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
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShipmentCard;
