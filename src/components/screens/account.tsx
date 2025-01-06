"use client";

import ProfilePictureUploader from "@/components/elements/image-uploader";
import { ChangePasswordFields } from "@/components/forms";
import Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import useCustomTabsHook from "@/hooks/use-custom-tabs";
import { slideDownInView, whileTabInView } from "@/lib/constants";
import { User } from "@/lib/types";
import { cn, compareObjects, formatDate, notify } from "@/lib/utils";

import { today, getLocalTimeZone } from "@internationalized/date";
import {
  Card,
  CardHeader,
  Checkbox,
  Divider,
  Switch,
  Tab,
  Tabs,
  useDisclosure,
  Button as NextButton,
} from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarHeartIcon,
  CameraIcon,
  MailIcon,
  MessagesSquareIcon,
  Smartphone,
  UserIcon,
} from "lucide-react";
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

export default function Account({ user }: AccountProps) {
  // only fetch user profile from cookies

  const {
    currentTabIndex,
    activeTab,
    navigateTo,
    navigateForward,
    navigateBackwards,
    isLoading,
  } = useCustomTabsHook([
    <AccountDetails key={"account-details"} user={user} />,
    <Subscriptions user={user} key={"subscriptions-details"} />,
  ]);

  return (
    <div className="flex flex-col w-full shadow-none flex-1 h-full">
      <div className="flex flex-wrap gap-4 px-5">
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
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTabIndex}
          // initial={{ opacity: 0, x: 100 }}
          // animate={{ opacity: 1, x: 0 }}
          // exit={{ opacity: 0, x: -100 }}
          // transition={{ duration: 0.2 }}
          className="flex flex-col gap-4 p-5 "
        >
          {isLoading ? (
            <Loader
              removeWrapper
              className="flex justify-center items-center my-10"
            />
          ) : (
            activeTab
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function AccountDetails({ user }: Partial<AccountProps>) {
  const queryClient = useQueryClient();

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
      <div className="flex flex-col gap-4 flex-1">
        <div>
          <h4>Your Account Profile</h4>
          <p className="text-foreground/60 leading-6 text-xs sm:text-sm">
            You can edit your user information here.
          </p>
        </div>
        <div className="relative flex gap-4 flex-col max-w-max mx-auto">
          <Avatar
            isBordered
            src={String(user?.profilePhoto)}
            name={`${user?.firstName} ${user?.lastName}`}
            className="cursor-pointer rounded-full mr-2 aspect-square w-32 h-32 text-large"
          />

          <NextButton
            aria-label="update-profile-photo"
            color="primary"
            className={
              "absolute rounded-full left-24 -top-2 w-12 h-12 min-h-auto min-w-max aspect-square ring-2 ring-offset-2 ring-primary"
            }
          >
            <label htmlFor="profile-photo" className="cursor-pointer ">
              <CameraIcon />
            </label>
          </NextButton>
          <input
            id={"profile-photo"}
            name={"profile-photo"}
            type="file"
            accept="image/*"
            className={`hidden`}
            onChange={handleFileSelect}
          />

          <div className="flex flex-col items-center">
            <h3 className="font-semibold text-base text-foreground/80">
              Thompson Manda
            </h3>
            <span className="text-sm text-foreground/80">+260976552560</span>
            {!showMore && (
              <Button
                variant="light"
                size="sm"
                onPress={toggleShowMore}
                className="p-0 bg-transparent data-[hover=true]:bg-transparent text-sm"
              >
                Update Profile
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

        {/* <Divider className="my-4 lg:my-6 lg:mb-8 bg-foreground/5" /> */}
        <AnimatePresence>
          {showMore && (
            <motion.form
              onSubmit={handleUserDetailsUpdate}
              variants={slideDownInView}
              initial="hidden"
              animate="visible"
              exit={"hidden"}
              className="flex flex-col gap-4 flex-1"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="flex-[0.5] font-medium text-sm">
                  Full Name
                </label>
                <div className="flex gap-4 flex-1">
                  <Input
                    required
                    placeholder={"First Name"}
                    value={formData?.firstName}
                    onChange={handleChange}
                    classNames={{
                      inputWrapper: "pl-0 overflow-clip",
                    }}
                    startContent={
                      <span className="bg-gradient-to-b from-default-50 dark:from-default-300 via-default-50/20 to-default-50 px-4 text-gray-500 py-1 flex items-center text-foreground/70 h-full w-full max-w-max  justify-center ">
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
                      <span className="bg-gradient-to-b from-default-50 dark:from-default-300 via-default-50/20 to-default-50 px-4 text-gray-500 py-1 flex items-center text-foreground/70 h-full w-full max-w-max  justify-center ">
                        <UserIcon className="text-foreground/50" />
                      </span>
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="flex-[0.5] font-medium text-sm">Email</label>
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
                      <span className="bg-gradient-to-b from-default-50 dark:from-default-300 via-default-50/20 to-default-50 px-4 text-gray-500 py-1 flex items-center text-foreground/70 h-full w-full max-w-max">
                        <MailIcon className="text-foreground/50" />
                      </span>
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="flex-[0.5] font-medium text-sm">
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
                      <span className="bg-gradient-to-b from-default-50 dark:from-default-300 via-default-50/20 to-default-50 px-4 text-gray-500 py-1 flex items-center text-foreground/70 h-full w-full max-w-max justify-center ">
                        <Smartphone className="text-foreground/50" />
                      </span>
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  size="md"
                  color="danger"
                  // variant={"light"}
                  className="self-end justify-self-end mt-auto"
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
                  className="self-end justify-self-end mt-auto"
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
          <p className="text-foreground/60 leading-6 text-xs sm:text-sm">
            Update your security settings to protect your account and data.
          </p>
        </div>

        <div className="text-sm ">
          <div
            className={cn("items-center flex justify-between", {
              "items-start flex-col": changePassword,
            })}
          >
            <div className="flex flex-col text-foreground text-sm">
              Password
              <span className="text-xs md:text-sm text-foreground/50">
                Change your password
              </span>
            </div>
            {!changePassword ? (
              <>
                <span className="mt-1 mx-auto">********</span>
                <button
                  type="button"
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
          {/* *************************************** */}
          <div className="items-center py-3 opacity-50 flex justify-between w-full">
            <p className="font-medium text-foreground text-sm md:text-base sm:pr-6">
              2F Authentication
            </p>
            <div className="font-medium text-sm md:text-base text-foreground">
              [disabled] Coming Soon!
            </div>
            <Switch isDisabled />
          </div>
          {/* *************************************** */}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between gap-2">
        <div className="mb-4">
          <h4 className="font-medium">Notification Settings</h4>
          <p className="text-foreground/60 leading-6 text-xs sm:text-sm">
            Update your notification and communication settings.
          </p>
        </div>
        <div className="flex gap-4 flex-col md:flex-row md:gap-8">
          <div className="flex flex-col gap-2">
            <Checkbox isSelected={isSelected} onValueChange={setIsSelected}>
              Email Notifications
            </Checkbox>
            <p className="text-default-500 text-xs">
              Get Notifications for new listings and newsletter updates
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Checkbox isDisabled>SMS Notifications</Checkbox>
            <p className="text-default-500 text-xs">
              You will be notified via SMS when a listing you wish for is
              available. [Coming Soon]
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Subscriptions({}: Partial<AccountProps>) {
  return (
    <motion.div className="flex flex-col gap-4">
      <div>
        <h4>Subscription Information</h4>
        <p className="text-foreground/60 leading-6 text-sm ">
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
