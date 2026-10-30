import {
  budgetOptions,
  countryCodes,
  priorityOptions,
  projectTypes,
  timelineOptions,
} from "@/data/contact";

/** Everything the 5-step form collects. Shared by the form (client) and the API route (server). */
export interface ContactData {
  projectType: string;
  title: string;
  description: string;
  website: string;
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  company: string;
  timeline: string;
  budget: string;
  priority: string;
}

export type ContactErrors = Partial<Record<keyof ContactData, string>>;

export const EMPTY_CONTACT: ContactData = {
  projectType: "",
  title: "",
  description: "",
  website: "",
  name: "",
  email: "",
  countryCode: "+94",
  phone: "",
  company: "",
  timeline: "",
  budget: "",
  priority: "",
};

export const LIMITS = {
  title: 100,
  description: 500,
  website: 200,
  name: 80,
  email: 120,
  phone: 20,
  company: 100,
} as const;

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

function isOneOf(value: string, options: readonly string[]) {
  return options.includes(value);
}

function validUrl(value: string) {
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

/** Validates the fields that belong to one step (1-4). Step 5 is the review and has no fields. */
export function validateStep(step: number, data: ContactData): ContactErrors {
  const errors: ContactErrors = {};

  if (step === 1) {
    if (!isOneOf(data.projectType, projectTypes.map((t) => t.value))) {
      errors.projectType = "Please choose the type of project.";
    }
  }

  if (step === 2) {
    const title = data.title.trim();
    if (title.length < 3) errors.title = "Please add a project title.";
    else if (title.length > LIMITS.title) errors.title = `Keep it under ${LIMITS.title} characters.`;

    const description = data.description.trim();
    if (description.length < 20) errors.description = "Please describe your project in a few sentences (20+ characters).";
    else if (description.length > LIMITS.description) errors.description = `Keep it under ${LIMITS.description} characters.`;

    const website = data.website.trim();
    if (website && (website.length > LIMITS.website || !validUrl(website))) {
      errors.website = "Please enter a valid website address.";
    }
  }

  if (step === 3) {
    const name = data.name.trim();
    if (name.length < 2) errors.name = "Please enter your full name.";
    else if (name.length > LIMITS.name) errors.name = `Keep it under ${LIMITS.name} characters.`;

    const email = data.email.trim();
    if (!EMAIL.test(email) || email.length > LIMITS.email) errors.email = "Please enter a valid email address.";

    if (!isOneOf(data.countryCode, countryCodes.map((c) => c.code))) {
      errors.countryCode = "Please choose a country code.";
    }
    const digits = data.phone.replace(/[\s-]/g, "");
    if (!/^\d{6,14}$/.test(digits)) errors.phone = "Please enter a valid phone number.";

    if (data.company.trim().length > LIMITS.company) errors.company = `Keep it under ${LIMITS.company} characters.`;
  }

  if (step === 4) {
    if (!isOneOf(data.timeline, timelineOptions)) errors.timeline = "Please choose a timeframe.";
    if (!isOneOf(data.budget, budgetOptions)) errors.budget = "Please choose a budget range.";
    if (data.priority && !isOneOf(data.priority, priorityOptions)) errors.priority = "Please choose a priority.";
  }

  return errors;
}

/** Validates the whole request (used again on the server). */
export function validateAll(data: ContactData): ContactErrors {
  return { ...validateStep(1, data), ...validateStep(2, data), ...validateStep(3, data), ...validateStep(4, data) };
}

/** Keeps only the known string fields, so the server never trusts extra input. */
export function pickContactData(input: unknown): ContactData {
  const source = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const result = { ...EMPTY_CONTACT };
  for (const key of Object.keys(EMPTY_CONTACT) as (keyof ContactData)[]) {
    const value = source[key];
    if (typeof value === "string") result[key] = value;
  }
  return result;
}

/** First step that contains an error (to send the user back to it). */
export function firstInvalidStep(data: ContactData): number | null {
  for (const step of [1, 2, 3, 4]) {
    if (Object.keys(validateStep(step, data)).length) return step;
  }
  return null;
}
