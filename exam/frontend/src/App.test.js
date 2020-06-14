import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders label value", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Enter some date/i);
  expect(linkElement).toBeInTheDocument();
});