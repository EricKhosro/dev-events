import { fireEvent, render, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  test("renders the provided text", () => {
    render(<Button text="Save" onClick={() => {}} />);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const onClick = jest.fn();
    render(<Button text="Submit" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("shows loading indicator when loading", () => {
    const { container } = render(
      <Button text="Save" onClick={() => {}} loading />
    );
    expect(screen.queryByRole("button", { name: "Save" })).not.toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });
});
