/**
 * Script para gerar imagens realistas para o site Faculdade Global EAD
 * usando a API Nano Banana Pro (Gemini 3 Pro Image) do Google.
 *
 * Uso: npx tsx scripts/generate-images.ts
 */

import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

const API_KEY = "AIzaSyABCtBTgoxWZJh5J25KQHsRfXhyvmPSD48";
const OUTPUT_DIR = path.join(process.cwd(), "public/images");

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface ImageTask {
  name: string;
  outputPath: string;
  prompt: string;
  aspectRatio: string;
}

const imageTasks: ImageTask[] = [
  // ── HERO ──
  {
    name: "Hero Principal",
    outputPath: "hero/hero-students.png",
    prompt:
      "Professional photo of a diverse group of young Brazilian adults studying together on laptops in a modern, bright coworking space. Natural lighting, warm tones, purple and orange accent colors in the environment. They look confident and engaged. One person is smiling at the camera. High quality, editorial photography style. No text overlays.",
    aspectRatio: "16:9",
  },

  // ── QUEM SOMOS ──
  {
    name: "Sobre - Institucional",
    outputPath: "about/institutional.png",
    prompt:
      "Modern university campus building exterior in Brazil, clean architectural style with glass and purple accents. Beautiful blue sky, well-maintained gardens. Professional architectural photography. Warm and welcoming atmosphere. No people, focus on the building. No text.",
    aspectRatio: "16:9",
  },

  // ── CATEGORIAS ──
  {
    name: "Categoria - Educação",
    outputPath: "categories/educacao.png",
    prompt:
      "A passionate female Brazilian teacher in her 30s helping a student in a bright modern classroom. Warm lighting, books and educational materials visible. Professional photography, editorial quality. Shallow depth of field. No text.",
    aspectRatio: "4:3",
  },
  {
    name: "Categoria - Saúde",
    outputPath: "categories/saude.png",
    prompt:
      "A Brazilian healthcare professional in a white coat using a tablet in a modern hospital corridor. Clean, bright environment with soft lighting. Professional medical photography. Confident posture. No text.",
    aspectRatio: "4:3",
  },
  {
    name: "Categoria - Negócios",
    outputPath: "categories/negocios.png",
    prompt:
      "A young Brazilian business professional in smart casual attire presenting data on a screen in a modern office meeting room. Warm lighting, glass walls. Professional corporate photography. Confident expression. No text.",
    aspectRatio: "4:3",
  },
  {
    name: "Categoria - Engenharia",
    outputPath: "categories/engenharia.png",
    prompt:
      "A Brazilian engineer wearing a hard hat and safety vest reviewing blueprints at a modern construction site. Sunset lighting, industrial background. Professional photography. No text.",
    aspectRatio: "4:3",
  },
  {
    name: "Categoria - Tecnologia",
    outputPath: "categories/tecnologia.png",
    prompt:
      "A young Brazilian software developer working on code on multiple monitors in a modern tech office. Purple ambient lighting from monitors, dark workspace. Professional tech photography. Focused expression. No text.",
    aspectRatio: "4:3",
  },
  {
    name: "Categoria - Ciências Sociais",
    outputPath: "categories/ciencias-sociais.png",
    prompt:
      "A diverse group of Brazilian students having an engaged discussion around a table with books and notebooks in a university library. Natural lighting, warm tones. Professional editorial photography. No text.",
    aspectRatio: "4:3",
  },
];

async function generateImage(task: ImageTask): Promise<boolean> {
  const outputFile = path.join(OUTPUT_DIR, task.outputPath);
  const outputFolder = path.dirname(outputFile);

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  if (fs.existsSync(outputFile)) {
    console.log(`  ⏭  Pulando "${task.name}" (já existe)`);
    return true;
  }

  console.log(`  🎨 Gerando "${task.name}"...`);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ role: "user", parts: [{ text: task.prompt }] }],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    if (
      !response.candidates ||
      !response.candidates[0]?.content?.parts
    ) {
      console.log(`  ⚠  Sem resposta para "${task.name}"`);
      return false;
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data!, "base64");
        fs.writeFileSync(outputFile, buffer);
        const sizeKB = Math.round(buffer.length / 1024);
        console.log(`  ✅ Salvo: ${task.outputPath} (${sizeKB} KB)`);
        return true;
      }
    }

    console.log(`  ⚠  Nenhuma imagem retornada para "${task.name}"`);
    return false;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`  ❌ Erro em "${task.name}": ${message}`);
    return false;
  }
}

async function main() {
  console.log("\n🖼  Faculdade Global — Gerador de Imagens (Nano Banana)\n");
  console.log(`Total de imagens: ${imageTasks.length}`);
  console.log(`Destino: ${OUTPUT_DIR}\n`);

  let success = 0;
  let failed = 0;

  for (const task of imageTasks) {
    const ok = await generateImage(task);
    if (ok) success++;
    else failed++;

    // Delay between requests to avoid rate limiting
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`\n📊 Resultado: ${success} geradas, ${failed} falharam\n`);
}

main();
