import React, { useState, useRef } from "react";
import { Sparkles, Loader2, AlertCircle, RefreshCw, Upload, FileText, Image as ImageIcon, Trash2 } from "lucide-react";
import { MinitData } from "../types";

interface AiAssistantProps {
  onDataGenerated: (data: MinitData) => void;
  templateType: "asal" | "minit_pertama" | "dco";
}

export default function AiAssistant({ onDataGenerated, templateType }: AiAssistantProps) {
  const [rawText, setRawText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Extract only the raw base64 data
        const base64 = result.split(",")[1];
        resolve({ base64, mimeType: file.type });
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleGenerate = async () => {
    if (!rawText.trim() && !file) {
      setError("Sila masukkan teks laporan atau muat naik fail laporan (gambar/PDF) terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload: any = {
        templateType,
      };

      if (rawText.trim()) {
        payload.rawReport = rawText;
      }

      if (file) {
        const { base64, mimeType } = await fileToBase64(file);
        payload.fileData = base64;
        payload.fileMime = mimeType;
      }

      const response = await fetch("/api/generate-minutes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Gagal memproses draf dengan AI.");
      }

      const generatedData = await response.json();
      
      // Merge with default values for safety
      const formattedData: MinitData = {
        rptNo: generatedData.rptNo || "",
        ksNo: generatedData.ksNo || "",
        penerima: generatedData.penerima || (templateType === "dco" ? "YANG ARIF TIMBALAN PENDAKWARAYA NEGERI SABAH" : "YDH TUAN KBSJD TUARAN"),
        templateType,
        seksyen: generatedData.seksyen || "Seksyen 379A Kanun Keseksaan",
        pengadu: generatedData.pengadu || "",
        mangsaList: (generatedData.mangsaList || []).map((m: any, idx: number) => ({
          id: `m-${Date.now()}-${idx}`,
          label: m.label || `M${idx + 1}`,
          nama: m.nama || "",
          ic: m.ic || "",
          jantina: m.jantina || "L",
          umur: m.umur || "",
          bangsa: m.bangsa || "",
          warganegara: m.warganegara || "",
          alamat: m.alamat || "",
        })),
        oktList: (generatedData.oktList || []).map((o: any, idx: number) => ({
          id: `o-${Date.now()}-${idx}`,
          label: o.label || `B${idx + 1}`,
          nama: o.nama || "",
          ic: o.ic || "",
          jantina: o.jantina || "L",
          umur: o.umur || "",
          bangsa: o.bangsa || "",
          warganegara: o.warganegara || "",
          pekerjaan: o.pekerjaan || "",
          alamat: o.alamat || "",
        })),
        remanStatus: generatedData.remanStatus || "",
        tarikhMasa: generatedData.tarikhMasa || "",
        tempatKejadian: generatedData.tempatKejadian || "",
        keteranganKes: generatedData.keteranganKes || "Keterangan kes adalah seperti di muka surat 2 kertas siasatan.",
        rakamanSaksi: (generatedData.rakamanSaksi || []).map((s: any, idx: number) => ({
          id: `s-${Date.now()}-${idx}`,
          label: s.label || `A${idx + 1}`,
          nama: s.nama || "",
          ic: s.ic || "",
          percakapan: s.percakapan || [],
        })),
        siasatanTK: generatedData.siasatanTK || "",
        modusOperandi: generatedData.modusOperandi || "",
        semakanImigresen: generatedData.semakanImigresen || "",
        semakanUjianAirKencing: generatedData.semakanUjianAirKencing || "",
        semakanRekodLampau: (generatedData.semakanRekodLampau || []).map((r: any, idx: number) => ({
          id: `r-${Date.now()}-${idx}`,
          oktLabel: r.oktLabel || `B${idx + 1}`,
          rekod: r.rekod || [],
        })),
        rampasanBarangKes: generatedData.rampasanBarangKes || [],
        laporanKawadCam: generatedData.laporanKawadCam || "",
        laporanPerubatan: generatedData.laporanPerubatan || "",
        senjata: generatedData.senjata || "",
        rampasanLain: generatedData.rampasanLain || "",
        motifKejadian: generatedData.motifKejadian || "",
        rakamanOkt: (generatedData.rakamanOkt || []).map((ro: any, idx: number) => ({
          id: `ro-${Date.now()}-${idx}`,
          oktLabel: ro.oktLabel || `B${idx + 1}`,
          nama: ro.nama || "",
          ic: ro.ic || "",
          butiran: ro.butiran || [],
        })),
        ulasan: generatedData.ulasan || [],
        cadangan: generatedData.cadangan || [],
        namaPegawai: "",
        pangkat: "",
        jawatan: "",
        ipd: "",
      };

      onDataGenerated(formattedData);
      setSuccess(true);
      setRawText("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setError(err?.message || "Ralat semasa menghubungi pelayan AI. Sila pastikan API Key telah dikonfigurasikan.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSampleNotes = () => {
    setRawText(
      "LAPORAN SIASATAN KES CURI MOTOSIKAL\n" +
      "No Laporan: Tuaran/Rpt/0448/2026. No Kertas Siasatan: Tuaran/JSJ/KS/12/2026.\n" +
      "Kes disiasat di bawah Seksyen 379A Kanun Keseksaan.\n\n" +
      "Pengadu: Nurshahira binti Bakaria, No KP: 020509-12-0864, perempuan berumur 23 tahun berbangsa Bajau, bekerja sales assistant tinggal di Kg. Laya-Laya, Tuaran, Sabah. Melaporkan motosikal miliknya jenis Smart Bike bernilai RM20,000 yang dibeli ansuran bulanan RM347 telah hilang semasa bapa beliau, Bakaria bin Wkk Lida (KP: 690421-12-5487) menggunakannya ke kebun sayur di Kg. Tambalang pada 20/01/2026.\n\n" +
      "Tangkapan: B1 Mohd Ezuandy bin Rintan, KP 920524-12-5595, lelaki berumur 33 tahun, bangsa Bajau, pekerjaan Mekanik Persendirian, alamat Kg. Simpangan, Tuaran. Reman ditangkap pada 06/02/2026 dan reman berakhir 13/02/2026.\n\n" +
      "Saksi-saksi:\n" +
      "1. Nurshahira binti Bakaria (A1): Mengesahkan pembelian motor ansuran dan peminjaman oleh bapanya.\n" +
      "2. Bakaria bin Wkk Lida (A2): Pada hari kejadian nampak B1 (Appy) membaiki motosikal di pondok kebun manakala rakannya Minjan berjalan kaki pulang. Selepas membajak jam 1900 nampak motor dibawa lari.\n" +
      "3. Insp. Ridhzuan bin Abd Majid (A3): Membuat serbuan di Shell Rugading dan menangkap B1 menunggang motor mangsa yang ditukar plat palsu SAB4678.\n\n" +
      "Hasil Siasatan:\n" +
      "- Siasatan TK: Kebun sayur 80 meter dari jalan raya utama. Tiada CCTV atau saksi bebas.\n" +
      "- MO: Menggunakan kunci asal yang tertinggal di motor.\n" +
      "- Saringan Air Kencing: B1 positif dadah jenis Methamphetamine.\n" +
      "- Rekod Lampau OKT: B1 ada 3 rekod lampau penyalahgunaan dadah (2021, 2022, 2024).\n" +
      "- Rampasan: Motosikal plat palsu SAB4678 (chasis asal SYY8752).\n\n" +
      "Ulasan: B1 telah melarikan motosikal A1 tanpa kebenaran bapa mangsa. Menukar nombor plat membuktikan niat menyimpan motosikal secara tidak sah.\n" +
      "Cadangan: Tuduh B1 di bawah Seksyen 379A KK atau pertuduhan alternatif di bawah Seksyen 411 KK."
    );
    setFile(null);
    setError(null);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
          <h3 className="font-semibold text-slate-800 text-sm md:text-base">
            Bantu Jana dengan AI & OCR
          </h3>
        </div>
        <button
          type="button"
          onClick={handleLoadSampleNotes}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Muat Teks Contoh
        </button>
      </div>

      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
        Anda boleh memuat naik gambar laporan bertulis, dokumen imbasan, atau fail PDF laporan kejadian. 
        Kecerdasan Buatan (Gemini 3.5 Flash) akan melakukan OCR berkualiti tinggi secara automatik untuk 
        mengekstrak butiran kes (nama, IC, telefon, kejadian) dan mengisi borang ini secara berstruktur.
      </p>

      {/* Drag & Drop OCR Upload Area */}
      <div className="mb-4">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const droppedFiles = e.dataTransfer.files;
            if (droppedFiles && droppedFiles.length > 0) {
              const f = droppedFiles[0];
              if (f.type.startsWith("image/") || f.type === "application/pdf") {
                setFile(f);
                setError(null);
                setSuccess(false);
              } else {
                setError("Hanya fail imej (PNG, JPG, WEBP) atau PDF sahaja yang dibenarkan.");
              }
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-50/50"
              : "border-slate-300 hover:border-blue-500 bg-white hover:bg-slate-50/50"
          }`}
          id="ocr-upload-zone"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const selectedFiles = e.target.files;
              if (selectedFiles && selectedFiles.length > 0) {
                setFile(selectedFiles[0]);
                setError(null);
                setSuccess(false);
              }
            }}
            accept="image/*,application/pdf"
            className="hidden"
          />
          <Upload className="w-8 h-8 text-slate-400 mb-2" />
          <span className="text-xs font-bold text-slate-700">Tarik & Lepas laporan atau klik untuk pilih</span>
          <span className="text-[10px] text-slate-400 mt-1">Format disokong: PDF, PNG, JPEG, WEBP</span>
        </div>

        {/* Selected File Card */}
        {file && (
          <div className="mt-3 flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {file.type === "application/pdf" ? (
                <FileText className="w-7 h-7 text-red-500 shrink-0" />
              ) : (
                <ImageIcon className="w-7 h-7 text-blue-500 shrink-0" />
              )}
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {(file.size / 1024).toFixed(1)} KB • {file.type.split("/")[1]?.toUpperCase() || "PDF"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            Atau masukkan teks catatan kasar secara manual
          </label>
          <textarea
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              setSuccess(false);
            }}
            placeholder="Tampalkan teks laporan polis kasar di sini..."
            rows={4}
            className="w-full text-xs p-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs font-medium">
            🎉 <strong>Berjaya!</strong> Form telah diisi secara automatik berdasarkan dokumen/teks laporan yang diproses. Sila semak tab di atas untuk menyunting draf atau terus cetak/eksport.
          </div>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Membaca & Mengekstrak Data Dokumen...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Janakan Minit Siasatan (OCR & AI)
            </>
          )}
        </button>
      </div>
    </div>
  );
}
