"use client";

import { useEffect, useId, useRef, type FormEvent } from "react";

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type Entry = { message: HTMLSpanElement; previousInvalid: string | null };

/** Exposes native field validation errors to assistive technology without adding visible UI. */
export function useAccessibleValidation() {
  const prefix = useId();
  const entries = useRef(new Map<Field, Entry>());
  const sequence = useRef(0);

  useEffect(() => {
    const currentEntries = entries.current;
    return () => { currentEntries.forEach(entry => entry.message.remove()); };
  }, []);

  function clear(field: Field) {
    const entry = entries.current.get(field);
    if (!entry) return;
    const remaining = (field.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(id => id && id !== entry.message.id);
    if (remaining.length) field.setAttribute("aria-describedby", remaining.join(" "));
    else field.removeAttribute("aria-describedby");
    if (entry.previousInvalid === null) field.removeAttribute("aria-invalid");
    else field.setAttribute("aria-invalid", entry.previousInvalid);
    entry.message.remove();
    entries.current.delete(field);
  }

  function update(event: FormEvent<HTMLElement>) {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return;
    if (field.validity.valid) { clear(field); return; }
    let entry = entries.current.get(field);
    if (!entry) {
      const message = document.createElement("span");
      message.id = `${prefix}-validation-${++sequence.current}`;
      message.hidden = true;
      // Referenced hidden descriptions are announced without altering layout or label text.
      document.body.appendChild(message);
      entry = { message, previousInvalid: field.getAttribute("aria-invalid") };
      entries.current.set(field, entry);
      field.setAttribute("aria-describedby", [field.getAttribute("aria-describedby"), message.id].filter(Boolean).join(" "));
    }
    entry.message.textContent = field.validationMessage;
    field.setAttribute("aria-invalid", "true");
  }

  return {
    onInvalidCapture: update,
    onInputCapture(event: FormEvent<HTMLElement>) {
      const field = event.target;
      if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) {
        if (entries.current.has(field)) update(event);
      }
    },
    onChangeCapture(event: FormEvent<HTMLElement>) {
      const field = event.target;
      if ((field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) && entries.current.has(field)) update(event);
    },
  };
}
