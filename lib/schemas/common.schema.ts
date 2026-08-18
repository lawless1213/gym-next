import { z } from "zod";

export const positiveNumber = (maxVal: number) =>
  z
    .number({ message: "invalid_number" })
    .positive("must_be_positive")
    .max(maxVal, "value_too_large");