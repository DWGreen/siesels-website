import { ContactSubmissionMode } from "@/types/contact";

export interface ContactFormConfig {
  mode: ContactSubmissionMode;
  successMessage: string;
  errorMessage: string;
  timeoutMs: number;
  authHeaderName: string;
  authToken?: string;
  extraHeaders: Record<string, string>;
  ninjaForms: {
    endpoint?: string;
    formId?: number;
    fieldMap: Record<string, string>;
  };
  wordpressRest: {
    endpoint?: string;
  };
  webhook: {
    endpoint?: string;
  };
}

const validModes: ContactSubmissionMode[] = [
  "disabled",
  "ninja-forms",
  "wordpress-rest",
  "webhook",
];

function parseMode(value: string | undefined): ContactSubmissionMode {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) {
    return "disabled";
  }

  if (validModes.includes(normalized as ContactSubmissionMode)) {
    return normalized as ContactSubmissionMode;
  }

  return "disabled";
}

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function parseJsonHeaders(value: string | undefined): Record<string, string> {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;

    return Object.entries(parsed).reduce<Record<string, string>>(
      (acc, [key, val]) => {
        if (typeof val === "string" && key.trim()) {
          acc[key] = val;
        }

        return acc;
      },
      {}
    );
  } catch {
    return {};
  }
}

function parseFieldMap(value: string | undefined): Record<string, string> {
  if (!value) {
    return {
      firstName: "first_name",
      lastName: "last_name",
      email: "email",
      phone: "phone",
      subject: "subject",
      preferredLocation: "preferred_location",
      message: "message",
      newsletterOptIn: "newsletter_opt_in",
    };
  }

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;

    return Object.entries(parsed).reduce<Record<string, string>>(
      (acc, [key, val]) => {
        if (typeof val === "string" && key.trim()) {
          acc[key] = val;
        }

        return acc;
      },
      {}
    );
  } catch {
    return {
      firstName: "first_name",
      lastName: "last_name",
      email: "email",
      phone: "phone",
      subject: "subject",
      preferredLocation: "preferred_location",
      message: "message",
      newsletterOptIn: "newsletter_opt_in",
    };
  }
}

function parseFormId(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return undefined;
  }

  return parsed;
}

function withWpBase(path: string): string | undefined {
  const wpBase = process.env.WP_API_URL ?? process.env.NEXT_PUBLIC_WP_URL;

  if (!wpBase) {
    return undefined;
  }

  return `${wpBase.replace(/\/$/, "")}${path}`;
}

export function getContactFormConfig(): ContactFormConfig {
  const mode = parseMode(process.env.CONTACT_SUBMISSION_MODE);

  return {
    mode,
    successMessage:
      process.env.CONTACT_SUCCESS_MESSAGE ??
      "Thanks for reaching out. We will get back to you shortly.",
    errorMessage:
      process.env.CONTACT_ERROR_MESSAGE ??
      "We could not submit your message right now. Please try again in a few minutes.",
    timeoutMs: parseNumber(process.env.CONTACT_SUBMISSION_TIMEOUT_MS, 10000),
    authHeaderName:
      process.env.CONTACT_SUBMISSION_AUTH_HEADER_NAME ?? "Authorization",
    authToken: process.env.CONTACT_SUBMISSION_AUTH_TOKEN,
    extraHeaders: parseJsonHeaders(process.env.CONTACT_SUBMISSION_EXTRA_HEADERS_JSON),
    ninjaForms: {
      endpoint:
        process.env.CONTACT_NINJA_FORMS_ENDPOINT ??
        withWpBase("/wp-json/ninja-forms-submissions/v1/submit"),
      formId: parseFormId(process.env.CONTACT_NINJA_FORMS_FORM_ID),
      fieldMap: parseFieldMap(process.env.CONTACT_NINJA_FORMS_FIELD_MAP_JSON),
    },
    wordpressRest: {
      endpoint: process.env.CONTACT_WORDPRESS_ENDPOINT,
    },
    webhook: {
      endpoint: process.env.CONTACT_WEBHOOK_ENDPOINT,
    },
  };
}
