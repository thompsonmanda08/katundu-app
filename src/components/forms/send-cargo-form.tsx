import { OptionItem } from "@/lib/types";
import { Autocomplete, AutocompleteItem, DatePicker } from "@heroui/react";
import React from "react";
import { Input } from "../ui/input";
import useMainStore from "@/context/main-store";
import { useCities } from "@/hooks/use-query-data";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import SelectField from "../ui/select-field";

export function CargoDetailsForm() {
  const { data: DISTRICTS } = useCities(100);

  const { sendCargoFormData, updateSendCargoFormData } = useMainStore(
    (state) => state
  );

  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      <div className="-mt-2 flex w-full flex-col gap-1">
        <h2
          className={
            "w-full text-[clamp(12px,12px+0.5vw,1rem)] text-foreground font-bold"
          }
        >
          Cargo Details
        </h2>
        <p className="text-xs text-foreground">
          Information about the package and delivery details to be sent
        </p>
      </div>
      <Autocomplete
        label="From"
        isRequired
        variant="bordered"
        defaultItems={(DISTRICTS || []) as OptionItem[]}
        placeholder="Select a city"
        className="max-w-md"
        selectedKey={String(sendCargoFormData?.pickUpCity)}
        onSelectionChange={(city) =>
          updateSendCargoFormData({ pickUpCity: String(city) })
        }
      >
        {(item) => (
          <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
        )}
      </Autocomplete>
      <Input
        label="Pickup point"
        isRequired
        value={sendCargoFormData?.pickUpLocation}
        onChange={(e) => {
          updateSendCargoFormData({ pickUpLocation: e.target.value });
        }}
        className="mt-px"
      />
      <Autocomplete
        label="Destination"
        isRequired
        variant="bordered"
        defaultItems={(DISTRICTS || []) as OptionItem[]}
        placeholder="Select a city"
        className="max-w-md"
        selectedKey={String(sendCargoFormData?.deliveryCity)}
        onSelectionChange={(city) =>
          updateSendCargoFormData({ deliveryCity: String(city) })
        }
      >
        {(item) => (
          <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
        )}
      </Autocomplete>
      <Input
        label="Drop Off point"
        isRequired
        value={sendCargoFormData?.deliveryLocation}
        onChange={(e) => {
          updateSendCargoFormData({ deliveryLocation: e.target.value });
        }}
      />

      <DatePicker
        className=""
        isRequired
        label="Transport Date"
        variant="bordered"
        minValue={today(getLocalTimeZone())}
        defaultValue={today(getLocalTimeZone().toString())}
        value={parseDate(
          String(
            sendCargoFormData?.transportDate ||
              today(getLocalTimeZone().toString())
          )
        )}
        onChange={(date) =>
          updateSendCargoFormData({ transportDate: date?.toString() })
        }
        description={"Date to transport your Katundu to its destination"}
      />

      <div className="flex w-full flex-1 gap-4">
        <Input
          label="Quantity"
          type="number"
          min={1}
          isRequired
          value={sendCargoFormData?.quantity}
          onChange={(e) => {
            updateSendCargoFormData({ quantity: e.target.value });
          }}
        />
        <SelectField
          label="Type"
          isRequired
          options={
            [
              { name: "Boxes", id: "Boxes" },
              { name: "Sack Bags", id: "Sack Bags" },
              { name: "Containers", id: "Containers" },
              { name: "Bales", id: "Bales" },
              { name: "Pallets", id: "Pallets" },
              { name: "Bags", id: "Bags" },
              { name: "Bundles", id: "Bundles" },
              { name: "Cartons", id: "Cartons" },
              { name: "Crates", id: "Crates" },
              { name: "Drums", id: "Drums" },
              { name: "Rolls", id: "Rolls" },
              { name: "Trays", id: "Trays" },
              { name: "Other", id: "Other" },
            ] as OptionItem[]
          }
          // className="max-w-md"
          value={String(sendCargoFormData?.packaging)}
          onChange={(type) =>
            updateSendCargoFormData({ packaging: String(type) })
          }
        />
        {/* <Input
          label="Package Type"
          value={sendCargoFormData?.packaging}
          onChange={(e) => {
            updateSendCargoFormData({ packaging: e.target.value });
          }}
        /> */}
      </div>
      <div className="flex w-full flex-1 gap-4">
        <Input
          label="Size"
          isRequired
          type="number"
          value={sendCargoFormData?.containerSize}
          onChange={(e) => {
            updateSendCargoFormData({ containerSize: String(e.target.value) });
          }}
        />
        <SelectField
          label="Units"
          isRequired
          options={
            [
              { name: "Kg", id: "Kg" },
              { name: "Tons", id: "Ton" },
              { name: "Liters", id: "L" },
              { name: "Cubic Meters", id: "m3" },
              { name: "Pounds", id: "lb" },
              { name: "Gallons", id: "gal" },
            ] as OptionItem[]
          }
          // className="max-w-md"
          value={String(sendCargoFormData?.unit)}
          onChange={(unit) =>
            updateSendCargoFormData({ cargoMeasure: String(unit) })
          }
        />
        {/* <Input
          label="Measurement Units"
          value={sendCargoFormData?.cargoMeasure}
          onChange={(e) => {
            updateSendCargoFormData({ cargoMeasure: String(e.target.value) });
          }}
          className="mt-px"
        /> */}
      </div>

      <Input
        label="Cargo Description"
        value={sendCargoFormData?.cargoDescription}
        onChange={(e) => {
          updateSendCargoFormData({ cargoDescription: e.target.value });
        }}
        className="mt-px"
      />
    </div>
  );
}

export function ReceiverDetailsForm() {
  const { sendCargoFormData, updateSendCargoFormData } = useMainStore(
    (state) => state
  );

  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      <div className="-mt-2 flex w-full flex-col gap-1">
        <h2
          className={
            "w-full text-[clamp(12px,12px+0.5vw,1rem)] text-foreground font-bold"
          }
        >
          Receiver Details
        </h2>
        <p className="text-xs text-foreground">
          Information about the receiving party
        </p>
      </div>
      <Input
        label="Receiver Name"
        value={sendCargoFormData?.receiverName}
        onChange={(e) => {
          updateSendCargoFormData({ receiverName: e.target.value });
        }}
        className="mt-px"
      />

      <Input
        label="Receiver Address"
        value={sendCargoFormData?.receiverAddress}
        onChange={(e) => {
          updateSendCargoFormData({ receiverAddress: e.target.value });
        }}
      />
      <Input
        label="Receiver Phone 1"
        value={sendCargoFormData?.receiverPhoneOne}
        onChange={(e) => {
          updateSendCargoFormData({ receiverPhoneOne: e.target.value });
        }}
      />
      <Input
        label="Receiver Phone 2"
        value={sendCargoFormData?.receiverPhoneTwo}
        onChange={(e) => {
          updateSendCargoFormData({ receiverPhoneTwo: e.target.value });
        }}
      />
    </div>
  );
}

export function PaymentDetailsForm() {
  const { sendCargoFormData, updateSendCargoFormData, user } = useMainStore(
    (state) => state
  );

  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      <div className="-mt-2 flex w-full flex-col gap-1">
        <h2
          className={
            "w-full text-[clamp(12px,12px+0.5vw,1rem)] text-foreground font-bold"
          }
        >
          Payment Details
        </h2>
        <p className="text-xs text-foreground">
          Payment information required for the transaction to complete
        </p>
      </div>
      <Input
        label="Payment Phone Number"
        defaultValue={user?.phone}
        value={sendCargoFormData?.paymentPhone}
        onChange={(e) => {
          updateSendCargoFormData({ paymentPhone: e.target.value });
        }}
      />

      {/* <Input
        label="Reference"
        value={sendCargoFormData?.reference}
        onChange={(e) => {
          updateSendCargoFormData({ reference: e.target.value });
        }}
      /> */}
    </div>
  );
}
