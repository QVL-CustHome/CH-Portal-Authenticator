import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Providers } from "./Providers";
import App from "../App";

vi.mock("../api/auth", { spy: true });

function renderAt(url: string) {
  return render(
    <Providers>
      <MemoryRouter initialEntries={[url]}>
        <App />
      </MemoryRouter>
    </Providers>
  );
}

describe("routage de l'application", () => {
  it("/ redirige vers la page de connexion", () => {
    renderAt("/");
    expect(
      screen.getByRole("heading", { name: "Connexion" })
    ).toBeInTheDocument();
  });

  it("une route inconnue retombe sur la connexion", () => {
    renderAt("/nimporte-quoi");
    expect(
      screen.getByRole("heading", { name: "Connexion" })
    ).toBeInTheDocument();
  });

  it("le layout affiche la marque CustHome", () => {
    renderAt("/login");
    expect(
      screen.getByRole("heading", { name: "CustHome" })
    ).toBeInTheDocument();
  });

  it("/register affiche la page d'inscription", () => {
    renderAt("/register");
    expect(
      screen.getByRole("heading", { name: "Créer un compte" })
    ).toBeInTheDocument();
  });
});
