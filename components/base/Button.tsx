import { JSX, MouseEvent } from "react";
import Loading from "./Loading";

interface IProps {
  text: string | JSX.Element;
  onClick: () => void;
  style?: "primary";
  loading?: boolean;
}

const Button = ({ onClick, style = "primary", text, loading }: IProps) => {
  const clickHandler = (e: MouseEvent) => {
    e.preventDefault();
    onClick();
  };
  return (
    <button
      className="bg-primary hover:bg-primary/90 w-full cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-lg font-semibold text-black"
      onClick={clickHandler}
    >
      {loading ? <Loading /> : text}
    </button>
  );
};

export default Button;
