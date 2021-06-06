import React from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { Controller } from "react-hook-form";

export default function InputCheckbox({ form, name, label, defaultValue }) {
  const control = (
    <Controller
      {...{
        name,
        control: form.control,
        defaultValue,
        render({ field: { value, onChange, ...rest } }) {
          return (
            <Checkbox
              {...{
                size: "small",
                checked: value ?? defaultValue ?? false,
                ...rest,
                onChange: (e) => onChange(e.target.checked),
              }}
            />
          );
        },
      }}
    />
  );
  return <FormControlLabel {...{ label, control }} />;
}
