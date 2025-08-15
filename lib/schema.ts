

import { z } from "zod";
import { SERVICES } from "@/lib/services";

const nameRegex = /^[A-Za-z][A-Za-z'\- ]+$/;

function isTodayOrLater(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return d0 >= t0;
}

export const onboardSchema = z.object({
  fullName: z
    .string({ required_error: "Full name is required" })
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name must be at most 80 characters")
    .regex(nameRegex, "Only letters, spaces, ' and - are allowed, and must start with a letter"),

  email: z
    .string({ required_error: "Email is required" })
    .email("Enter a valid email"),

  companyName: z
    .string({ required_error: "Company name is required" })
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be at most 100 characters"),

  services: z
    .array(z.enum(SERVICES), {
      required_error: "Select at least one service"
    })
    .min(1, "Select at least one service"),

  budgetUsd: z
    .number({
      invalid_type_error: "Budget must be a number"
    })
    .int("Budget must be an integer")
    .gte(100, "Minimum budget is 100")
    .lte(1_000_000, "Maximum budget is 1,000,000")
    .optional(),

  projectStartDate: z
    .string({ required_error: "Project start date is required" })
    .refine((v) => !Number.isNaN(Date.parse(v)), { message: "Enter a valid date" })
    .refine(isTodayOrLater, { message: "Start date must be today or later" }),

  acceptTerms: z.boolean({ required_error: "You must accept the terms" }).refine((val) => val === true, {
    message: "You must accept the terms"
  })
});

export type OnboardValues = z.infer<typeof onboardSchema>;
