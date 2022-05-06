import { render, screen } from "@testing-library/react";
import { App } from "./App";

it("renders", () => {
  render(<App />);
  const heading = screen.getByText("Regex Builder");
  expect(heading).toBeInTheDocument();
});
