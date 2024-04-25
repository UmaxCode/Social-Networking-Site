import { ChangeEvent, useState } from "react";

export const useFormBinding = (initialFormInput: any): any => {
  const [formInput, setFormInput] = useState(initialFormInput);
  const [formErrors, setFormErrors] = useState(initialFormInput);

  const onFormChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormInput({ ...formInput, [name]: value });
  };

  const validator = (data: any) => {
    const formValidation: any = {};

    if (data.fullname?.length === 0) {
      formValidation.fullname = "fullname is required.";
    } else if (Number(data.fullname)) {
      formValidation.fullname = "fullname cannot be a number.";
    } else if (
      data.username
        ? data.fullname.length > 0 && data.fullname?.length < 3
        : null
    ) {
      formValidation.fullname = "Length of fullname must be greater than 3.";
    } else if (data.fullname?.split(" ").length === 1) {
      formValidation.fullname = "fullname must be separated by space";
    }

    if (data.username?.length === 0) {
      formValidation.username = "username is required.";
    } else if (Number(data.username)) {
      formValidation.username = "username cannot be a number.";
    } else if (
      data.username
        ? data.username.length > 0 && data.username?.length < 3
        : null
    ) {
      formValidation.username = "Length of username must be greater than 3.";
    }

    if (data.email?.length === 0) {
      formValidation.email = "email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(data.email as string);
      if (!isValidEmail) {
        formValidation.email = "invalid Email.";
      }
    }

    if (data.password?.length === 0) {
      formValidation.password = "password is required.";
    } else if (data.password ? data.password.length < 8 : null) {
      formValidation.password = "password must be more 7 characters.";
    } else {
      if (data.conpassword?.length === 0) {
        formValidation.conpassword = "password confirmation required.";
      } else if (
        data.conpassword?.length &&
        data.conpassword !== data.password
      ) {
        formValidation.conpassword = "passwords do not match.";
      }
    }

    if (Object.keys(formValidation).length) {
      setFormErrors(formValidation);
      return false;
    }
    setFormErrors(formValidation);

    return true;
  };

  return [formInput, setFormInput, validator, onFormChangeInput, formErrors];
};
