import { OptionItem } from "@/lib/types";
import { Autocomplete, AutocompleteItem, DatePicker } from "@heroui/react";
import React from "react";
import { Input } from "../ui/input";
import useMainStore from "@/context/main-store";
import { useCities } from "@/hooks/use-query-data";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";

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
        variant="bordered"
        defaultItems={DISTRICTS as OptionItem[]}
        placeholder="Select a city"
        className="max-w-md"
        selectedKey={String(sendCargoFormData.pickUpCity)}
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
        value={sendCargoFormData?.pickUpLocation}
        onChange={(e) => {
          updateSendCargoFormData({ pickUpLocation: e.target.value });
        }}
        className="mt-px"
      />
      <Autocomplete
        label="Destination"
        variant="bordered"
        defaultItems={DISTRICTS as OptionItem[]}
        placeholder="Select a city"
        className="max-w-md"
        selectedKey={String(sendCargoFormData.deliveryCity)}
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
        value={sendCargoFormData?.deliveryLocation}
        onChange={(e) => {
          updateSendCargoFormData({ deliveryLocation: e.target.value });
        }}
      />

      <DatePicker
        className=""
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
          label="Package Type"
          value={sendCargoFormData?.packaging}
          onChange={(e) => {
            updateSendCargoFormData({ packaging: e.target.value });
          }}
        />
        <Input
          label="Quantity"
          value={sendCargoFormData?.quantity}
          onChange={(e) => {
            updateSendCargoFormData({ quantity: e.target.value });
          }}
        />
      </div>
      <div className="flex w-full flex-1 gap-4">
        <Input
          label="Size"
          type="number"
          value={sendCargoFormData?.containerSize}
          onChange={(e) => {
            updateSendCargoFormData({ containerSize: String(e.target.value) });
          }}
        />
        <Input
          label="Measurement Units"
          value={sendCargoFormData?.cargoMeasure}
          onChange={(e) => {
            updateSendCargoFormData({ cargoMeasure: String(e.target.value) });
          }}
          className="mt-px"
        />
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
          Payment Details
        </h2>
        <p className="text-xs text-foreground">
          Payment information required for the transaction to complete
        </p>
      </div>
      <Input
        label="Payment Phone Number"
        value={sendCargoFormData?.paymentPhone}
        onChange={(e) => {
          updateSendCargoFormData({ paymentPhone: e.target.value });
        }}
      />

      <Input
        label="Reference"
        value={sendCargoFormData?.reference}
        onChange={(e) => {
          updateSendCargoFormData({ reference: e.target.value });
        }}
      />
    </div>
  );
}
