"use client";

import Button from "@/components/base/Button";
import TextInput from "@/components/base/TextInput";
import { ILoginDTO } from "@/shared/types/auth.types";
import { BaseUrl } from "@/shared/utils/env.utils";
import { sanitizeRedirectUrl } from "@/shared/utils/redirect.utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [formValues, setFormValues] = useState({} as ILoginDTO);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParam = useSearchParams();

  const changeHandler = (name: string, value: any) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const authRequest = async () => {
    const response = await fetch(`${BaseUrl}/api/auth/signin`, {
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
    const redirectURL = searchParam.get("redirect") || "/";
    toast
      .promise(authRequest, {
        loading: "Logging-in...",
        success: ({ message }: { message: string }) => <b>{message}</b>,
        error: ({ message }: { message: string }) => <b>{message}</b>,
      })
      .then(() => {
        router.push(sanitizeRedirectUrl(redirectURL));
        router.refresh();
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
        label="Password"
        name="password"
        onChange={changeHandler}
        placeholder="Enter your password"
        value={formValues.password}
        type="password"
      />

      <Button onClick={submitHandler} text="Login" loading={loading} />
    </>
  );
};

export default LoginForm;
