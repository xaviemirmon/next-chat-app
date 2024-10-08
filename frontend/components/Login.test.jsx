import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";

jest.mock("@/providers/UserProvider");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Login component", () => {
  const mockUpdateUser = jest.fn();
  const mockRouterPush = jest.fn();
  const mockUserData = [
    { userId: 1, name: "Alice" },
    { userId: 2, name: "Bob" },
  ];

  beforeEach(() => {
    useUser.mockReturnValue({
      user: null, // Simulate no user logged in
      updateUser: mockUpdateUser,
    });
    useRouter.mockReturnValue({ push: mockRouterPush });
  });

  it("renders login prompt with user list", () => {
    render(<Login data={mockUserData} />);

    expect(screen.getByText("Login to Chat")).toBeInTheDocument();
  });

  it("calls updateUser and navigates to dashboard on button click", async () => {
    render(<Login data={mockUserData} />);

    const aliceButton = screen.getByText("Alice");
    fireEvent.click(aliceButton);

    expect(mockUpdateUser).toHaveBeenCalledWith(1); // Call updateUser with Alice's userId
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/dashboard"); // Ensure navigation to dashboard
    });
  });

  it("does not render anything if user is logged in", () => {
    useUser.mockReturnValue({
      user: { id: 1, name: "Alice" }, // Simulate logged-in user
      updateUser: mockUpdateUser,
    });

    const { container } = render(<Login data={mockUserData} />);

    expect(container).toBeEmptyDOMElement(); // No elements should be rendered
  });
});
