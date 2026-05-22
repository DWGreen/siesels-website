import { CustomSandwich }
  from "@/types/builder";

export function serializeCustomSandwich(
  sandwich: CustomSandwich
) {

  return {

    name: sandwich.name,

    quantity: 1,

    selections:
      sandwich.selections,
  };
}