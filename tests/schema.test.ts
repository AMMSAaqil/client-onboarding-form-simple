import { describe, it, expect } from "vitest";
import { onboardSchema } from "../lib/schema";

describe("onboardSchema", () => {
  it("accepts a valid payload", () => {
    const data = {
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      companyName: "Analytical Engines Ltd",
      services: ["UI/UX", "Web Dev"],
      budgetUsd: 50000,
      projectStartDate: "2099-09-01",
      acceptTerms: true
    };
    const parsed = onboardSchema.parse(data);
    expect(parsed).toBeTruthy();
  });

  it("rejects past start date", () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    const dateStr = past.toISOString().slice(0, 10);
    const res = onboardSchema.safeParse({
      fullName: "Alan Turing",
      email: "alan@example.com",
      companyName: "Bletchley Park",
      services: ["Branding"],
      projectStartDate: dateStr,
      acceptTerms: true
    });
    expect(res.success).toBe(false);
  });

  it("requires at least one service", () => {
    const res = onboardSchema.safeParse({
      fullName: "Grace Hopper",
      email: "grace@example.com",
      companyName: "COBOL Inc",
      services: [],
      projectStartDate: "2099-01-01",
      acceptTerms: true
    });
    expect(res.success).toBe(false);
  });
});