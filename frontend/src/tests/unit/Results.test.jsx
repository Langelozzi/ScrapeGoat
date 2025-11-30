import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Results from "../../Results.jsx";

describe("Results (unit)", () => {
  it("shows no-data guard when scrapeData is missing", () => {
    render(
      <MemoryRouter initialEntries={["/results"]}>
        <Results />
      </MemoryRouter>
    );

    expect(screen.getByText(/no scrape data available/i)).toBeInTheDocument();
  });
});
