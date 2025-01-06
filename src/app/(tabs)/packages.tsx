import { ShipmentCard } from "@/components/elements";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Image,
  Tab,
  Tabs,
} from "@nextui-org/react";
import {
  ActivityIcon,
  ArrowRightIcon,
  BoxIcon,
  PackageIcon,
} from "lucide-react";
import React from "react";

function Packages() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-4 p-4 w-full">
        <h3 className="font-semibold">My Packages</h3>
        <Tabs
          aria-label="Options"
          color="primary"
          variant="bordered"
          classNames={{
            tabList: "w-full",
          }}
        >
          <Tab
            key="photos"
            title={
              <div className="flex items-center space-x-2">
                <ActivityIcon />
                <span>Pending</span>
              </div>
            }
          />
          <Tab
            key="music"
            title={
              <div className="flex items-center space-x-2">
                <BoxIcon />
                <span>Delivered</span>
              </div>
            }
          />
          <Tab
            key="videos"
            title={
              <div className="flex items-center space-x-2">
                <PackageIcon />
                <span>All</span>
              </div>
            }
          />
        </Tabs>
        <Divider />
        <div className="flex flex-col gap-4 w-full">
          <ShipmentCard displayDetails />
        </div>
      </div>
    </div>
  );
}

export default Packages;
