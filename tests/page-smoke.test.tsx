import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LandingPage from "@/app/page";
import PresentationPage from "@/app/presentation/page";

describe("core page smoke", () => {
  it("renders the landing page demo CTA", () => {
    render(<LandingPage />);
    expect(screen.getByRole("heading", { name: "VineScout AI" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Demo with fictional vineyard portfolio/i })).toHaveAttribute("href", "/app");
    expect(screen.getByRole("link", { name: "Pitch deck" })).toHaveAttribute("href", "/presentation");
  });

  it("renders the pitch deck route", () => {
    const { container } = render(<PresentationPage />);
    expect(screen.getByRole("heading", { name: /China's wine import rebound/i })).toBeInTheDocument();
    expect(screen.getByText("Market / ICP")).toBeInTheDocument();
    expect(screen.getByText("AI Integration / Team")).toBeInTheDocument();
    expect(screen.getByText("chris + philipp")).toBeInTheDocument();
    expect(screen.getByText("01 / 04")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Next slide" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Previous slide" })).toHaveLength(2);
    expect(container.querySelectorAll(".pitch-slide")).toHaveLength(4);
  });
});
