"use client";

import { useState } from "react";

import {
  capitalizeDay,
  menuDays,
} from "@/lib/recipes/dateWeeks";

type Props = {
  recipeName: string;
  onAdd: (day: string) => void;
  buttonClassName?: string;
  buttonLabel?: string;
  linkOrButton?: "link" | "button";
};

export default function AddToMenuDialog({
  recipeName,
  onAdd,
  buttonClassName,
  buttonLabel = "Add to My Menu",
  linkOrButton = "button",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] =
    useState<string>("monday");

  function handleAdd() {
    onAdd(selectedDay);
    setIsOpen(false);
  }

  return (
    <>
      {linkOrButton === "link" ? (
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            setIsOpen(true);
          }}
          className={buttonClassName}
        >
          {buttonLabel}
        </a>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={buttonClassName}
        >
          {buttonLabel}
        </button>
      )}

      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/60
            px-4
          "
          role="dialog"
          aria-modal="true"
          aria-label="Add recipe to menu"
        >
          <div
            className="
              w-full
              max-w-md
              border-2
              border-neutral-900
              bg-white
              p-5
              shadow-xl
            "
          >
            <div
              className="
                mb-4
                border-b
                border-neutral-300
                pb-3
              "
            >
              <div
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.25em]
                  text-neutral-500
                "
              >
                Add to Menu
              </div>

              <h2
                className="
                  mt-1
                  text-2xl
                  font-black
                  uppercase
                  leading-tight
                "
              >
                {recipeName}
              </h2>
            </div>

            <label
              className="
                mb-2
                block
                text-xs
                font-black
                uppercase
                tracking-[0.2em]
              "
            >
              Choose Day
            </label>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {menuDays.map(day => {
                const isSelected =
                  selectedDay === day;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() =>
                      setSelectedDay(day)
                    }
                    className={`
                      border
                      border-neutral-900
                      px-3
                      py-3
                      text-xs
                      font-black
                      uppercase
                      tracking-widest
                      transition
                      ${
                        isSelected
                          ? "bg-neutral-900 text-white"
                          : "bg-white text-neutral-900 hover:bg-neutral-100"
                      }
                    `}
                  >
                    {capitalizeDay(day)}
                  </button>
                );
              })}
            </div>

            <div
              className="
                mt-5
                flex
                justify-end
                gap-2
              "
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="
                  border
                  border-neutral-900
                  px-4
                  py-2
                  text-xs
                  font-black
                  uppercase
                  tracking-widest
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAdd}
                className="
                  border
                  border-neutral-900
                  bg-neutral-900
                  px-4
                  py-2
                  text-xs
                  font-black
                  uppercase
                  tracking-widest
                  text-white
                "
              >
                Add to {capitalizeDay(selectedDay)}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}