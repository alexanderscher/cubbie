import { getPolicy } from "@/lib/getPolicy";
import { ReturnType } from "@/types/Return";
import { calculateReturnDate, formatDateToMMDDYY } from "@/utils/Date";
import React, { useEffect, useState } from "react";
import ReactSelect, { StylesConfig } from "react-select";

interface Option {
  value: number;
  label: string;
}

interface Props {
  type: number;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  color?: string;
  values: any;
  handleChange: any;
  comingfrom?: string;
}

const ReturnPolicySelect: React.FC<Props> = ({
  type,
  setFieldValue,
  handleChange,
  values,
  comingfrom,
}) => {
  const customGreenStyles: StylesConfig<Option, false> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#e2f1e2",
      borderColor: "rgb(6 78 59)",
      borderWidth: "1px",
      boxShadow: state.isFocused ? "0 0 0px .08px rgb(6 78 59)" : "none",
      "&:hover": {
        borderColor: "rgb(6 78 59)",
      },
      cursor: "pointer",
      padding: "3px ", // Example padding: 8px top and bottom, 12px left and right
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#e2f1e2",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#F1F5F9" : "#FFFFFF",
      color: "#000",
      "&:active": {
        backgroundColor: "#F1F5F9",
      },
      cursor: "pointer",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#a0aec0",
    }),
  };

  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  useEffect(() => {
    const fetchPolicy = async () => {
      setIsLoading(true);
      const policy = await getPolicy();
      if (policy.items) {
        setOptions(
          policy.items.map((item) => ({
            value: item.days,
            label: `${item.store} - ${item.days} days`,
          }))
        );
      }
      setIsLoading(false);
    };

    fetchPolicy();
  }, []);

  const handleSelectChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      setFieldValue("days_until_return", selectedOption.value as number);
    }
  };
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="w-full flex flex-col gap-2">
        <p className="text-sm text-emerald-900 ">Purchase Date</p>
        <div className="flex flex-col gap-2">
          <input
            className="w-full border-[1px] bg  p-2  border-emerald-900 rounded  focus:outline-none cursor-pointer"
            name="purchase_date"
            value={values.purchase_date}
            onChange={handleChange("purchase_date")}
            type="date"
            style={{ WebkitAppearance: "none" }}
          />
          {/* {errors.purchase_date && (
              <p className="text-orange-800 text-sm">{errors.purchase_date}</p>
            )} */}
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <p className="text-sm text-emerald-900 ">Days until return</p>

        <ReactSelect
          options={options}
          onChange={handleSelectChange}
          value={options.find((option) => option.value === type)}
          isClearable={true}
          placeholder="Select return policy"
          isLoading={isLoading}
          styles={customGreenStyles} // Ensure these styles are defined
        />
        {/* {errors.days_until_return && (
            <p className="text-orange-800 text-sm">
              {errors.days_until_return}
            </p>
          )} */}
      </div>

      <div className="w-full flex flex-col gap-2">
        <p className="text-emerald-900 text-sm">Return Date</p>
        <div className="w-full border-[1px] bg  p-2  border-emerald-900 rounded  focus:outline-none ">
          {formatDateToMMDDYY(
            calculateReturnDate(values.purchase_date, values.days_until_return)
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicySelect;
