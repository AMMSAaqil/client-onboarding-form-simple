"use client";

import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardSchema, type OnboardValues } from "@/lib/schema";
import { SERVICES, type Service } from "@/lib/services";
import Alert from "@/components/Alert";
import { useSearchParams } from "next/navigation";

export default function OnboardPage() {
  const searchParams = useSearchParams();

  const prefillServices = useMemo(() => {
    const svc1 = searchParams.get("service");
    const svcs = searchParams.getAll("services");
    const raw = [svc1, ...svcs].filter(Boolean) as string[];
    const valid = raw.filter((s) => (SERVICES as readonly string[]).includes(s));
    return Array.from(new Set(valid)) as Service[];
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<OnboardValues>({
    resolver: zodResolver(onboardSchema),
    defaultValues: {
      fullName: "",
      email: "",
      companyName: "",
      services: [],
      budgetUsd: undefined,
      projectStartDate: "",
      acceptTerms: false
    }
  });

  useEffect(() => {
    if (prefillServices.length) {
      setValue("services", prefillServices, { shouldValidate: true });
    }
  }, [prefillServices, setValue]);

  const [successData, setSuccessData] = useState<OnboardValues | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit: SubmitHandler<OnboardValues> = async (values) => {
    setErrorMsg(null);
    setSuccessData(null);

    const url = process.env.NEXT_PUBLIC_ONBOARD_URL;
    if (!url) {
      setErrorMsg("Missing NEXT_PUBLIC_ONBOARD_URL environment variable.");
      return;
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      if (res.ok) {
        setSuccessData(values);
      } else {
        const text = await res.text().catch(() => "");
        setErrorMsg(text || `Request failed with status ${res.status}`);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Network error. Please try again.");
    }
  };

  const selected = watch("services");
  const toggleService = (svc: Service) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const next = checked ? Array.from(new Set([...(selected || []), svc])) : (selected || []).filter(s => s !== svc);
    setValue("services", next, { shouldValidate: true });
  };

  return (
    <main className="card" aria-describedby="form-desc">
      <h1 className="h1">Client Onboarding Form</h1>
      <p id="form-desc" className="p">Fill in the details below. All validations run on submit. Your data will be posted to the configured external endpoint.</p>

      {errorMsg && (
        <Alert kind="error" title="Submission failed">{errorMsg}</Alert>
      )}

      {successData && (
        <Alert kind="success" title="Submitted successfully!">
          <div className="summary">
            <div><strong>Name:</strong> {successData.fullName}</div>
            <div><strong>Email:</strong> {successData.email}</div>
            <div><strong>Company:</strong> {successData.companyName}</div>
            <div><strong>Services:</strong> {successData.services.join(", ")}</div>
            <div><strong>Budget (USD):</strong> {successData.budgetUsd ?? "—"}</div>
            <div><strong>Start date:</strong> {successData.projectStartDate}</div>
            <div><strong>Accepted terms:</strong> {successData.acceptTerms ? "Yes" : "No"}</div>
          </div>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input id="fullName" type="text" autoComplete="name" placeholder="Ada Lovelace" {...register("fullName")} />
          {errors.fullName && <div className="error">{errors.fullName.message}</div>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" placeholder="ada@example.com" {...register("email")} />
          {errors.email && <div className="error">{errors.email.message}</div>}
        </div>

        <div className="field">
          <label htmlFor="companyName">Company name</label>
          <input id="companyName" type="text" placeholder="Analytical Engines Ltd" {...register("companyName")} />
          {errors.companyName && <div className="error">{errors.companyName.message}</div>}
        </div>

        <div className="field">
          <label>Services interested in</label>
          <div className="checkbox-grid" role="group" aria-label="Services">
            {SERVICES.map((svc) => (
              <label key={svc} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={selected?.includes(svc) ?? false}
                  onChange={toggleService(svc)}
                  aria-checked={selected?.includes(svc) ?? false}
                />
                <span>{svc}</span>
              </label>
            ))}
          </div>
          <div className="helper">Choose one or more.</div>
          {errors.services && <div className="error">{errors.services.message as string}</div>}
        </div>

        <div className="field">
          <label htmlFor="budgetUsd">Budget (USD) <span className="helper">(optional)</span></label>
          <input
            id="budgetUsd"
            type="number"
            inputMode="numeric"
            placeholder="50000"
            {...register("budgetUsd", {
              setValueAs: (v) => (v === "" || v === null ? undefined : Number(v))
            })}
          />
          {errors.budgetUsd && <div className="error">{errors.budgetUsd.message}</div>}
        </div>

        <div className="field">
          <label htmlFor="projectStartDate">Project start date</label>
          <input id="projectStartDate" type="date" {...register("projectStartDate")} />
          {errors.projectStartDate && <div className="error">{errors.projectStartDate.message}</div>}
        </div>

        <div className="field" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input id="acceptTerms" type="checkbox" {...register("acceptTerms")} />
          <label htmlFor="acceptTerms" style={{ margin: 0 }}>I accept the terms</label>
        </div>
        {errors.acceptTerms && <div className="error">{errors.acceptTerms.message as string}</div>}

        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Submit"}
          </button>
          <button type="button" onClick={() => reset()} disabled={isSubmitting}>
            Reset
          </button>
        </div>
      </form>
    </main>
  );
}