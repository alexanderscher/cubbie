"use client";
import { Menu } from "@/components/profile/Menu";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import styles from "./profile.module.css";
import { UserAlerts } from "@/types/AppTypes";
import { toggleSettings } from "@/actions/alerts/toggleSettings";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import RegularButton from "@/components/buttons/RegularButton";
import { addPhone } from "@/actions/user/addPhone";
import { toast } from "sonner";
import Loading from "@/components/Loading/Loading";
import TimezoneSelect from "react-timezone-select";
import { changeTimezone } from "@/actions/alerts/changeTimezone";
import { set } from "date-fns";

interface AlertSettingsProps {
  user: UserAlerts;
}

const AlertSettings = ({ user }: AlertSettingsProps) => {
  const defaultTimezone = {
    value: user.alertSettings.timezone.value,
    label: user.alertSettings.timezone.label,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [editPhone, setEditPhone] = useState(false);
  const [selectedTimezone, setSelectedTimezone] =
    useState<any>(defaultTimezone);

  const submitPhone = async () => {
    if (value) {
      startTransition(() => {
        try {
          addPhone(value);
          toast.success("Phone number added successfully");
          setEditPhone(false);
        } catch (error) {
          toast.error("An error occurred");
        }
      });
    }
  };

  const changeTimezoneCall = async () => {
    startTransition(() => {
      try {
        console.log(selectedTimezone);
        changeTimezone({ selectedTimezone });

        toast.success("Timezone updated successfully");
      } catch (error) {
        toast.error("An error occurred");
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-[600px]">
      <div className="bg-white rounded-lg p-6  flex flex-col gap-4">
        <div className="flex justify-between">
          <p className="text-emerald-900">Alert Settings</p>
          <div className={styles.button}>
            <Image
              src={"/dashboard_b.png"}
              alt="user image"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={() => {
                console.log(isOpen);
                setIsOpen(!isOpen);
              }}
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg  flex flex-col ">
        <div className="flex justify-between items-center p-6">
          <h1 className="text-sm">Due today alerts</h1>
          <ToggleSwitch
            userAlerts={user.alertSettings.notifyToday}
            type="notifyToday"
          />
        </div>

        <div className="flex justify-between items-center border-t-[1px] p-6">
          <h1 className="text-sm">Due in one day alerts</h1>
          <ToggleSwitch
            userAlerts={user.alertSettings.notifyInOneDay}
            type="notifyInOneDay"
          />
        </div>
        <div className="flex justify-between items-center border-t-[1px] p-6">
          <h1 className="text-sm">Due in one week alerts</h1>
          <ToggleSwitch
            userAlerts={user.alertSettings.notifyInOneWeek}
            type="notifyInOneWeek"
          />
        </div>
      </div>
      {!user.phone ||
        (editPhone && (
          <div className="bg-white rounded-lg  flex flex-col p-6 gap-6">
            <p className="text-xs">Enter phone number to receive sms alerts</p>

            <PhoneInput
              international
              defaultCountry="US"
              value={value}
              onChange={setValue}
            />
            <div className="flex w-full justify-between gap-6">
              <RegularButton
                styles="border-emerald-900 w-full "
                handleClick={submitPhone}
              >
                <p className="text-emerald-900 text-xs ">Save</p>
              </RegularButton>
              {user.phone && (
                <RegularButton
                  styles="border-emerald-900 w-full "
                  handleClick={() => setEditPhone(false)}
                >
                  <p className="text-emerald-900 text-xs ">Cancel</p>
                </RegularButton>
              )}
            </div>
          </div>
        ))}
      {user.phone && !editPhone && (
        <div className="bg-white rounded-lg  flex flex-col p-6 gap-6 justify-between">
          <div>
            <p className="text-xs">
              Phone number: {formatE164ToReadable(user.phone)}
            </p>
          </div>
          <RegularButton
            styles="border-emerald-900 "
            handleClick={() => setEditPhone(true)}
          >
            <p className="text-emerald-900 text-xs">Edit</p>
          </RegularButton>
        </div>
      )}
      <div className="bg-white rounded-lg  flex flex-col p-6 gap-4 justify-between">
        <p className="text-xs">Time zone</p>
        <TimezoneSelect
          value={selectedTimezone}
          onChange={setSelectedTimezone}
        />
        <RegularButton
          styles="border-emerald-900 "
          handleClick={changeTimezoneCall}
        >
          <p className="text-emerald-900 text-xs">Edit</p>
        </RegularButton>
      </div>

      {isOpen && <Menu setIsOpen={setIsOpen} />}
      {isPending && <Loading loading={isPending} />}
    </div>
  );
};

export default AlertSettings;

const ToggleSwitch = ({
  userAlerts,
  type,
}: {
  userAlerts: boolean;
  type: string;
}) => {
  const [isToggled, setIsToggled] = useState(userAlerts);

  const toggleSwitch = async () => {
    const newIsToggled = !isToggled;
    setIsToggled(newIsToggled);
    await toggleSettings({ type, isToggled: newIsToggled }); // Correct function call
  };

  return (
    <label className="switch">
      <input type="checkbox" checked={isToggled} onChange={toggleSwitch} />
      <span className="slider round"></span>
    </label>
  );
};

const formatE164ToReadable = (phoneNumber: string) => {
  // if (!phoneNumber.startsWith("+1") || phoneNumber.length !== 12) {
  //   throw new Error("Unsupported phone number format or non-US number.");
  // }

  const areaCode = phoneNumber.slice(2, 5);
  const prefix = phoneNumber.slice(5, 8);
  const lineNumber = phoneNumber.slice(8, 12);

  return `(${areaCode}) ${prefix}-${lineNumber}`;
};
