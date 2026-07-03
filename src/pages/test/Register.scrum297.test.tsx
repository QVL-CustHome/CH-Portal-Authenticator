import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Providers } from "../../test/Providers";
import Register from "../Register";
import { TERMS_VERSION } from "../../lib/termsVersion";

const CONSENT_LABEL = /j'ai lu et j'accepte les conditions générales d'utilisation/i;
const CGU_LINK = /conditions générales d'utilisation/i;
const SUBMIT = /créer le compte/i;
const STRONG_PASSWORD = "Secret123!";

function jsonResponse(status: number, body?: unknown) {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

interface RegisterStub {
  fetchMock: ReturnType<typeof vi.fn>;
  registerBody: () => string | undefined;
  registerCalled: () => boolean;
}

function stubAuthFetch(registerResponse: () => Response): RegisterStub {
  let body: string | undefined;
  let called = false;
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.endsWith("/settings/registration")) {
      return jsonResponse(200, { enabled: true });
    }
    if (url.endsWith("/register")) {
      called = true;
      body = init?.body as string;
      return registerResponse();
    }
    return jsonResponse(200, {});
  });
  vi.stubGlobal("fetch", fetchMock);
  return { fetchMock, registerBody: () => body, registerCalled: () => called };
}

function renderRegister() {
  return render(
    <Providers>
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<p>page login</p>} />
          <Route path="/cgu" element={<p>page cgu</p>} />
        </Routes>
      </MemoryRouter>
    </Providers>
  );
}

async function fillValidFields() {
  const user = userEvent.setup({ delay: null });
  await screen.findByLabelText(/^nom/i);
  await user.type(screen.getByLabelText(/^nom/i), "Martin");
  await user.type(screen.getByLabelText(/^email/i), "nouveau@custhome.fr");
  await user.type(screen.getByLabelText(/^mot de passe/i), STRONG_PASSWORD);
  await user.type(screen.getByLabelText(/confirmation/i), STRONG_PASSWORD);
  return user;
}

function consentCheckbox() {
  return screen.getByRole("checkbox", { name: CONSENT_LABEL }) as HTMLInputElement;
}

function checkboxErrorMessage(): string | null {
  const describedBy = consentCheckbox().getAttribute("aria-describedby");
  if (!describedBy) return null;
  return document.getElementById(describedBy.split(" ")[0])?.textContent ?? null;
}

function submitForm() {
  const form = screen.getByRole("button", { name: SUBMIT }).closest("form");
  fireEvent.submit(form as HTMLFormElement);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

beforeEach(() => {
  stubAuthFetch(() => jsonResponse(201, {}));
});

describe("SCRUM-297 AC1 checkbox et lien CGU sur la page d'inscription", () => {
  it("la checkbox d'acceptation n'est pas pre-cochee par defaut", async () => {
    renderRegister();
    await screen.findByLabelText(/^nom/i);
    expect(consentCheckbox()).not.toBeChecked();
  });

  it("affiche le libelle complet d'acceptation des CGU", async () => {
    renderRegister();
    await screen.findByLabelText(/^nom/i);
    expect(screen.getByRole("checkbox", { name: CONSENT_LABEL })).toBeInTheDocument();
  });

  it("expose conditions generales d'utilisation comme lien vers /cgu", async () => {
    renderRegister();
    await screen.findByLabelText(/^nom/i);
    const link = screen.getByRole("link", { name: CGU_LINK });
    expect(link).toHaveAttribute("href", "/cgu");
  });

  it("ouvre le lien CGU dans un nouvel onglet avec rel noopener", async () => {
    renderRegister();
    await screen.findByLabelText(/^nom/i);
    const link = screen.getByRole("link", { name: CGU_LINK });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel") ?? "").toMatch(/noopener/);
  });

  it("le clic sur le lien CGU ne coche pas la case", async () => {
    renderRegister();
    await screen.findByLabelText(/^nom/i);
    const checkbox = consentCheckbox();
    const link = screen.getByRole("link", { name: CGU_LINK });
    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(checkbox.checked).toBe(false);
  });

  it("le clic sur le lien CGU n'est pas intercepte (defaultPrevented false)", async () => {
    renderRegister();
    await screen.findByLabelText(/^nom/i);
    const link = screen.getByRole("link", { name: CGU_LINK });
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });
});

describe("SCRUM-297 AC5 une case egale un objet", () => {
  it("ne presente qu'une seule checkbox dediee a l'acceptation des CGU", async () => {
    renderRegister();
    await screen.findByLabelText(/^nom/i);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(1);
    expect(checkboxes[0]).toHaveAccessibleName(CONSENT_LABEL);
  });
});

describe("SCRUM-297 AC2 blocage de la soumission sans consentement", () => {
  it("garde le bouton desactive tant que la case n'est pas cochee", async () => {
    renderRegister();
    const user = await fillValidFields();
    expect(screen.getByRole("button", { name: SUBMIT })).toBeDisabled();
    await user.click(consentCheckbox());
    await waitFor(() => {
      expect(screen.getByRole("button", { name: SUBMIT })).toBeEnabled();
    });
  });

  it("ne declenche aucun appel reseau register quand on force la soumission sans consentement", async () => {
    const stub = stubAuthFetch(() => jsonResponse(201, {}));
    renderRegister();
    await fillValidFields();
    submitForm();
    await waitFor(() => {
      expect(checkboxErrorMessage()).toBeTruthy();
    });
    expect(stub.registerCalled()).toBe(false);
  });

  it("affiche un message d'erreur accessible associe a la checkbox sur soumission forcee", async () => {
    renderRegister();
    await fillValidFields();
    submitForm();
    await waitFor(() => {
      expect(consentCheckbox()).toHaveAttribute("aria-invalid", "true");
    });
    expect(consentCheckbox()).toHaveAttribute("aria-describedby");
    expect(checkboxErrorMessage()).toBeTruthy();
  });
});

describe("SCRUM-297 AC3 payload et traitement des 422 lies aux CGU", () => {
  it("envoie accepted_terms_version egal a TERMS_VERSION a la soumission valide", async () => {
    const stub = stubAuthFetch(() => jsonResponse(201, {}));
    renderRegister();
    const user = await fillValidFields();
    await user.click(consentCheckbox());
    await user.click(screen.getByRole("button", { name: SUBMIT }));
    await waitFor(() => expect(stub.registerBody()).toBeTruthy());
    const payload = JSON.parse(stub.registerBody() as string);
    expect(payload.accepted_terms_version).toBe(TERMS_VERSION);
  });

  it("affiche un message sur la checkbox sur un 422 terms_not_accepted", async () => {
    stubAuthFetch(() => jsonResponse(422, { error: "terms_not_accepted" }));
    renderRegister();
    const user = await fillValidFields();
    await user.click(consentCheckbox());
    await user.click(screen.getByRole("button", { name: SUBMIT }));
    await waitFor(() => {
      expect(consentCheckbox()).toHaveAttribute("aria-invalid", "true");
    });
    expect(checkboxErrorMessage()).toBeTruthy();
  });

  it("affiche un message dedie sur la checkbox sur un 422 terms_version_mismatch", async () => {
    stubAuthFetch(() => jsonResponse(422, { error: "terms_version_mismatch" }));
    renderRegister();
    const user = await fillValidFields();
    await user.click(consentCheckbox());
    await user.click(screen.getByRole("button", { name: SUBMIT }));
    await waitFor(() => {
      expect(consentCheckbox()).toHaveAttribute("aria-invalid", "true");
    });
    expect(checkboxErrorMessage()).toBeTruthy();
  });

  it("distingue le message de terms_version_mismatch de celui de terms_not_accepted", async () => {
    stubAuthFetch(() => jsonResponse(422, { error: "terms_not_accepted" }));
    const first = renderRegister();
    let user = await fillValidFields();
    await user.click(consentCheckbox());
    await user.click(screen.getByRole("button", { name: SUBMIT }));
    await waitFor(() => expect(checkboxErrorMessage()).toBeTruthy());
    const notAcceptedMessage = checkboxErrorMessage();
    first.unmount();

    stubAuthFetch(() => jsonResponse(422, { error: "terms_version_mismatch" }));
    renderRegister();
    user = await fillValidFields();
    await user.click(consentCheckbox());
    await user.click(screen.getByRole("button", { name: SUBMIT }));
    await waitFor(() => expect(checkboxErrorMessage()).toBeTruthy());
    expect(checkboxErrorMessage()).not.toBe(notAcceptedMessage);
  }, 15000);
});

describe("SCRUM-297 AC4 accessibilite du champ de consentement", () => {
  it("associe un nom accessible a la checkbox via son libelle", async () => {
    renderRegister();
    await screen.findByLabelText(/^nom/i);
    expect(consentCheckbox()).toHaveAccessibleName(CONSENT_LABEL);
  });

  it("associe le message d'erreur a la checkbox via aria-describedby et aria-invalid", async () => {
    renderRegister();
    await fillValidFields();
    submitForm();
    await waitFor(() => {
      expect(consentCheckbox()).toHaveAttribute("aria-invalid", "true");
    });
    const describedBy = consentCheckbox().getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const messageEl = document.getElementById((describedBy as string).split(" ")[0]);
    expect(messageEl).not.toBeNull();
    expect(messageEl?.textContent?.trim().length).toBeGreaterThan(0);
  });
});
