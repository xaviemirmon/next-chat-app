import { render } from "@testing-library/react";
import { Message } from "./Message";
import { isOnlyEmoji } from "@/utils/utils";

// Mocking the utility function
jest.mock("@/utils/utils", () => ({
  isOnlyEmoji: jest.fn(),
}));

describe("Message component", () => {
  const userId = 1;

  it("Matches snapshot for user message", () => {
    const message = {
      content: "Hello!",
      senderId: userId,
      createdAt: new Date().toISOString(),
    };

    const { asFragment } = render(
      <Message message={message} user={userId} grouped={false} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("Matches snapshot for sender message", () => {
    const message = {
      content: "Hi there!",
      senderId: 2,
      createdAt: new Date().toISOString(),
    };

    const { asFragment } = render(
      <Message message={message} user={userId} grouped={false} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("Matches snapshot for emoji-only message", () => {
    const message = {
      content: "😊",
      senderId: 2,
      createdAt: new Date().toISOString(),
    };

    isOnlyEmoji.mockReturnValue(true);

    const { asFragment } = render(
      <Message message={message} user={userId} grouped={false} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("Matches snapshot for grouped messages", () => {
    const message = {
      content: "This is a grouped message.",
      senderId: 2,
      createdAt: new Date().toISOString(),
    };

    const { asFragment } = render(
      <Message message={message} user={userId} grouped={true} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("Matches snapshot for non-emoji message", () => {
    const message = {
      content: "How are you?",
      senderId: 2,
      createdAt: new Date().toISOString(),
    };

    isOnlyEmoji.mockReturnValue(false);

    const { asFragment } = render(
      <Message message={message} user={userId} grouped={false} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
