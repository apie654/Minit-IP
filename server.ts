import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy init of Gemini API
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API endpoint to process raw report with Gemini API
app.post("/api/generate-minutes", async (req, res) => {
  try {
    const { rawReport, fileData, fileMime, templateType } = req.body;
    if (!rawReport && !fileData) {
      res.status(400).json({ error: "Sila masukkan kandungan laporan atau draf kasar, atau muat naik fail laporan (gambar/PDF)." });
      return;
    }

    const ai = getGeminiClient();
    
    const prompt = `Sila analisis kandungan laporan polis, fail dokumen, atau catatan siasatan yang diberikan dan tukarkan ia kepada format data JSON berstruktur bagi minit siasatan PDRM. 
Gunakan jenis draf/template: "${templateType || 'minit_pertama'}".

${rawReport ? `Teks Catatan / Laporan:\n"""\n${rawReport}\n"""` : 'Sila analisis dokumen laporan polis / imej yang dilampirkan.'}

Tugas utama anda:
1. Ekstrak butiran rujukan seperti Nombor Laporan (rptNo), Nombor Kertas Siasatan (ksNo).
2. Tentukan atau cadangkan Seksyen siasatan (seksyen) yang sesuai jika ada (cth: "Seksyen 379A Kanun Keseksaan", "Seksyen 302 Kanun Keseksaan").
3. Ekstrak Pengadu (pengadu) dalam format perenggan yang ringkas dan padat menyatakan jantina, umur, bangsa, pekerjaan, dan alamat.
4. Senaraikan Mangsa (mangsaList) dan Tangkapan/OKT (oktList) dengan label cth M1, A1, B1, B2. Sila pastikan anda mengasingkan nama, IC, jantina, umur, bangsa, warganegara, pekerjaan, dan alamat.
5. Ekstrak Tarikh dan Masa Kejadian (tarikhMasa) dan Tempat Kejadian (tempatKejadian).
6. Susun "Hasil Siasatan":
   - rakamanSaksi: Setiap saksi (cth A1, A2) mempunyai senarai mata percakapan (i, ii, iii...).
   - siasatanTK: Penerangan keadaan tempat kejadian (TK).
   - modusOperandi: Cara suspek melakukan jenayah.
   - semakanImigresen: Rekod kemasukan luar negara (jika berkaitan).
   - semakanUjianAirKencing: Keputusan saringan air kencing (jika ada).
   - semakanRekodLampau: Rekod jenayah lampau setiap OKT.
   - rampasanBarangKes: Senarai barangan yang dirampas dalam serbuan.
   - laporanKawadCam: Keputusan kawad cam jika dijalankan.
   - laporanPerubatan: Kecederaan atau punca kematian jika ada.
   - senjata: Senjata yang digunakan jika ada.
   - motifKejadian: Sebab kejadian jika diketahui.
   - rakamanOkt: Pernyataan OKT (cth B1, B2) berserta butiran percakapan mereka (i, ii, iii...).
7. Tuliskan "ulasan" (ulasan) dan "cadangan" (cadangan) yang bersesuaian berdasarkan fakta kes dalam teks tersebut.`;

    let contents: any;
    if (fileData && fileMime) {
      contents = {
        parts: [
          {
            inlineData: {
              data: fileData,
              mimeType: fileMime,
            },
          },
          {
            text: prompt,
          },
        ],
      };
    } else {
      contents = prompt;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: "Anda adalah pakar penyediaan kertas siasatan Polis Diraja Malaysia (PDRM). Analisis input kes atau imej/PDF laporan polis dengan teliti, lakukan OCR berkualiti tinggi, dan ekstrak semua maklumat mengikut skema JSON dengan tepat dan bahasa Melayu yang profesional, ringkas dan padat.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rptNo: { type: Type.STRING, description: "Nombor Laporan Polis cth Tuaran/Rpt/0448/2026" },
            ksNo: { type: Type.STRING, description: "Nombor Kertas Siasatan cth Tuaran/JSJ/KS/12/2026" },
            penerima: { type: Type.STRING, description: "Kepada siapa cth YDH TUAN KBSJD TUARAN atau YANG ARIF TIMBALAN PENDAKWARAYA NEGERI SABAH" },
            seksyen: { type: Type.STRING, description: "Seksyen undang-undang cth Seksyen 379A Kanun Keseksaan" },
            pengadu: { type: Type.STRING, description: "Ringkasan pengadu dalam format perenggan" },
            tarikhMasa: { type: Type.STRING, description: "Tarikh dan masa kejadian" },
            tempatKejadian: { type: Type.STRING, description: "Alamat tempat kejadian" },
            remanStatus: { type: Type.STRING, description: "Status reman OKT" },
            mangsaList: {
              type: Type.ARRAY,
              description: "Senarai mangsa jika ada",
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: "Cth M1, A1" },
                  nama: { type: Type.STRING },
                  ic: { type: Type.STRING, description: "No Kad Pengenalan atau Passport" },
                  jantina: { type: Type.STRING, description: "L atau P" },
                  umur: { type: Type.STRING },
                  bangsa: { type: Type.STRING },
                  warganegara: { type: Type.STRING },
                  alamat: { type: Type.STRING }
                }
              }
            },
            oktList: {
              type: Type.ARRAY,
              description: "Senarai OKT/Tangkapan",
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: "Cth B1, B2" },
                  nama: { type: Type.STRING },
                  ic: { type: Type.STRING },
                  jantina: { type: Type.STRING, description: "L atau P" },
                  umur: { type: Type.STRING },
                  bangsa: { type: Type.STRING },
                  warganegara: { type: Type.STRING },
                  pekerjaan: { type: Type.STRING },
                  alamat: { type: Type.STRING }
                }
              }
            },
            siasatanTK: { type: Type.STRING, description: "Hasil siasatan di tempat kejadian" },
            modusOperandi: { type: Type.STRING, description: "Modus operandi kejadian" },
            semakanImigresen: { type: Type.STRING, description: "Semakan Imigresen bagi warga asing jika ada" },
            semakanUjianAirKencing: { type: Type.STRING, description: "Ujian saringan air kencing jika ada" },
            laporanKawadCam: { type: Type.STRING, description: "Hasil laporan kawad cam jika ada" },
            laporanPerubatan: { type: Type.STRING, description: "Kecederaan / Postmortem jika ada" },
            senjata: { type: Type.STRING, description: "Senjata pembunuhan / samun jika ada" },
            rampasanLain: { type: Type.STRING, description: "Rampasan lain yang bersabit" },
            motifKejadian: { type: Type.STRING, description: "Motif kejadian jika ada" },
            rakamanSaksi: {
              type: Type.ARRAY,
              description: "Rakaman percakapan saksi-saksi",
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: "Cth A1, A2" },
                  nama: { type: Type.STRING },
                  ic: { type: Type.STRING },
                  percakapan: {
                    type: Type.ARRAY,
                    description: "Poin percakapan saksi (i, ii, iii)",
                    items: { type: Type.STRING }
                  }
                }
              }
            },
            rakamanOkt: {
              type: Type.ARRAY,
              description: "Rakaman percakapan OKT",
              items: {
                type: Type.OBJECT,
                properties: {
                  oktLabel: { type: Type.STRING, description: "Cth B1, B2" },
                  nama: { type: Type.STRING },
                  ic: { type: Type.STRING },
                  butiran: {
                    type: Type.ARRAY,
                    description: "Poin percakapan OKT (i, ii, iii)",
                    items: { type: Type.STRING }
                  }
                }
              }
            },
            semakanRekodLampau: {
              type: Type.ARRAY,
              description: "Rekod jenayah lampau OKT",
              items: {
                type: Type.OBJECT,
                properties: {
                  oktLabel: { type: Type.STRING, description: "Cth B1" },
                  rekod: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                }
              }
            },
            rampasanBarangKes: {
              type: Type.ARRAY,
              description: "Senarai rampasan barangan bukti",
              items: { type: Type.STRING }
            },
            ulasan: {
              type: Type.ARRAY,
              description: "Perenggan ulasan/rumusan kes",
              items: { type: Type.STRING }
            },
            cadangan: {
              type: Type.ARRAY,
              description: "Senarai cadangan pertuduhan atau tindakan",
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: error?.message || "Gagal memproses draf dengan AI." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
