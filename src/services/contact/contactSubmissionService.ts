import {
  getContactFormConfig,
  ContactFormConfig,
} from "@/config/contactFormConfig";
import { ContactFormPayload } from "@/types/contact";

interface ContactSubmissionResult {
  delivered: boolean;
  mode: string;
}

const payloadFieldNames: ReadonlyArray<keyof ContactFormPayload> = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "subject",
  "message",
  "preferredLocation",
  "newsletterOptIn",
];

function isPayloadFieldName(value: string): value is keyof ContactFormPayload {
  return payloadFieldNames.includes(value as keyof ContactFormPayload);
}

function getMappedFieldValue(payload: ContactFormPayload, fieldName: string): string {
  if (!isPayloadFieldName(fieldName)) {
    return "";
  }

  const rawValue = payload[fieldName];

  if (typeof rawValue === "boolean") {
    return rawValue ? "yes" : "no";
  }

  if (typeof rawValue === "string") {
    return rawValue;
  }

  return "";
}

export async function submitContactRequest(
  payload: ContactFormPayload
): Promise<ContactSubmissionResult> {
  const config = getContactFormConfig();

  if (config.mode === "disabled") {
    console.info("Contact submission mode is disabled. Payload:", payload);

    return {
      delivered: true,
      mode: config.mode,
    };
  }

  if (config.mode === "ninja-forms") {
    const endpoint = config.ninjaForms.endpoint;
    const formId = config.ninjaForms.formId;

    if (!endpoint || !formId) {
      throw new Error(
        "Ninja Forms mode requires CONTACT_NINJA_FORMS_FORM_ID and a valid endpoint."
      );
    }

    const fields = Object.entries(config.ninjaForms.fieldMap).map(
      ([key, mapKey]) => ({
        key: mapKey,
        value: getMappedFieldValue(payload, key),
      })
    );

    await postJson(config, endpoint, {
      form_id: formId,
      fields,
    });

    return {
      delivered: true,
      mode: config.mode,
    };
  }

  if (config.mode === "wordpress-rest") {
    const endpoint = config.wordpressRest.endpoint;

    if (!endpoint) {
      throw new Error(
        "WordPress REST mode requires CONTACT_WORDPRESS_ENDPOINT."
      );
    }

    await postJson(config, endpoint, payload);

    return {
      delivered: true,
      mode: config.mode,
    };
  }

  const webhookEndpoint = config.webhook.endpoint;

  if (!webhookEndpoint) {
    throw new Error("Webhook mode requires CONTACT_WEBHOOK_ENDPOINT.");
  }

  await postJson(config, webhookEndpoint, payload);

  return {
    delivered: true,
    mode: config.mode,
  };
}

async function postJson(config: ContactFormConfig, url: string, body: unknown) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...config.extraHeaders,
    };

    if (config.authToken) {
      headers[config.authHeaderName] = config.authToken;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const responseBody = await response.text();

      throw new Error(
        `Contact submission endpoint returned ${response.status}: ${responseBody.slice(0, 250)}`
      );
    }
  } finally {
    clearTimeout(timeout);
  }
}
