import { useState } from "react";

const isValid = str => {
  try {
    return JSON.parse(str) && true;
  } catch (e) {
    return false;
  }
};

export const useInput = initialValue => {
  const [value, setValue] = useState(initialValue);
  const [valid, setValid] = useState(false);

  return {
    value,
    valid,
    setValue,
    setValid,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: event => {
        setValid(isValid(event.target.value));
        setValue(event.target.value);
      }
    }
  };
};
