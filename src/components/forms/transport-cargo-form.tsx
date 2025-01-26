import { ShipmentRecord } from "@/lib/types";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import React from "react";
import useMainStore from "@/context/main-store";
import { DISTRICTS } from "@/lib/constants";

export function TransportCargoForm() {
  const [value, setValue] = React.useState<any>(undefined);
  const { transportCargoFormData, updateTransportCargoFormData } = useMainStore(
    (state) => state
  );

  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      <div className="-mt-4 flex w-full flex-col gap-1">
        {/* <h2
          className={
            "w-full text-[clamp(12px,12px+0.5vw,1rem)] text-foreground font-bold"
          }
        >
          Transportation Route
        </h2> */}
        <p className="text-xs text-foreground">
          Where would you like to get cargo pickups
        </p>
      </div>
      <div className="flex w-full flex-1 gap-2">
        <Autocomplete
          label="Pick up city"
          variant="bordered"
          defaultItems={DISTRICTS}
          placeholder="Select a city"
          className="max-w-md"
          selectedKey={String(transportCargoFormData.pickUpCity)}
          onSelectionChange={(city) =>
            updateTransportCargoFormData({
              deliveryCity: String(city)?.toUpperCase(),
            })
          }
        >
          {(item) => (
            <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>

      <div>LIST FROM SERVER</div>
    </div>
  );
}
