"use client";

import Tabbox from "@/components/base/Tabbox";
import { ITab } from "@/shared/types/components.types";
import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import GithubButton from "@/components/GithubButton";
import { signIn } from "next-auth/react";

enum ActiveTab {
  Register,
  Login,
}

const FormsWrapper = () => {
  const [activeTab, setActiveTab] = useState(ActiveTab.Login);

  const tabs: ITab[] = [
    {
      index: ActiveTab.Register,
      title: "Register",
    },
    {
      index: ActiveTab.Login,
      title: "Login",
    },
  ];

  return (
    <div className="flex flex-col justify-start items-center w-full md:w-xl mx-auto">
      <Tabbox tabs={tabs} onChange={setActiveTab} activeTab={activeTab} />
      <form className="mt-10 flex flex-col justify-start items-start gap-8 w-full px-5">
        {activeTab === ActiveTab.Login ? (
          <LoginForm />
        ) : (
          <RegisterForm
            onSuccessfulRegister={() => setActiveTab(ActiveTab.Login)}
          />
        )}
        <div className="w-full -mt-3">
          <GithubButton
            onClick={() => {
              signIn("github");
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default FormsWrapper;
