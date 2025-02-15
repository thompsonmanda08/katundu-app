"use client";

import { revokeAccessToken } from "@/app/_actions/config-actions";
import ProfilePictureUploader from "@/components/elements/image-uploader";
import { ChangePasswordFields } from "@/components/forms";
import Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import useMainStore from "@/context/main-store";
import useCustomTabsHook from "@/hooks/use-custom-tabs";
import { containerVariants, slideDownInView } from "@/lib/constants";
import { User } from "@/lib/types";
import { cn, compareObjects, notify } from "@/lib/utils";

// import { today, getLocalTimeZone } from "@internationalized/date";
import {
  Switch,
  useDisclosure,
  Button as NextButton,
  Skeleton,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { AnimatePresence, motion } from "framer-motion";
import { CameraIcon, MailIcon, Smartphone, UserIcon } from "lucide-react";
import React from "react";

const PROFILE_TABS = [
  {
    title: "Account Profile",
    key: 0,
  },

  {
    title: "Subscriptions",
    key: 1,
  },
];

type AccountProps = {
  user?: Partial<User>;
};

export default function Account({ user }: { user?: User }) {
  const {
    currentTabIndex,
    activeTab,
    navigateTo,
    navigateForward,
    navigateBackwards,
    isLoading,
  } = useCustomTabsHook([
    <AccountDetails key={"account-details"} />,
    <Subscriptions key={"subscriptions-details"} />,
  ]);

  return (
    <div className="flex h-full w-full flex-1 flex-col shadow-none">
      {/* <div className="flex flex-wrap gap-4 px-5">
        <Tabs
          aria-label="Tabs"
          selectedKey={String(currentTabIndex)}
          onSelectionChange={navigateTo}
          variant={"light"}
          color="primary"
          className=""
        >
          {PROFILE_TABS.map(({ title, key }, index) => (
            <Tab key={String(key)} title={title} />
          ))}
        </Tabs>
      </div> */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTabIndex}
          variants={containerVariants}
          initial={"initial"}
          animate={"animate"}
          exit={"exit"}
          className="flex flex-col gap-4 p-5"
        >
          {isLoading ? (
            <Loader
              removeWrapper
              className="my-10 flex items-center justify-center"
            />
          ) : (
            activeTab
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function AccountDetails() {
  const queryClient = useQueryClient();

  const { user } = useMainStore((state) => state);

  const [isLoading, setIsLoading] = React.useState(false);
  const [changePassword, setChangePassword] = React.useState(false);

  const [formData, setFormData] = React.useState({ ...user });
  const [isSelected, setIsSelected] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [showMore, setShowMore] = React.useState(false);
  const toggleShowMore = () => setShowMore(!showMore);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  React.useEffect(() => {
    if (user && (user?.firstName || user?.lastName)) {
      setFormData(user);
    }
  }, [user]);

  const noChangesToSave = compareObjects(user, formData);

  async function handleUserDetailsUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const cleanedData = {
      firstName: formData?.firstName,
      lastName: formData?.lastName,
      email: formData?.email,
      phone: formData?.phone,
      universityId: formData?.universityId || "N/A",
      dob: formData?.dob || "",
      isStudent: formData?.isStudent || false,
    };

    // const response = await updateProfileDetails(cleanedData);
    const response: any = await setTimeout(() => ({ success: true }), 2000);

    if (response?.success) {
      queryClient.invalidateQueries();
      notify({
        title: "Update Success",
        description: "Profile Details updated successfully",
      });
    } else {
      notify({
        title: "Update Error",
        description: response?.message,
        variant: "danger",
      });
    }

    setIsLoading(false);
    return;
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    e?.preventDefault();
    setImageFile(null);
    const file = e?.target?.files?.[0];
    if (!file) return;

    if (file?.size > 2 * 1024 * 1024) {
      notify({
        title: "Error",
        description: "File size exceeded 2MB Limit",
        variant: "danger",
      });
      return;
    }
    setImageFile(file);
    onOpen();
  }

  return (
    <motion.div className="flex flex-col gap-8">
      <div className="flex flex-1 flex-col gap-4">
        {/* <div>
          <h4>Your Account Profile</h4>
          <p className="text-xs leading-6 text-foreground/60 sm:text-sm">
            You can edit your user information here.
          </p>
        </div> */}
        <div className="relative mx-auto flex max-w-max flex-col gap-4">
          <Avatar
            isBordered
            src={String(user?.profilePhoto)}
            name={`${user?.firstName} ${user?.lastName}`}
            className="mx-auto aspect-square h-24 w-24 cursor-pointer rounded-full text-large"
          />

          <NextButton
            aria-label="update-profile-photo"
            color="primary"
            disabled // TODO: Enable this
            className={
              "absolute rounded-full left-[65%] w-8 h-8 min-h-auto min-w-max aspect-square ring-2 ring-offset-2 ring-primary"
            }
          >
            <label htmlFor="profile-photo" className="cursor-pointer">
              <CameraIcon className="h-5 w-5" />
            </label>
          </NextButton>
          <input
            id={"profile-photo"}
            name={"profile-photo"}
            disabled // TODO: Enable this
            type="file"
            accept="image/*"
            className={`hidden`}
            onChange={handleFileSelect}
          />

          <div className="flex flex-col items-center">
            <Skeleton className="rounded-lg" isLoaded={!isLoading}>
              <h3 className="text-base font-semibold text-foreground/80">
                {`${user?.firstName} ${user?.lastName}`}
              </h3>
            </Skeleton>
            <Skeleton className="rounded-lg" isLoaded={!isLoading}>
              <span className="text-sm text-foreground/80">{`${user?.phone} (${user?.role})`}</span>
            </Skeleton>

            {!showMore && (
              <Button
                variant="light"
                size="sm"
                isDisabled
                disabled // TODO: Enable this
                onPress={toggleShowMore}
                className="bg-transparent p-0 text-sm data-[hover=true]:bg-transparent"
              >
                Update
              </Button>
            )}
          </div>

          <ProfilePictureUploader
            isOpen={isOpen}
            onClose={onClose}
            imageFile={imageFile}
            setImageFile={setImageFile}
          />
        </div>

        {/* <Divider className="my-4 bg-foreground/5 lg:my-6 lg:mb-8" /> */}
        <AnimatePresence>
          {showMore && (
            <motion.form
              onSubmit={handleUserDetailsUpdate}
              variants={slideDownInView}
              initial="hidden"
              animate="visible"
              exit={"hidden"}
              className="flex flex-1 flex-col gap-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="flex-[0.5] text-sm font-medium">
                  Full Name
                </label>
                <div className="flex flex-1 gap-4">
                  <Input
                    required
                    placeholder={"First Name"}
                    value={formData?.firstName}
                    onChange={handleChange}
                    classNames={{
                      inputWrapper: "pl-0 overflow-clip",
                    }}
                    startContent={
                      <span className="flex h-full w-full max-w-max items-center justify-center bg-gradient-to-b from-default-50 via-default-50/20 to-default-50 px-4 py-1 text-foreground/70 text-gray-500 dark:from-default-300">
                        <UserIcon className="text-foreground/50" />
                      </span>
                    }
                  />
                  <Input
                    required
                    placeholder={"Last Name"}
                    value={formData?.lastName}
                    onChange={handleChange}
                    classNames={{
                      inputWrapper: "pl-0 overflow-clip",
                    }}
                    startContent={
                      <span className="flex h-full w-full max-w-max items-center justify-center bg-gradient-to-b from-default-50 via-default-50/20 to-default-50 px-4 py-1 text-foreground/70 text-gray-500 dark:from-default-300">
                        <UserIcon className="text-foreground/50" />
                      </span>
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="flex-[0.5] text-sm font-medium">Email</label>
                <div className="flex flex-1 gap-4">
                  <Input
                    required
                    placeholder={"Email"}
                    name={"email"}
                    type={"email"}
                    value={formData?.email || ""}
                    onChange={handleChange}
                    classNames={{
                      inputWrapper: "pl-0 overflow-clip",
                    }}
                    startContent={
                      <span className="flex h-full w-full max-w-max items-center bg-gradient-to-b from-default-50 via-default-50/20 to-default-50 px-4 py-1 text-foreground/70 text-gray-500 dark:from-default-300">
                        <MailIcon className="text-foreground/50" />
                      </span>
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="flex-[0.5] text-sm font-medium">
                  Mobile Number
                </label>
                <div className="flex flex-1 gap-4">
                  <Input
                    required
                    placeholder={"Mobile Number"}
                    name={"phone"}
                    value={formData?.phone || ""}
                    onChange={handleChange}
                    classNames={{
                      inputWrapper: "pl-0 overflow-clip",
                    }}
                    startContent={
                      <span className="flex h-full w-full max-w-max items-center justify-center bg-gradient-to-b from-default-50 via-default-50/20 to-default-50 px-4 py-1 text-foreground/70 text-gray-500 dark:from-default-300">
                        <Smartphone className="text-foreground/50" />
                      </span>
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  size="md"
                  color="danger"
                  // variant={"light"}
                  className="mt-auto self-end justify-self-end"
                  isLoading={isLoading}
                  onPress={toggleShowMore}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="md"
                  aria-label="profile-update-save"
                  color="primary"
                  variant={noChangesToSave ? "faded" : "solid"}
                  isDisabled={noChangesToSave}
                  className="mt-auto self-end justify-self-end"
                  isLoading={isLoading}
                  // onPress={handleUserDetailsUpdate}
                >
                  Save Changes
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-4">
        <div className="">
          <h4 className="flex-[0.5] font-medium">Security Settings</h4>
          <p className="text-xs leading-6 text-foreground/60 sm:text-sm">
            Update your security settings to protect your account and data.
          </p>
        </div>

        <div className="text-sm">
          <div
            className={cn("items-center flex justify-between", {
              "items-start flex-col": changePassword,
            })}
          >
            <div className="flex flex-col text-sm text-foreground">
              Password
              <span className="text-xs text-foreground/50 md:text-sm">
                Change your password
              </span>
            </div>
            {!changePassword ? (
              <>
                <span className="mx-auto mt-1">********</span>
                <button
                  type="button"
                  disabled // TODO: Enable this
                  onClick={() => setChangePassword(true)}
                  className="font-semibold text-primary hover:text-primary/80"
                >
                  Change
                </button>
              </>
            ) : (
              <ChangePasswordFields
                changePassword={changePassword}
                setChangePassword={setChangePassword}
              />
            )}
          </div>
          <div className="flex w-full items-center justify-between py-3 opacity-50">
            <p className="text-sm font-medium text-foreground sm:pr-6 md:text-base">
              2F Authentication
            </p>
            <div className="text-sm font-medium text-foreground md:text-base">
              [disabled] Coming Soon!
            </div>
            <Switch isDisabled />
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col gap-2 md:flex-row md:justify-between">
        <div className="mb-4">
          <h4 className="font-medium">Notification Settings</h4>
          <p className="text-xs leading-6 text-foreground/60 sm:text-sm">
            Update your notification and communication settings.
          </p>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:gap-8">
          <div className="flex flex-col gap-2">
            <Checkbox isDisabled>SMS Notifications</Checkbox>
            <p className="text-xs text-default-500">
              Get notified via SMS. [Coming Soon]
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Checkbox
              isDisabled
              isSelected={isSelected}
              onValueChange={setIsSelected}
            >
              Email Notifications
            </Checkbox>
            <p className="text-xs text-default-500">
              Get Notifications for new listings and newsletter updates
            </p>
          </div>
        </div>
      </div> */}

      <Button
        onPress={async () => await revokeAccessToken()}
        className="text-sm"
        // variant="flat"
      >
        Log Out
      </Button>
    </motion.div>
  );
}

export function Subscriptions({}: Partial<AccountProps>) {
  return (
    <motion.div className="flex flex-col gap-4">
      <div>
        <h4>Subscription Information</h4>
        <p className="text-sm leading-6 text-foreground/60">
          Manage your subscription information.
        </p>
      </div>

      <div className="flex items-center justify-center">
        <EmptyState
          title="No Subscriptions"
          description="You have no active subscriptions"
          width={412}
          height={400}
          classNames={{ image: "w-96 h-96" }}
        />
      </div>
    </motion.div>
  );
}
