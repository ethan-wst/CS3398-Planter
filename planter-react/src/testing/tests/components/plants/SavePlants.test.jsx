import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SavePlants from "../pages/SavePlants";

// Mock Firebase authentication
vi.mock("../firebaseConfig", () => ({
  auth: {
    currentUser: {
      uid: "mockUser123", // Fake user ID for testing
    },
  },
}));

test("saves a plant successfully and shows confirmation", async () => {
  render(<SavePlants plant={{ id: 1, common_name: "Rose", scientific_name: ["Rosa"] }} />);

  const saveButton = screen.getByRole("button", { name: /save/i });
  fireEvent.click(saveButton);

  //Use waitFor to ensure the success message appears
  await waitFor(() => {
    expect(screen.getByText(/Plant saved successfully!/i)).toBeInTheDocument();
  });
});

