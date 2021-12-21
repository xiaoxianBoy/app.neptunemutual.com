import { Container } from "@/components/UI/atoms/container";
import { Radio } from "@/components/UI/atoms/radio";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { useEffect, useState } from "react";
import { CoverPurchaseDetails } from "@/components/UI/organisms/cover-purchase-details/CoverPurchaseDetails";
import { Label } from "@/components/UI/atoms/label";
import { useConstants } from "@/components/pages/cover/useConstants";

import OpenInNewIcon from "@/icons/open-in-new";
import AddCircleIcon from "@/icons/add-circle";
import InfoCircleIcon from "@/icons/info-circle";
import Link from "next/link";
import { InputWithTrailingButton } from "@/components/UI/atoms/input/with-trailing-button";

export const CoverForm = () => {
  const [value, setValue] = useState();
  const [coverMonth, setCoverMonth] = useState();

  const { fees, maxValue } = useConstants();

  console.log(fees, maxValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleRadioChange = (e) => {
    setCoverMonth(e.target.value);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getMonthsToCover = () => {
    const date = new Date();
    let month = date.getMonth();
    console.log(month, month + 1, month + 2);
    return month;
  };

  const handleMaxButtonClick = () => {
    setValue(maxValue);
  };

  if (!fees && !maxValue) {
    return <>loading...</>;
  }

  return (
    <div className="max-w-md">
      <Label className="mb-4" htmlFor="cover-amount">
        Amount you wish to cover
      </Label>
      <InputWithTrailingButton
        buttonProps={{
          children: "Max",
          onClick: handleMaxButtonClick,
        }}
        inputProps={{
          id: "cover-amount",
          placeholder: "Enter Amount",
          value: value,
          onChange: handleChange,
        }}
        unit={"DAI"}
      />

      <div className="flex justify-between items-start text-dimmed-fg px-3 mt-2">
        <p>
          {value !== undefined && parseInt(value) !== NaN && (
            <>Balance: {value} DAI</>
          )}
        </p>
        <div className="flex">
          <Link href="#">
            <a className="ml-3">
              <OpenInNewIcon fill="currentColor" />
            </a>
          </Link>
          <Link href="#">
            <a className="ml-3">
              <AddCircleIcon fill="currentColor" />
            </a>
          </Link>
        </div>
      </div>
      {value !== undefined && parseInt(value) !== NaN && (
        <div className="px-3 flex items-center text-15aac8">
          <p>You will receive: {value} cxDAI</p>

          <InfoCircleIcon fill="currentColor" className="ml-2" />
        </div>
      )}
      <div className="mt-12 px-3">
        <h5
          className="block uppercase text-black text-h6 font-semibold mb-4"
          htmlFor="cover-period"
        >
          Select your coverage period
        </h5>
        <div className="flex">
          <Radio
            label="january"
            id="january"
            name="cover-period"
            onChange={handleRadioChange}
          />
          <Radio
            label="february"
            id="february"
            name="cover-period"
            onChange={handleRadioChange}
          />
          <Radio
            label="march"
            id="march"
            name="cover-period"
            onChange={handleRadioChange}
          />
        </div>
      </div>
      {value && coverMonth && (
        <CoverPurchaseDetails
          fees={fees}
          daiValue={value}
          claimEnd={coverMonth}
        />
      )}
      <RegularButton className="w-full mt-14 py-6 px-4 text-h6 uppercase font-bold">
        Approve Dai
      </RegularButton>
    </div>
  );
};
