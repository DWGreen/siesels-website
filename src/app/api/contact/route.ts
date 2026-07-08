import { NextResponse } from "next/server";

import { getContactFormConfig } from "@/config/contactFormConfig";
import { submitContactRequest } from "@/services/contact/contactSubmissionService";
import { ContactFormPayload } from "@/types/contact";

export const dynamic = "force-dynamic";

function sanitizeString(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function parsePayload(raw: unknown): ContactFormPayload {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid payload.");
  }

  const input = raw as Record<string, unknown>;

  const payload: ContactFormPayload = {
    firstName: sanitizeString(input.firstName),
    lastName: sanitizeString(input.lastName),
    email: sanitizeString(input.email),
    phone: sanitizeString(input.phone),
    subject: sanitizeString(input.subject),
    message: sanitizeString(input.message),
    preferredLocation: sanitizeString(input.preferredLocation),
    newsletterOptIn: Boolean(input.newsletterOptIn),
  };

  if (!payload.firstName) {
    throw new Error("First name is required.");
  }

  if (!payload.lastName) {
    throw new Error("Last name is required.");
  }

  if (!payload.email || !/^\S+@\S+\.\S+$/.test(payload.email)) {
    throw new Error("A valid email address is required.");
  }

  if (!payload.message || payload.message.length < 10) {
    throw new Error("Message must be at least 10 characters.");
  }

  return payload;
}

export async function POST(request: Request) {
  const config = getContactFormConfig();

  try {
    const body = (await request.json()) as Record<string, unknown>;

    // Honeypot field for simple bot filtering.
    if (sanitizeString(body.website)) {
      return NextResponse.json({
        ok: true,
        message: config.successMessage,
      });
    }

    const payload = parsePayload(body);

    await submitContactRequest(payload);

    return NextResponse.json({
      ok: true,
      message: config.successMessage,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to submit contact request.";

    console.error("Contact form submission failed:", message);

    return NextResponse.json(
      {
        ok: false,
        message: config.errorMessage,
      },
      {
        status: 400,
      }
    );
  }
}
