import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LandingPage from "@/app/page";

describe("core page smoke", () => {
  it("renders the landing page demo CTA", () => {
    render(<LandingPage />);
    expect(screen.getByRole("heading", { name: "VineScout AI" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Demo with fictional vineyard portfolio/i })).toHaveAttribute("href", "/app");
  });
});
