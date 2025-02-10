/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef, useState } from "react";
import "react-image-crop/dist/ReactCrop.css";

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from "react-image-crop";
import setCanvasPreview from "@/lib/image-canvas-preview";
import { FileEdit } from "lucide-react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { Button } from "../ui/button";
import { notify } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "../ui/spinner";
import { QUERY_KEYS } from "@/lib/constants";

const MIN_DIMENSION = 200;
const ASPECT_RATIO = 1;

type UploaderProps = {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
};

type ImageCrop = {
  unit: "%" | "px";
  x: number;
  y: number;
  width: number;
  height: number;
};

function ProfilePictureUploader({
  isOpen,
  onClose,
  imageFile,
  setImageFile,
}: UploaderProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const imageRef = useRef<any>(null);
  const previewCanvasRef = useRef<any>(null);
  const [newAvatar, setNewAvatar] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [crop, setCrop] = useState<ImageCrop>({
    unit: "%", // Can be 'px' or '%'
    x: 35,
    y: 35,
    width: MIN_DIMENSION,
    height: MIN_DIMENSION,
  });

  function onSelectFile(file: File) {
    // Check in no file is selected
    if (!file) return;

    // Check file size limit (3 MB)
    const fileSizeLimit = 3 * 1024 * 1024; // 3 MB in bytes
    if (file.size > fileSizeLimit) {
      setError("File size exceeds the 2MB Limit");
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";

      imageElement.addEventListener("load", (e) => {
        if (error) setError("");
        const { naturalWidth, naturalHeight } =
          e.currentTarget as HTMLImageElement;

        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("Image dimensions must be 200 x 200 pixels");
          setNewAvatar("");

          return;
        }
      });

      setNewAvatar(imageUrl as string);
    });

    reader.readAsDataURL(file);
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    if (!newAvatar) return;

    const { width, height } = e.currentTarget;

    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );

    const centeredCrop = centerCrop(crop, width, height);

    setCrop(centeredCrop);
  }

  function handleClose() {
    setImageFile(null);
    setNewAvatar("");
    setError("");
    onClose();
  }

  async function handleSaveImage() {
    setIsLoading(true);
    setCanvasPreview(
      imageRef.current, // HTMLImageElement
      previewCanvasRef.current, // HTMLCanvasElement
      convertToPixelCrop(
        crop,
        imageRef?.current?.width,
        imageRef?.current?.height
      )
    );

    const dataUrl = previewCanvasRef?.current?.toDataURL!("image/jpeg", 0.7);
    const file = dataURLtoFile(dataUrl, "profileImage.jpeg");

    const formData = new FormData();
    formData.append("photo", file);

    if (!file?.name || file?.size <= 0) {
      setIsLoading(false);
      setError("Image file is missing");
      return;
    }

    // const response = await updateProfileImage(formData);
    const response: any = await setTimeout(() => ({ success: true }), 2000);

    if (response?.success) {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
      notify({
        title: "Update Success",
        description: "Profile Picture updated successfully",
      });
    } else {
      notify({
        title: "Update Error",
        description: response?.message,
        variant: "danger",
      });
    }

    setIsLoading(false);
    handleClose();
  }

  useEffect(() => {
    onSelectFile(imageFile as File);
  });

  return (
    <Modal
      size="5xl"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      placement="center"
    >
      <>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h4>Crop Profile Picture</h4>
                <p className="text-xs text-foreground/50 md:text-sm">
                  Make sure all your facial details are visible within the crop
                </p>
              </ModalHeader>
              <ModalBody className="grid place-items-center overflow-visible">
                {/* UPLOAD BUTTONS */}
                <div className="ml-auto flex max-w-max items-center">
                  <label
                    htmlFor="avatar"
                    className="flex max-w-fit cursor-pointer items-center py-3 text-sm text-foreground/50 transition-all duration-300 ease-in-out hover:scale-[0.99]"
                  >
                    {imageFile?.name || "No file chosen"}
                    <span className="mx-2 inline-flex items-center text-nowrap text-base font-medium leading-6 text-primary">
                      {" "}
                      | Change Image <FileEdit className="ml-2 h-6 w-6" />
                    </span>
                  </label>
                  <input
                    id={"avatar"}
                    name={"avatar"}
                    type="file"
                    accept="image/*"
                    className={`hidden`}
                    onChange={(e) => {
                      setImageFile(null);
                      onSelectFile(e?.target?.files?.[0] as File);
                      setImageFile(e?.target?.files?.[0] as File);
                    }}
                  />
                  {/* ERROR STATUS */}
                  {error && (
                    <p className="my-2 text-sm leading-6 text-rose-600">
                      {error}
                    </p>
                  )}
                </div>

                <div className="mx-auto grid w-full place-items-center rounded-md">
                  {!newAvatar ? (
                    <Spinner
                      size={60}
                      className="aspect-auto w-full object-cover opacity-20"
                    />
                  ) : (
                    <ReactCrop
                      aspect={ASPECT_RATIO}
                      crop={crop}
                      circularCrop
                      keepSelection
                      minWidth={MIN_DIMENSION}
                      onChange={(pixelCrop: any, percentCrop: any) =>
                        setCrop(percentCrop)
                      }
                      className="flex h-full max-h-[600px] w-full items-center justify-center bg-green-200/50"
                    >
                      <img
                        src={newAvatar}
                        ref={imageRef}
                        className="h-full w-full object-contain"
                        alt="Profile Picture Upload"
                        onLoad={onImageLoad}
                      />
                    </ReactCrop>
                  )}
                </div>
                {/* PREVIEW CANVAS - NOT NEEDED FOR NOW */}
                <canvas ref={previewCanvasRef} className="hidden"></canvas>
              </ModalBody>
              <ModalFooter>
                <Button
                  isDisabled={isLoading}
                  color="danger"
                  variant="light"
                  onPress={handleClose}
                >
                  Close
                </Button>
                <Button
                  isLoading={isLoading}
                  color="primary"
                  onPress={handleSaveImage}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </>
    </Modal>
  );
}

export default ProfilePictureUploader;

function dataURLtoFile(dataurl: any, filename: any) {
  const arr = dataurl.split(",");
  const mimeMatch = arr[0].match(/^data:(.*?);/);
  if (!mimeMatch) {
    throw new Error("Invalid data URL");
  }
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
