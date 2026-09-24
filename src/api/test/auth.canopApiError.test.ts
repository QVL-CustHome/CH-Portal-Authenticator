import { describe, expect, it } from "vitest";
import { CanopApiError } from "canopui";
import { ApiError } from "../auth";

describe("erreur d'API reexportee par le module auth", () => {
  it("ApiError est la classe CanopApiError de canopui", () => {
    expect(ApiError).toBe(CanopApiError);
  });
});
