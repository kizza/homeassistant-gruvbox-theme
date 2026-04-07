import chroma from "chroma-js";

// Fan out a colour to shes across steps
interface Ramp {
  scale: chroma.ChromaInput[],
  prefix?: string;
  steps?: number[];
}

export const ramp = (options: Ramp) => {
  const steps = options.steps || [5,10,20,30,40,50,60,70,80,90,95]

  const scale = chroma
    .scale(options.scale)
    .mode("lch");

  return Object.fromEntries(
    steps.map((p, index) => {
      let shade: string;

      if (index === 0) {
        // First step: use the first color from the scale
        shade = chroma(options.scale[0]!).hex();
      } else if (index === steps.length - 1) {
        // Last step: use the last color from the scale
        shade = chroma(options.scale[options.scale.length - 1]!).hex();
      } else {
        // Middle steps: interpolate
        shade = scale(p / 100).hex();
      }

      return [
        `${options.prefix || ""}${p.toString().padStart(2, '0')}`,
        shade,
      ];
    })
  );
};

