import { CustomSandwich }
  from "@/types/builder";

export function serializeCustomSandwich(
  sandwich: CustomSandwich
) {

  return {

    name: sandwich.name,

    quantity: sandwich.quantity,

    selections:
      sandwich.selections,
  };
}