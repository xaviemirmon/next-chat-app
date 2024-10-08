import { render } from "@testing-library/react";
import { ChatFooter } from "./ChatFooter";
import { handleKeyDown } from "@/utils/utils";

// Mocking the utility function
jest.mock("@/utils/utils", () => ({
  handleKeyDown: jest.fn(),
}));

describe("ChatFooter component", () => {
  const mockSetInput = jest.fn();
  const mockSetMessages = jest.fn();
  const mockWs = { current: { send: jest.fn() } };
  const mockConnectionId = { current: 123 };
  const userId = 1;
  const targetId = 2;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Matches snapshot when input is empty", () => {
    const { asFragment } = render(
      <ChatFooter
        input=""
        setInput={mockSetInput}
        targetUserData={{ name: "Target User", userId: targetId }}
        setMessages={mockSetMessages}
        ws={mockWs}
        connectionId={mockConnectionId}
        user={userId}
        target={targetId}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("Matches snapshot when input has text", () => {
    const { asFragment } = render(
      <ChatFooter
        input="Hello"
        setInput={mockSetInput}
        targetUserData={{ name: "Target User", userId: targetId }}
        setMessages={mockSetMessages}
        ws={mockWs}
        connectionId={mockConnectionId}
        user={userId}
        target={targetId}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("Matches snapshot when targetUserData is undefined", () => {
    const { asFragment } = render(
      <ChatFooter
        input="Hello"
        setInput={mockSetInput}
        targetUserData={undefined}
        setMessages={mockSetMessages}
        ws={mockWs}
        connectionId={mockConnectionId}
        user={userId}
        target={targetId}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
