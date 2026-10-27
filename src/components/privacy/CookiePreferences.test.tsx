import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import * as CookieConsent from "vanilla-cookieconsent";
import CookiePreferences, { CookiePreferencesButton } from "./CookiePreferences";
import ConsentMap from "./ConsentMap";

afterEach(() => {
  cleanup();
  CookieConsent.reset(true);
});

function renderPrivacy() {
  return render(<><CookiePreferences /><CookiePreferencesButton /><ConsentMap name="Siesel's Meats" query="San+Diego" /></>);
}

it("blocks maps before consent and after rejecting optional services", async () => {
  renderPrivacy();
  await screen.findByText("Your privacy choices");
  expect(document.querySelector('iframe[src*="google.com"]')).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Reject optional cookies" }));
  await waitFor(() => expect(CookieConsent.validConsent()).toBe(true));
  expect(CookieConsent.acceptedCategory("maps")).toBe(false);
  expect(document.querySelector('iframe[src*="google.com"]')).toBeNull();
});

it("loads maps only after opting in and removes them when consent is withdrawn", async () => {
  renderPrivacy();
  await screen.findByText("Your privacy choices");
  fireEvent.click(screen.getByRole("button", { name: "Accept optional cookies" }));
  await waitFor(() => expect(screen.getByTitle("Map of Siesel's Meats")).toBeInTheDocument());
  fireEvent.click(screen.getByRole("button", { name: "Cookie settings" }));
  await waitFor(() => expect(document.documentElement).toHaveClass("show--preferences"));
  act(() => { CookieConsent.acceptCategory("necessary"); });
  await waitFor(() => expect(document.querySelector('iframe[src*="google.com"]')).toBeNull());
});

it("restores saved rejection without loading an optional map", async () => {
  const view = renderPrivacy();
  await screen.findByText("Your privacy choices");
  act(() => { CookieConsent.acceptCategory("necessary"); });
  view.unmount();
  CookieConsent.reset(false);
  renderPrivacy();
  expect(CookieConsent.validConsent()).toBe(true);
  expect(document.querySelector('iframe[src*="google.com"]')).toBeNull();
});


it("restores saved map permission after the consent manager initializes again", async () => {
  const view = renderPrivacy();
  await screen.findByText("Your privacy choices");
  fireEvent.click(screen.getByRole("button", { name: "Accept optional cookies" }));
  await waitFor(() => expect(screen.getByTitle("Map of Siesel's Meats")).toBeInTheDocument());
  view.unmount();
  CookieConsent.reset(false);
  renderPrivacy();
  await waitFor(() => expect(screen.getByTitle("Map of Siesel's Meats")).toBeInTheDocument());
});
