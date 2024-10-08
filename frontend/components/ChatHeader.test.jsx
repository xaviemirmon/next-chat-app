import { render } from "@testing-library/react";
import { ChatHeader } from "./ChatHeader";
import { useUser } from "@/providers/UserProvider";

// Mocking the useUser hook
jest.mock("@/providers/UserProvider", () => ({
  useUser: jest.fn(),
}));

describe("ChatHeader component", () => {
  const mockSetLoading = jest.fn();
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Matches snapshot when user is logged in", () => {
    useUser.mockReturnValue({
      user: 1,
      logoutUser: jest.fn(),
    });

    const { asFragment } = render(
      <ChatHeader
        userName="Test User"
        setLoading={mockSetLoading}
        router={mockRouter}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("Matches snapshot when userName is undefined", () => {
    useUser.mockReturnValue({
      user: 1,
      logoutUser: jest.fn(),
    });

    const { asFragment } = render(
      <ChatHeader
        userName={undefined}
        setLoading={mockSetLoading}
        router={mockRouter}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("Matches snapshot when user is not logged in", () => {
    useUser.mockReturnValue({
      user: null,
      logoutUser: jest.fn(),
    });

    const { asFragment } = render(
      <ChatHeader
        userName="Test User"
        setLoading={mockSetLoading}
        router={mockRouter}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
