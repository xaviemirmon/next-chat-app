import { render, screen, waitFor } from "@testing-library/react";
import Chat from "./Chat";
import { useUser } from "@/providers/UserProvider";
import { fetchData } from "@/lib/fetchData";
import { useRouter } from "next/navigation";
import { WebSocket } from "mock-socket"; // Mock WebSocket
import { act } from "react";

jest.mock("@/providers/UserProvider");
jest.mock("@/lib/fetchData");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Chat component", () => {
  const mockRouterPush = jest.fn();
  const mockUser = { id: 1, name: "Test User" };

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockRouterPush });
    useUser.mockReturnValue({ user: mockUser });
    fetchData.mockResolvedValue([]);
  });

  it("Redirects to homepage if user is not logged in", async () => {
    useUser.mockReturnValue({ user: null });

    render(<Chat target={2} apiUrl="api.test.com" />);

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/");
    });
  });

  it("Fetches initial data and displays ChatHeader and ChatFooter", async () => {
    const connectionsMock = [
      {
        userId: 2,
        connectionId: 123,
        createdAt: "2024-10-08T12:00:00Z",
      },
    ];

    fetchData.mockImplementation((url) => {
      if (url.includes("connections")) {
        return Promise.resolve(connectionsMock);
      }
      if (url.includes("user")) {
        return Promise.resolve({ name: "Test Target", userId: 2 });
      }
      if (url.includes("messages")) {
        return Promise.resolve([]);
      }
      return Promise.resolve([]);
    });

    render(<Chat target={2} apiUrl="api.test.com" />);

    await waitFor(() => {
      expect(screen.getByText("Test Target")).toBeInTheDocument(); // ChatHeader
      expect(screen.getByText(/You matched/)).toBeInTheDocument(); // Connection data
      expect(screen.getByRole("textbox")).toBeInTheDocument(); // ChatFooter input
    });
  });

  it("Handles WebSocket message updates", async () => {
    const mockWebSocket = new WebSocket("ws://api.test.com");
    global.WebSocket = jest.fn(() => mockWebSocket);

    render(<Chat target={2} apiUrl="api.test.com" />);

    act(() => {
      mockWebSocket.onmessage({
        data: JSON.stringify({
          createdAt: "2024-10-08T12:01:00Z",
          content: "New message",
          senderId: 2,
        }),
      });
    });

    await waitFor(() => {
      expect(screen.getByText("New message")).toBeInTheDocument();
    });
  });
});
