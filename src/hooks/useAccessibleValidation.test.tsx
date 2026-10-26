import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { useAccessibleValidation } from "./useAccessibleValidation";

function Form() {
  const props = useAccessibleValidation();
  return <form {...props}>
    <span id="existing-help">Your email address</span>
    <input aria-label="Email" type="email" required aria-describedby="existing-help" />
    <button type="submit">Send</button>
  </form>;
}
afterEach(cleanup);

it("describes an invalid field without adding visible content and clears the error after correction", () => {
  render(<Form />);
  const field = screen.getByRole("textbox", { name: "Email" });
  fireEvent.invalid(field);
  expect(field).toHaveAttribute("aria-invalid", "true");
  const ids = field.getAttribute("aria-describedby")!.split(" ");
  expect(ids).toContain("existing-help");
  const message = document.getElementById(ids.find(id => id !== "existing-help")!)!;
  expect(message).toHaveAttribute("hidden");
  expect(message.textContent).toBeTruthy();
  fireEvent.input(field, { target: { value: "person@example.test" } });
  expect(field).not.toHaveAttribute("aria-invalid");
  expect(field).toHaveAttribute("aria-describedby", "existing-help");
  expect(message).not.toBeInTheDocument();
});

it("does not mark untouched fields invalid and removes hidden messages on unmount", () => {
  const { unmount } = render(<Form />);
  const field = screen.getByRole("textbox", { name: "Email" });
  expect(field).not.toHaveAttribute("aria-invalid");
  fireEvent.input(field, { target: { value: "invalid" } });
  expect(field).not.toHaveAttribute("aria-invalid");
  fireEvent.invalid(field);
  const messageId = field.getAttribute("aria-describedby")!.split(" ")[1];
  expect(document.getElementById(messageId)).not.toBeNull();
  unmount();
  expect(document.getElementById(messageId)).toBeNull();
});
