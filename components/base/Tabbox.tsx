import { ITab } from "@/shared/types/components.types";
import React from "react";

interface IProps {
  tabs: ITab[];
  onChange: (index: number) => void;
  activeTab: number;
}

const Tabbox = ({ onChange, tabs, activeTab }: IProps) => {
  return (
    <div className="w-full flex flex-row justify-start items-center rounded text-white font-semibold">
      {tabs.map((tab) => (
        <div
          key={tab.title + tab.index}
          onClick={() => onChange(tab.index)}
          className={`flex-1 flex justify-center items-center text-center p-2 cursor-pointer border-b transition-all duration-300 ${
            activeTab === tab.index
              ? "text-primary border-primary"
              : "border-white"
          }`}
        >
          {tab.title}
        </div>
      ))}
    </div>
  );
};

export default Tabbox;
