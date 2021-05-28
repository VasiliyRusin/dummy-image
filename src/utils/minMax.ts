interface Params {
  min: number;
  max: number;
}

function normilezeParams(
  fn: (value: number, min: number, max: number) => number
) {
  return (value: number, min: number | Params, max?: number) => {
    if (typeof min === "object" && min?.min && min?.max) {
      max = min.max;
      min = min.min;
    }

    return fn(value, min as number, max as number);
  };
}

export default normilezeParams(
  (value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(value, max));
  }
);
