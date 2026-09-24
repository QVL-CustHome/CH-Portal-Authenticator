import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Providers } from "./Providers";
import App from "../App";

vi.mock("../api/auth", { spy: true });

const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/pending",
  "/cgu",
];

function renderAt(url: string) {
  return render(
    <Providers>
      <MemoryRouter initialEntries={[url]}>
        <App />
      </MemoryRouter>
    </Providers>
  );
}

function decorativeShapeLayer(container: HTMLElement) {
  return container.querySelector<HTMLElement>("main > [aria-hidden='true']");
}

describe("fond du layout d'authentification", () => {
  it.each(authRoutes)("%s rend le calque decoratif de formes", (url) => {
    const { container } = renderAt(url);

    const layer = decorativeShapeLayer(container);

    expect(layer).not.toBeNull();
    expect(layer!.children.length).toBeGreaterThan(0);
    expect(layer!.querySelector("svg path")).not.toBeNull();
  });

  it.each(authRoutes)("%s ne rend aucune video de fond", (url) => {
    const { container } = renderAt(url);

    expect(container.querySelector("video")).toBeNull();
    expect(document.querySelector("video")).toBeNull();
  });
});
