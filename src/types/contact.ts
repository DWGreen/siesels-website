export interface ContactFormPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  preferredLocation?: string;
  newsletterOptIn: boolean;
}

export interface ContactApiResponse {
  ok: boolean;
  message: string;
}

export type ContactSubmissionMode =
  | "disabled"
  | "ninja-forms"
  | "wordpress-rest"
  | "webhook";
