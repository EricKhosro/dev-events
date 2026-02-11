import Button from "@/components/base/Button";
import TextInput from "@/components/base/TextInput";
import { IRegisterDTO } from "@/shared/types/auth.types";
import { BaseUrl } from "@/shared/utils/env.utils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface IProps {
  onSuccessfulRegister: () => void;
}

const RegisterForm = ({ onSuccessfulRegister }: IProps) => {
  const [formValues, setFormValues] = useState({} as IRegisterDTO);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const changeHandler = (name: string, value: any) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const authRequest = async () => {
    const response = await fetch(`${BaseUrl}/api/auth/signup`, {
      method: "POST",
      body: JSON.stringify(formValues),
      headers: {
        "content-type": "application/json",
      },
    });
    const status = response.status;
    const data = await response.json();
    if (status !== 200) throw Error(data.message);
    return data;
  };

  const submitHandler = async () => {
    setLoading(true);
    toast
      .promise(authRequest, {
        loading: "Registering...",
        success: ({ message }: { message: string }) => <b>{message}</b>,
        error: ({ message }: { message: string }) => <b>{message}</b>,
      })
      .then(() => {
        onSuccessfulRegister();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <TextInput
        label="Username"
        name="username"
        onChange={changeHandler}
        placeholder="Enter your username"
        value={formValues.username}
      />
      <TextInput
        label="Email"
        name="email"
        onChange={changeHandler}
        placeholder="Enter your email"
        value={formValues.email}
      />
      <TextInput
        label="Password"
        name="password"
        onChange={changeHandler}
        placeholder="Enter your password"
        value={formValues.password}
        type="password"
      />
      <TextInput
        label="Re-Password"
        name="rePassword"
        onChange={changeHandler}
        placeholder="Enter repeat password"
        value={formValues.rePassword}
        type="password"
      />
      <Button onClick={submitHandler} text="Register" loading={loading} />
    </>
  );
};

export default RegisterForm;
