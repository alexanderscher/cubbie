import React from "react";
import ReactSelect, { StylesConfig } from "react-select";

interface Option {
  value: string;
  label: string;
}

interface Props {
  type: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  color?: string;
}

const PurchaseTypeSelect: React.FC<Props> = ({
  type,
  setFieldValue,
  color = "green",
}) => {
  const customWhiteStyles: StylesConfig<Option, false> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#FFFFFF",
      borderColor: "rgb(148 163 184)",
      borderWidth: "1px",
      boxShadow: state.isFocused ? "0 0 0px .08px rgb(6 78 59)" : "none",
      "&:hover": {
        borderColor: "rgb(6 78 59)",
      },
      cursor: "pointer",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#FFFFFF",
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

  const options: Option[] = [
    { value: "Store", label: "Store" },
    { value: "Online", label: "Online" },
  ];

  const handleSelectChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      setFieldValue("type", selectedOption.value); // Assuming you want to validate on change
    }
  };

  return (
    <div className="w-full ">
      <p
        className={`${
          color === "green" ? "text-emerald-900" : "text-slate-400"
        } text-xs`}
      >
        Purchase Type
      </p>
      <ReactSelect
        options={options}
        onChange={handleSelectChange}
        value={options.find((option) => option.value === type)}
        isClearable={true}
        placeholder="Select type"
        styles={color === "green" ? customGreenStyles : customWhiteStyles}
      />
    </div>
  );
};

export default PurchaseTypeSelect;
