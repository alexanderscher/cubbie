import { getPolicy } from "@/lib/getPolicy";
import { ReturnType } from "@/types/Return";
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
}

const ReturnPolicySelect: React.FC<Props> = ({ type, setFieldValue }) => {
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

  useEffect(() => {
    const fetchPolicy = async () => {
      const policy = await getPolicy();
      if (policy.items) {
        setOptions(
          policy.items.map((item) => ({
            value: item.days,
            label: item.store,
          }))
        );
      }
    };

    fetchPolicy();
  }, []);

  const handleSelectChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      setFieldValue("days_until_return", selectedOption.value as number);
    }
  };
  return (
    <div className="w-full">
      <ReactSelect
        options={options}
        onChange={handleSelectChange}
        value={options.find((option) => option.value === type)} // 'type' should be a number here
        isClearable={true}
        placeholder="Select return policy"
        styles={customGreenStyles} // Ensure these styles are defined
      />
    </div>
  );
};

export default ReturnPolicySelect;
