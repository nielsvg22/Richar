/**
 * Genereert per workshop een illustratie via de OpenAI Images API en slaat
 * die op als workshop-hoofdfoto (workshop_images tabel). Vereist
 * OPENAI_API_KEY en DATABASE_URL in de omgeving. Draai met:
 *   npx tsx --env-file=.env.local scripts/generate-workshop-images.ts
 */
import { addWorkshopImage, getWorkshopImages, deleteWorkshopImage } from "../src/lib/workshopImages";

const PROMPTS: Record<string, string> = {
  "sieraden-workshop":
    "Warm, vrolijke platte-vector illustratie van een sieraden-maak workshop voor kinderfeestjes: kralen, armbandjes, kettinkjes en een klein juwelendoosje op een tafel, zachte pastelkleuren (perzik en crème), speels en uitnodigend, geen tekst, geen mensen met gezichten, vierkant formaat.",
  "schilder-workshop":
    "Warm, vrolijke platte-vector illustratie van een schilder-workshop voor kinderfeestjes: kwasten, verfpaletten met vrolijke kleuren spatten, een canvas op een ezel, zachte pastelkleuren (perzik en crème), speels en uitnodigend, geen tekst, geen mensen met gezichten, vierkant formaat.",
  "tasjes-versieren":
    "Warm, vrolijke platte-vector illustratie van tasjes versieren voor een kinderfeestje: canvas tasjes met glitter, stickers, gekleurde stiften en strikjes, zachte pastelkleuren (perzik en crème), speels en uitnodigend, geen tekst, geen mensen met gezichten, vierkant formaat.",
  "beauty-workshop":
    "Warm, vrolijke platte-vector illustratie van een beauty-workshop voor een kinderfeestje: nagellakflesjes in pastelkleuren, een make-upspiegeltje, haarspeldjes en glitter, zachte roze en koraal tinten, speels en uitnodigend, geen tekst, geen mensen met gezichten, vierkant formaat.",
  "mini-glam-workshop":
    "Warm, vrolijke platte-vector illustratie van een glamoureuze mini-beautyworkshop voor kinderen: een tiara, lipgloss, glitter, een handspiegel en sterretjes, zachte roze en gouden tinten, speels en luxueus maar kindvriendelijk, geen tekst, geen mensen met gezichten, vierkant formaat.",
  "cupcake-workshop":
    "Warm, vrolijke platte-vector illustratie van een cupcakes-versier workshop voor een kinderfeestje: cupcakes met kleurrijk glazuur, spuitzakken, sprinkles en een taartdecoreer-spatel, zachte crème en abrikooskleuren, speels en uitnodigend, geen tekst, geen mensen met gezichten, vierkant formaat.",
};

async function generateImage(prompt: string): Promise<Buffer> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY ontbreekt");

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      n: 1,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API-fout (${response.status}): ${text}`);
  }

  const json = (await response.json()) as { data: { b64_json: string }[] };
  const b64 = json.data[0]?.b64_json;
  if (!b64) throw new Error("Geen afbeelding in API-response");
  return Buffer.from(b64, "base64");
}

async function main() {
  for (const [slug, prompt] of Object.entries(PROMPTS)) {
    console.log(`Genereren voor ${slug}...`);
    try {
      const buffer = await generateImage(prompt);

      // Verwijder bestaande gegenereerde afbeeldingen zodat de nieuwe als
      // hoofdfoto (sort_order 0) wordt gebruikt.
      const existing = await getWorkshopImages(slug);
      for (const img of existing) {
        await deleteWorkshopImage(img.id);
      }

      await addWorkshopImage(slug, buffer, "image/png");
      console.log(`✓ ${slug} opgeslagen (${buffer.length} bytes)`);
    } catch (err) {
      console.error(`✗ ${slug} mislukt:`, err instanceof Error ? err.message : err);
    }
  }
  process.exit(0);
}

main();
