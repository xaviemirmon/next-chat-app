import { render } from "@testing-library/react";

import { Button } from "./Button";

describe("Primary button", () => {
  it("Matches snapshot without icon", () => {
    const { asFragment } = render(<Button>Test</Button>);
    expect(asFragment()).toMatchSnapshot();
  });
  it("Matches snapshot with icon", () => {
    const { asFragment } = render(<Button variant="icon">Button</Button>);
    expect(asFragment()).toMatchSnapshot();
  });
});
