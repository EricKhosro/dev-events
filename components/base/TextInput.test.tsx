import { fireEvent, render, screen } from "@testing-library/react";
import TextInput from "./TextInput";

describe("TextInput", () => {
  it("renders label and placeholder", () => {
    const changeHandler = jest.fn();
    render(
      <TextInput
        label="Jest"
        name="jest-input"
        onChange={changeHandler}
        placeholder="Jest"
        value={"hello"}
      />,
    );
    expect(screen.getByText("Jest")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Jest")).toBeInTheDocument();
  });

  it("calls onChange when value changes", () => {
    const changeHandler = jest.fn();
    render(
      <TextInput
        label="Email"
        name="email"
        onChange={changeHandler}
        placeholder="you@example.com"
        value=""
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { name: "email", value: "erec@gmail.com" },
    });

    expect(changeHandler).toHaveBeenCalledWith("email", "erec@gmail.com");
  });
});
