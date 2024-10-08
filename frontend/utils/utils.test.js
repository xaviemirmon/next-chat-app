import {
  isOnlyEmoji,
  handleKeyDown,
  formattedDate,
  formattedTime,
  dateToTimestamp,
} from "./utils";

describe("Utility Functions", () => {
  describe("isOnlyEmoji", () => {
    it("returns true for a string of emojis", () => {
      expect(isOnlyEmoji("😊😂")).toBe(true);
    });

    it("returns false for a string with text and emojis", () => {
      expect(isOnlyEmoji("Hello 😊")).toBe(false);
    });

    it("returns false for a string of text only", () => {
      expect(isOnlyEmoji("Hello")).toBe(false);
    });
  });

  describe("handleKeyDown", () => {
    it("calls the function when Enter key is pressed", () => {
      const mockFunc = jest.fn();
      const event = { key: "Enter" };
      handleKeyDown(event, mockFunc);
      expect(mockFunc).toHaveBeenCalled();
    });

    it("does not call the function for other keys", () => {
      const mockFunc = jest.fn();
      const event = { key: "Escape" };
      handleKeyDown(event, mockFunc);
      expect(mockFunc).not.toHaveBeenCalled();
    });
  });

  describe("formattedDate", () => {
    it("formats a valid date string", () => {
      const date = "2024-10-08T12:00:00Z";
      expect(formattedDate(date)).toBe("October 8, 2024");
    });

    it("returns an empty string for an undefined date", () => {
      expect(formattedDate(undefined)).toBe("");
    });
  });

  describe("formattedTime", () => {
    it("formats a valid date string to time", () => {
      const date = "2024-10-08T12:30:00Z";
      expect(formattedTime(date)).toBe("1:30 PM");
    });

    it("returns an empty string for an undefined date", () => {
      expect(formattedTime(undefined)).toBe("");
    });
  });

  describe("dateToTimestamp", () => {
    it("converts a valid date string to a timestamp", () => {
      const date = "2024-10-08T12:00:00Z";
      expect(dateToTimestamp(date)).toBe(1728388800);
    });
  });
});
