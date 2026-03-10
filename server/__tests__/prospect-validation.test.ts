import { validateProspect } from "../prospect-helpers";

describe("prospect creation validation", () => {
  test("rejects a blank company name", () => {
    const result = validateProspect({
      companyName: "",
      roleTitle: "Software Engineer",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Company name is required");
  });

  test("rejects a blank role title", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Role title is required");
  });

  test("accepts a valid prospect without salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts a valid prospect with salary fields", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salaryCurrency: "USD",
      salaryAmount: 150000,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe("salary input validation", () => {
  test("accepts null salary amount", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salaryAmount: null,
    });

    expect(result.valid).toBe(true);
  });

  test("accepts undefined salary fields", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
    });

    expect(result.valid).toBe(true);
  });

  test("accepts zero salary amount", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salaryAmount: 0,
    });

    expect(result.valid).toBe(true);
  });

  test("rejects negative salary amount", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salaryAmount: -50000,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Salary must be a positive number");
  });

  test("rejects non-integer salary amount", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salaryAmount: 75000.5,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Salary amount must be a whole number");
  });

  test("rejects string as salary amount", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salaryAmount: "120000" as unknown,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Salary amount must be a whole number");
  });

  test("rejects non-string salary currency", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salaryCurrency: 123 as unknown,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Salary currency must be a string");
  });

  test("accepts null salary currency", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salaryCurrency: null,
    });

    expect(result.valid).toBe(true);
  });

  test("accepts any currency string", () => {
    const currencies = ["USD", "EUR", "GBP", "JPY", "CAD"];
    for (const currency of currencies) {
      const result = validateProspect({
        companyName: "Google",
        roleTitle: "Software Engineer",
        salaryCurrency: currency,
        salaryAmount: 100000,
      });

      expect(result.valid).toBe(true);
    }
  });

  test("accepts large salary amounts", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "CEO",
      salaryAmount: 10000000,
      salaryCurrency: "USD",
    });

    expect(result.valid).toBe(true);
  });
});

describe("work arrangement validation", () => {
  test("accepts Remote work arrangement", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      workArrangement: "Remote",
    });

    expect(result.valid).toBe(true);
  });

  test("accepts Hybrid work arrangement", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      workArrangement: "Hybrid",
    });

    expect(result.valid).toBe(true);
  });

  test("accepts Onsite work arrangement", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      workArrangement: "Onsite",
    });

    expect(result.valid).toBe(true);
  });

  test("accepts null work arrangement", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      workArrangement: null,
    });

    expect(result.valid).toBe(true);
  });

  test("accepts undefined work arrangement", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
    });

    expect(result.valid).toBe(true);
  });

  test("rejects invalid work arrangement", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      workArrangement: "PartTime",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Work arrangement must be one of: Remote, Hybrid, Onsite");
  });

  test("accepts valid prospect with all fields including work arrangement", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      workArrangement: "Remote",
      salaryAmount: 150000,
      salaryCurrency: "USD",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
