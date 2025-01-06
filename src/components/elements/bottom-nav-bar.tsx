"use client";
import { cn } from "@/lib/utils";
import { Tabs, Tab } from "@nextui-org/react";
import { HomeIcon, Package2, UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Key } from "react";
import { whileTabInView } from "@/lib/constants";

const TABS = [
  {
    key: 0 as Key,
    name: "Home",
    Icon: HomeIcon,
  },
  {
    key: 1 as Key,
    name: "Packages",
    Icon: Package2,
  },
  {
    key: 2 as Key,
    name: "Account",
    Icon: UserIcon,
  },
];

export default function BottomNavBar({
  selected,
  setSelected,
  classNames,
  className,
}: {
  selected: number | string;
  setSelected: (key: Key | number) => void;
  className?: string;
  classNames?: {
    wrapper?: string;
    tabs?: string;
    tab?: string;
    icon?: string;
    title?: string;
  };
}) {
  return (
    <div className={cn("flex w-full flex-col p-4", classNames?.wrapper)}>
      <Tabs
        aria-label="Bottom Menu Nav"
        color="primary"
        // variant="underlined"
        selectedKey={selected}
        onSelectionChange={setSelected}
        className={cn(className, classNames?.tabs)}
        classNames={{
          tabList:
            "p-4 w-full min-h-12 bg-background/80 backdrop-blur-sm shadow-lg shadow-gray-200 dark:shadow-gray-800",
          cursor: "w-full bg-primary/0",
          tab: "max-w-fitt px-0 h-12 relative",
          tabContent: "group-data-[selected=true]:text-primary",
        }}
      >
        {TABS.map((tab, index) => (
          <Tab
            key={index}
            title={
              <div
                className={cn(
                  "flex flex-col items-center gap-2 relative",
                  classNames?.tab
                )}
              >
                {selected == tab.key && (
                  <motion.div
                    whileInView={whileTabInView}
                    className={cn(
                      "w-8 aspect-square -top-[5px] rounded-full absolute z-0 px-2  bg-primary",
                      {}
                    )}
                  />
                )}
                <tab.Icon
                  className={cn(
                    "w-5 h-5 z-[1]",
                    { "text-white": selected == tab.key },
                    classNames?.icon
                  )}
                />
                <span
                  className={cn(
                    "text-xs md:text-sm",
                    { "font-semibold": selected == tab.key },
                    classNames?.title
                  )}
                >
                  {tab.name}
                </span>
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  );
}
