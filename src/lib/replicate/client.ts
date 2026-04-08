import Replicate from "replicate";

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// FLUX.1-dev model ID
export const FLUX_MODEL = "black-forest-labs/flux-dev";

export const FLUX_MODEL_VERSION =
  "a60988fc90ec1f8f8c32d8c48b5cfa90bf0c5d3a2f0a2c7b7e3f1d5e9c4b8e7";

export interface FluxGenerationParams {
  prompt: string;
  width?: number;
  height?: number;
  num_outputs?: number;
  guidance_scale?: number;
  num_inference_steps?: number;
  output_format?: "png" | "jpg" | "webp";
  output_quality?: number;
  disable_safety_checker?: boolean;
}

export async function generateWithFlux(params: FluxGenerationParams): Promise<string[]> {
  const output = await replicate.run(FLUX_MODEL as `${string}/${string}`, {
    input: {
      prompt: params.prompt,
      width: params.width ?? 1024,
      height: params.height ?? 1024,
      num_outputs: params.num_outputs ?? 1,
      guidance_scale: params.guidance_scale ?? 3.5,
      num_inference_steps: params.num_inference_steps ?? 28,
      output_format: params.output_format ?? "png",
      output_quality: params.output_quality ?? 90,
      disable_safety_checker: false,
    },
  });

  const urls = Array.isArray(output) ? output : [output];
  return urls.map((url) => String(url));
}

// Get dimensions per design type for optimal output
export function getDesignDimensions(designType: string): { width: number; height: number } {
  const dimensions: Record<string, { width: number; height: number }> = {
    logo: { width: 1024, height: 1024 },
    kartvizit: { width: 1024, height: 576 },
    afis: { width: 768, height: 1024 },
    brosur: { width: 768, height: 1024 },
    el_ilani: { width: 768, height: 1024 },
    kitap_ayiraci: { width: 512, height: 1024 },
    tisort: { width: 1024, height: 1024 },
    etiket: { width: 1024, height: 1024 },
    sticker: { width: 1024, height: 1024 },
    sosyal_medya: { width: 1024, height: 1024 },
    menu: { width: 768, height: 1024 },
    davetiye: { width: 768, height: 1024 },
    ambalaj: { width: 1024, height: 1024 },
    banner: { width: 1024, height: 512 },
  };

  return dimensions[designType] ?? { width: 1024, height: 1024 };
}
