import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PickupStoreSelector from "./PickupStoreSelector";

function Form() {
  const [value, setValue] = useState("");
  return <form aria-label="Reservation"><PickupStoreSelector value={value} onChange={setValue} /></form>;
}

describe("pickup store selector", () => {
  it("requires an explicit store choice and permits only one selection", () => {
    render(<Form />);
    const form = screen.getByRole("form") as HTMLFormElement;
    const siesels = screen.getByRole("radio", { name: /Siesel's Meats/ });
    const iowa = screen.getByRole("radio", { name: /Iowa Meat Farms/ });
    expect(siesels).not.toBeChecked();
    expect(iowa).not.toBeChecked();
    expect(form.checkValidity()).toBe(false);
    fireEvent.click(siesels);
    expect(siesels).toBeChecked();
    expect(form.checkValidity()).toBe(true);
    fireEvent.click(iowa);
    expect(iowa).toBeChecked();
    expect(siesels).not.toBeChecked();
    expect(screen.getByText("4131 Ashton Street")).toBeInTheDocument();
    expect(screen.getByText("6041 Mission Gorge Rd")).toBeInTheDocument();
  });
});