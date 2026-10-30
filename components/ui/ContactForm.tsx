"use client";

import { useRef, useState, type ComponentType, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  AppWindow,
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  Code,
  Database,
  Ellipsis,
  FileText,
  Globe,
  LoaderCircle,
  Lock,
  Mail,
  Monitor,
  Pencil,
  PenTool,
  Phone,
  Target,
  Type,
  User,
  type LucideProps,
} from "lucide-react";
import {
  budgetOptions,
  contactSection,
  contactSteps,
  countryCodes,
  priorityOptions,
  projectTypes,
  timelineOptions,
} from "@/data/contact";
import {
  EMPTY_CONTACT,
  LIMITS,
  firstInvalidStep,
  validateStep,
  type ContactData,
  type ContactErrors,
} from "@/lib/contact";

gsap.registerPlugin(useGSAP);

const TOTAL = contactSteps.length;
const TYPE_ICONS: Record<string, ComponentType<LucideProps>> = {
  monitor: Monitor,
  pen: PenTool,
  code: Code,
  database: Database,
  app: AppWindow,
  more: Ellipsis,
};

const control =
  "w-full rounded-lg border bg-white/[0.04] py-3 pr-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:bg-white/[0.07]";
const borderOk = "border-white/12 focus:border-brand-orange";
const borderBad = "border-red-400/80 focus:border-red-400";

function Field({
  label,
  htmlFor,
  optional,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium">
        {label}
        {optional && (
          <span className="font-normal text-white/50"> (Optional)</span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="mt-1.5 text-xs text-red-300"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function IconInput({
  icon: Icon,
  children,
}: {
  icon: ComponentType<LucideProps>;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <Icon
        aria-hidden
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/55"
      />
      {children}
    </div>
  );
}

function SelectField({
  id,
  icon,
  value,
  placeholder,
  options,
  error,
  onChange,
}: {
  id: string;
  icon: ComponentType<LucideProps>;
  value: string;
  placeholder: string;
  options: readonly string[];
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <IconInput icon={icon}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${control} appearance-none pl-10 ${error ? borderBad : borderOk} ${value ? "" : "text-white/45"}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-[#161616] text-white"
          >
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        size={18}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/55"
      />
    </IconInput>
  );
}

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const root = useRef<HTMLDivElement>(null);
  const direction = useRef(1);
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ContactData>(EMPTY_CONTACT);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  // Set when a step is opened from "Edit" on the review, so "Next" returns to the review.
  const [returnToReview, setReturnToReview] = useState(false);

  const stepInfo = contactSteps[step - 1];
  const update = <K extends keyof ContactData>(
    key: K,
    value: ContactData[K],
  ) => {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const go = (target: number) => {
    direction.current = target >= step ? 1 : -1;
    setStep(target);
  };

  const next = () => {
    const found = validateStep(step, data);
    setErrors(found);
    if (Object.keys(found).length) return;
    if (returnToReview) {
      setReturnToReview(false);
      go(TOTAL);
    } else {
      go(step + 1);
    }
  };

  const back = () => {
    setErrors({});
    if (returnToReview) {
      setReturnToReview(false);
      go(TOTAL);
    } else {
      go(step - 1);
    }
  };

  const reset = () => {
    setData(EMPTY_CONTACT);
    setErrors({});
    setStatus("idle");
    setMessage("");
    setReturnToReview(false);
    direction.current = -1;
    setStep(1);
  };

  const edit = (target: number) => {
    setReturnToReview(true);
    go(target);
  };

  const submit = async () => {
    const invalid = firstInvalidStep(data);
    if (invalid) {
      setErrors(validateStep(invalid, data));
      go(invalid);
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const form = new FormData(
        root.current?.querySelector("form") ?? undefined,
      );
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          website_url: form.get("website_url") ?? "",
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
        fields?: ContactErrors;
      };
      if (!response.ok) {
        if (result.fields) {
          const invalidStep = firstInvalidStep(data);
          if (invalidStep) {
            setErrors(result.fields);
            go(invalidStep);
          }
        }
        setStatus("error");
        setMessage(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setMessage(
        "Network problem. Please check your connection and try again.",
      );
    }
  };

  // Slide the new step in from the side it belongs to.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-step-panel]", {
          x: 36 * direction.current,
          opacity: 0,
          duration: 0.45,
          ease: "power3.out",
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [step, status], revertOnUpdate: true },
  );

  const typeLabel =
    projectTypes.find((t) => t.value === data.projectType)?.label ?? "";

  const reviewGroups: {
    rows: {
      icon: ComponentType<LucideProps>;
      label: string;
      value: string;
      step: number;
    }[];
  }[] = [
    {
      rows: [
        { icon: Monitor, label: "Project Type", value: typeLabel, step: 1 },
        {
          icon: FileText,
          label: "Project Title",
          value: data.title.trim(),
          step: 2,
        },
        {
          icon: FileText,
          label: "Project Description",
          value: data.description.trim(),
          step: 2,
        },
        {
          icon: Globe,
          label: "Reference Website",
          value: data.website.trim() || "Not provided",
          step: 2,
        },
      ],
    },
    {
      rows: [
        {
          icon: CalendarDays,
          label: "Timeline",
          value: data.timeline,
          step: 4,
        },
        { icon: Banknote, label: "Budget", value: data.budget, step: 4 },
        {
          icon: Target,
          label: "Priority",
          value: data.priority || "Not specified",
          step: 4,
        },
      ],
    },
    {
      rows: [
        { icon: User, label: "Your Details", value: data.name.trim(), step: 3 },
        { icon: Mail, label: "Email", value: data.email.trim(), step: 3 },
        {
          icon: Phone,
          label: "Phone",
          value: `${data.countryCode} ${data.phone.trim()}`,
          step: 3,
        },
        {
          icon: Building2,
          label: "Company",
          value: data.company.trim() || "Not specified",
          step: 3,
        },
      ],
    },
  ];

  const primary =
    "inline-flex items-center justify-center gap-2 rounded-lg bg-brand-orange px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ff8a4a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60";
  const secondary =
    "inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white transition hover:border-white/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <div
      ref={root}
      className="relative overflow-hidden rounded-2xl border border-brand-orange/50 bg-[#0b0b0b]/90 p-5 shadow-[0_0_60px_-20px_rgba(251,117,47,0.5)] backdrop-blur md:p-7"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-orange/15 blur-3xl"
      />

      {/* Header: signature + progress */}
      <div className="relative flex items-center justify-between">
        <span className="font-script text-3xl font-bold leading-none">
          {contactSection.signature}
        </span>
        {status !== "sent" && (
          <span className="text-xs text-white/70">
            Step {step} of {TOTAL}
          </span>
        )}
      </div>
      {status !== "sent" && (
        <div
          className="relative mt-4 flex gap-2"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={TOTAL}
          aria-valuenow={step}
          aria-label="Form progress"
        >
          {Array.from({ length: TOTAL }).map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i < step ? "bg-brand-orange" : "bg-white/15"}`}
            />
          ))}
        </div>
      )}

      {status === "sent" ? (
        <div
          data-step-panel
          className="relative flex min-h-[420px] flex-col items-center justify-center text-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange shadow-[0_0_40px_rgba(251,117,47,0.6)]">
            <CheckCheck aria-hidden size={30} />
          </span>
          <h3 className="mt-6 text-3xl font-bold">
            Request <span className="text-brand-orange">sent!</span>
          </h3>
          <p className="mt-3 max-w-sm text-sm text-white/70">
            Thank you
            {data.name.trim() ? `, ${data.name.trim().split(" ")[0]}` : ""}.
            I’ve received your project request and will reply to{" "}
            {data.email.trim()} soon.
          </p>
          <button type="button" onClick={reset} className={`${secondary} mt-8`}>
            Send another request
          </button>
        </div>
      ) : (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (step === TOTAL) void submit();
            else next();
          }}
          className="relative flex min-h-[500px] flex-col md:min-h-[540px]"
        >
          {/* Honeypot for bots; hidden from people and assistive tech */}
          <input
            type="text"
            name="website_url"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <div data-step-panel className="flex flex-1 flex-col">
            <h3 className="mt-6 text-[clamp(26px,2.4vw,34px)] font-bold leading-tight">
              {stepInfo.title[0]}
              <span className="text-brand-orange">{stepInfo.title[1]}</span>
            </h3>
            <p className="mt-2 text-sm text-white/70">{stepInfo.subtitle}</p>

            {/* Step 1: project type */}
            {step === 1 && (
              <div className="mt-6">
                <div
                  role="radiogroup"
                  aria-label="Project type"
                  className="grid grid-cols-2 gap-3"
                >
                  {projectTypes.map((type) => {
                    const Icon = TYPE_ICONS[type.icon];
                    const selected = data.projectType === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => update("projectType", type.value)}
                        className={`relative rounded-xl border p-4 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                          selected
                            ? "border-brand-orange bg-brand-orange/10 shadow-[0_0_24px_-6px_rgba(251,117,47,0.7)]"
                            : "border-white/10 bg-white/[0.04] hover:border-white/30"
                        }`}
                      >
                        {selected && (
                          <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange">
                            <Check aria-hidden size={13} strokeWidth={3} />
                          </span>
                        )}
                        <Icon aria-hidden size={26} strokeWidth={1.5} />
                        <span className="mt-3 block text-sm font-semibold leading-snug">
                          {type.label}
                        </span>
                        <span className="mt-1 block text-xs leading-snug text-white/55">
                          {type.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.projectType && (
                  <p role="alert" className="mt-2 text-xs text-red-300">
                    {errors.projectType}
                  </p>
                )}
              </div>
            )}

            {/* Step 2: the project */}
            {step === 2 && (
              <div className="mt-6 flex flex-col gap-5">
                <Field
                  label="Project Title"
                  htmlFor="c-title"
                  error={errors.title}
                >
                  <IconInput icon={Type}>
                    <input
                      id="c-title"
                      value={data.title}
                      maxLength={LIMITS.title}
                      onChange={(e) => update("title", e.target.value)}
                      placeholder="e.g. E-commerce website, University portal…"
                      aria-invalid={!!errors.title}
                      aria-describedby={
                        errors.title ? "c-title-error" : undefined
                      }
                      className={`${control} pl-10 ${errors.title ? borderBad : borderOk}`}
                    />
                  </IconInput>
                </Field>
                <Field
                  label="Project Description"
                  htmlFor="c-description"
                  error={errors.description}
                >
                  <div className="relative">
                    <textarea
                      id="c-description"
                      value={data.description}
                      maxLength={LIMITS.description}
                      onChange={(e) => update("description", e.target.value)}
                      rows={5}
                      placeholder="Tell me about your project, goals, features and any specific requirements…"
                      aria-invalid={!!errors.description}
                      aria-describedby={
                        errors.description ? "c-description-error" : undefined
                      }
                      className={`${control} resize-none pl-3 ${errors.description ? borderBad : borderOk}`}
                    />
                    <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-white/45">
                      {data.description.length}/{LIMITS.description}
                    </span>
                  </div>
                </Field>
                <Field
                  label="Reference Website"
                  htmlFor="c-website"
                  optional
                  error={errors.website}
                >
                  <IconInput icon={Globe}>
                    <input
                      id="c-website"
                      type="url"
                      inputMode="url"
                      value={data.website}
                      maxLength={LIMITS.website}
                      onChange={(e) => update("website", e.target.value)}
                      placeholder="https://example.com"
                      aria-invalid={!!errors.website}
                      aria-describedby={
                        errors.website ? "c-website-error" : undefined
                      }
                      className={`${control} pl-10 ${errors.website ? borderBad : borderOk}`}
                    />
                  </IconInput>
                </Field>
              </div>
            )}

            {/* Step 3: details */}
            {step === 3 && (
              <div className="mt-6 flex flex-col gap-5">
                <Field label="Full Name" htmlFor="c-name" error={errors.name}>
                  <IconInput icon={User}>
                    <input
                      id="c-name"
                      autoComplete="name"
                      value={data.name}
                      maxLength={LIMITS.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Your full name"
                      aria-invalid={!!errors.name}
                      aria-describedby={
                        errors.name ? "c-name-error" : undefined
                      }
                      className={`${control} pl-10 ${errors.name ? borderBad : borderOk}`}
                    />
                  </IconInput>
                </Field>
                <Field
                  label="Email Address"
                  htmlFor="c-email"
                  error={errors.email}
                >
                  <IconInput icon={Mail}>
                    <input
                      id="c-email"
                      type="email"
                      autoComplete="email"
                      value={data.email}
                      maxLength={LIMITS.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "c-email-error" : undefined
                      }
                      className={`${control} pl-10 ${errors.email ? borderBad : borderOk}`}
                    />
                  </IconInput>
                </Field>
                <Field
                  label="Phone Number"
                  htmlFor="c-phone"
                  error={errors.phone ?? errors.countryCode}
                >
                  <div className="grid grid-cols-[110px_1fr] gap-3">
                    <IconInput icon={Phone}>
                      <select
                        aria-label="Country code"
                        value={data.countryCode}
                        onChange={(e) => update("countryCode", e.target.value)}
                        className={`${control} appearance-none pl-10 ${borderOk}`}
                      >
                        {countryCodes.map((c) => (
                          <option
                            key={c.code}
                            value={c.code}
                            className="bg-[#161616]"
                          >
                            {c.code} {c.label}
                          </option>
                        ))}
                      </select>
                    </IconInput>
                    <input
                      id="c-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      value={data.phone}
                      maxLength={LIMITS.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="77 123 4567"
                      aria-invalid={!!errors.phone}
                      aria-describedby={
                        errors.phone ? "c-phone-error" : undefined
                      }
                      className={`${control} pl-3 ${errors.phone ? borderBad : borderOk}`}
                    />
                  </div>
                </Field>
                <Field
                  label="Company / Organization"
                  htmlFor="c-company"
                  optional
                  error={errors.company}
                >
                  <IconInput icon={Building2}>
                    <input
                      id="c-company"
                      autoComplete="organization"
                      value={data.company}
                      maxLength={LIMITS.company}
                      onChange={(e) => update("company", e.target.value)}
                      placeholder="Your company name"
                      className={`${control} pl-10 ${borderOk}`}
                    />
                  </IconInput>
                </Field>
              </div>
            )}

            {/* Step 4: timeline and budget */}
            {step === 4 && (
              <div className="mt-6 flex flex-col gap-5">
                <Field
                  label="When do you want to start?"
                  htmlFor="c-timeline"
                  error={errors.timeline}
                >
                  <SelectField
                    id="c-timeline"
                    icon={CalendarDays}
                    value={data.timeline}
                    placeholder="Select timeframe"
                    options={timelineOptions}
                    error={errors.timeline}
                    onChange={(v) => update("timeline", v)}
                  />
                </Field>
                <Field
                  label="Estimated Budget (LKR)"
                  htmlFor="c-budget"
                  error={errors.budget}
                >
                  <SelectField
                    id="c-budget"
                    icon={Banknote}
                    value={data.budget}
                    placeholder="Select budget range"
                    options={budgetOptions}
                    error={errors.budget}
                    onChange={(v) => update("budget", v)}
                  />
                </Field>
                <Field
                  label="Project Goal / Priority"
                  htmlFor="c-priority"
                  optional
                  error={errors.priority}
                >
                  <SelectField
                    id="c-priority"
                    icon={Target}
                    value={data.priority}
                    placeholder="Select your priority"
                    options={priorityOptions}
                    error={errors.priority}
                    onChange={(v) => update("priority", v)}
                  />
                </Field>
              </div>
            )}

            {/* Step 5: review */}
            {step === 5 && (
              <div className="mt-5 flex flex-col gap-4">
                <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.03]">
                  {reviewGroups.map((group, g) => (
                    <dl key={g} className="flex flex-col gap-2.5 p-4">
                      {group.rows.map((row) => (
                        <div
                          key={row.label}
                          className="grid grid-cols-[18px_minmax(0,110px)_1fr_auto] items-center gap-x-3 text-xs"
                        >
                          <row.icon
                            aria-hidden
                            size={16}
                            className="text-white/70"
                          />
                          <dt className="text-white/60">{row.label}</dt>
                          <dd
                            className="truncate font-medium"
                            title={row.value}
                          >
                            {row.value}
                          </dd>
                          <button
                            type="button"
                            onClick={() => edit(row.step)}
                            aria-label={`Edit ${row.label}`}
                            className="inline-flex items-center gap-1 text-brand-orange hover:underline"
                          >
                            <Pencil aria-hidden size={12} /> Edit
                          </button>
                        </div>
                      ))}
                    </dl>
                  ))}
                </div>
                {status === "error" && (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  >
                    {message}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={`${primary} w-full py-4 text-base`}
                >
                  {status === "sending" ? (
                    <>
                      <LoaderCircle
                        aria-hidden
                        size={18}
                        className="animate-spin"
                      />{" "}
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Project Request <ArrowRight aria-hidden size={18} />
                    </>
                  )}
                </button>
                <p className="flex items-center justify-center gap-2 text-[11px] text-white/50">
                  <Lock aria-hidden size={12} /> {contactSection.privacy}
                </p>
              </div>
            )}
          </div>

          {/* Footer buttons (steps 1-4) */}
          {step < TOTAL && (
            <div className="mt-8 flex items-center justify-between gap-3">
              {step > 1 && (
                <button type="button" onClick={back} className={secondary}>
                  <ArrowLeft aria-hidden size={16} />{" "}
                  {returnToReview ? "Review" : "Back"}
                </button>
              )}
              <button type="submit" className={`${primary} ml-auto`}>
                {returnToReview ? "Back to review" : "Next Step"}{" "}
                <ArrowRight aria-hidden size={16} />
              </button>
            </div>
          )}
          {step === TOTAL && (
            <div className="mt-4">
              <button type="button" onClick={back} className={secondary}>
                <ArrowLeft aria-hidden size={16} /> Back
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
