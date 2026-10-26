import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import ContactForm from "./ContactForm";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("blocks an invalid contact request and exposes the native field errors without posting", () => {
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);
  render(<ContactForm />);
  fireEvent.submit(screen.getByRole("button", { name: "Send Message" }).closest("form")!);
  expect(fetch).not.toHaveBeenCalled();
  const firstName = screen.getByRole("textbox", { name: "First Name" });
  expect(firstName).toHaveAttribute("aria-invalid", "true");
  const description = document.getElementById(firstName.getAttribute("aria-describedby")!);
  expect(description).toHaveAttribute("hidden");
  expect(description!.textContent).toBeTruthy();
});
