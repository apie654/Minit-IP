import React, { useState, useEffect } from "react";
import {
  FileText,
  User,
  Clock,
  MapPin,
  ClipboardList,
  MessageSquare,
  Sparkles,
  Plus,
  Trash2,
  FileCheck,
  RefreshCw,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Download,
  Upload,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MinitData, MangsaItem, OktItem, SaksiPercakapan, RekodLampauItem, RakamanOktItem } from "./types";
import { allSamples, emptyMinit } from "./samples";
import MinitPreview from "./components/MinitPreview";
import AiAssistant from "./components/AiAssistant";

export default function App() {
  const [activeTab, setActiveTab] = useState<"rujukan" | "entiti" | "kejadian" | "hasil" | "ulasan" | "pegawai">("rujukan");
  const [data, setData] = useState<MinitData>(allSamples.pertama); // Default to motorcycle case sample
  const [drafts, setDrafts] = useState<{ id: string; title: string; date: string; data: MinitData }[]>([]);
  const [showDraftsModal, setShowDraftsModal] = useState(false);
  const [showSampleSelector, setShowSampleSelector] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");

  // Load drafts from localStorage on start
  useEffect(() => {
    const savedDrafts = localStorage.getItem("pdrm_minit_drafts");
    if (savedDrafts) {
      try {
        setDrafts(JSON.parse(savedDrafts));
      } catch (e) {
        console.error("Failed to load drafts:", e);
      }
    }
  }, []);

  // Save drafts to localStorage helper
  const saveDraftsToStorage = (newDrafts: typeof drafts) => {
    setDrafts(newDrafts);
    localStorage.setItem("pdrm_minit_drafts", JSON.stringify(newDrafts));
  };

  const handleSaveDraft = () => {
    const title = draftTitle.trim() || `${data.seksyen || "Kes Tanpa Nama"} (${data.rptNo || "No Rpt"})`;
    const newDraft = {
      id: `draft-${Date.now()}`,
      title,
      date: new Date().toLocaleString("ms-MY"),
      data: { ...data }
    };
    const updated = [newDraft, ...drafts];
    saveDraftsToStorage(updated);
    alert(`Draf "${title}" telah berjaya disimpan.`);
    setDraftTitle("");
  };

  const handleLoadDraft = (savedData: MinitData) => {
    setData(savedData);
    setShowDraftsModal(false);
  };

  const handleDeleteDraft = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Adakah anda pasti mahu memadam draf ini?")) {
      const updated = drafts.filter((d) => d.id !== id);
      saveDraftsToStorage(updated);
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `minit_${data.rptNo.replace(/\//g, "_") || "kes"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setData(parsed);
        alert("Fail JSON minit berjaya diimport.");
      } catch (err) {
        alert("Fail JSON tidak sah.");
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSample = (key: keyof typeof allSamples) => {
    setData(allSamples[key]);
    setShowSampleSelector(false);
  };

  // State Mutators
  const updateField = (field: keyof MinitData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper arrays for simple string additions/deletions
  const addStringItem = (field: "rampasanBarangKes" | "ulasan" | "cadangan", defaultValue = "") => {
    setData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), defaultValue]
    }));
  };

  const updateStringItem = (field: "rampasanBarangKes" | "ulasan" | "cadangan", index: number, value: string) => {
    setData((prev) => {
      const copy = [...(prev[field] as string[])];
      copy[index] = value;
      return { ...prev, [field]: copy };
    });
  };

  const removeStringItem = (field: "rampasanBarangKes" | "ulasan" | "cadangan", index: number) => {
    setData((prev) => {
      const copy = [...(prev[field] as string[])];
      copy.splice(index, 1);
      return { ...prev, [field]: copy };
    });
  };

  // Dynamic entity lists
  const addMangsa = () => {
    const newM: MangsaItem = {
      id: `m-${Date.now()}`,
      label: `A${data.mangsaList.length + 1}/M${data.mangsaList.length + 1}`,
      nama: "",
      ic: "",
      jantina: "L",
      umur: "",
      bangsa: "",
      warganegara: "W/Malaysia",
      alamat: ""
    };
    updateField("mangsaList", [...data.mangsaList, newM]);
  };

  const updateMangsa = (index: number, key: keyof MangsaItem, value: string) => {
    const list = [...data.mangsaList];
    list[index] = { ...list[index], [key]: value };
    updateField("mangsaList", list);
  };

  const removeMangsa = (index: number) => {
    const list = [...data.mangsaList];
    list.splice(index, 1);
    // Re-index labels
    const reindexed = list.map((item, idx) => ({
      ...item,
      label: `A${idx + 1}/M${idx + 1}`
    }));
    updateField("mangsaList", reindexed);
  };

  const addOkt = () => {
    const newO: OktItem = {
      id: `o-${Date.now()}`,
      label: `B${data.oktList.length + 1}`,
      nama: "",
      ic: "",
      jantina: "L",
      umur: "",
      bangsa: "",
      warganegara: "W/Malaysia",
      pekerjaan: "",
      alamat: ""
    };
    updateField("oktList", [...data.oktList, newO]);
  };

  const updateOkt = (index: number, key: keyof OktItem, value: string) => {
    const list = [...data.oktList];
    list[index] = { ...list[index], [key]: value };
    updateField("oktList", list);
  };

  const removeOkt = (index: number) => {
    const list = [...data.oktList];
    list.splice(index, 1);
    // Re-index labels
    const reindexed = list.map((item, idx) => ({
      ...item,
      label: `B${idx + 1}`
    }));
    updateField("oktList", reindexed);
  };

  // Saksi Statement List
  const addSaksi = () => {
    const newS: SaksiPercakapan = {
      id: `s-${Date.now()}`,
      label: `A${data.rakamanSaksi.length + 1}`,
      nama: "",
      ic: "",
      percakapan: [""]
    };
    updateField("rakamanSaksi", [...data.rakamanSaksi, newS]);
  };

  const updateSaksiMeta = (index: number, key: "nama" | "ic" | "label", value: string) => {
    const list = [...data.rakamanSaksi];
    list[index] = { ...list[index], [key]: value };
    updateField("rakamanSaksi", list);
  };

  const addSaksiPercakapanPoin = (sIdx: number) => {
    const list = [...data.rakamanSaksi];
    list[sIdx].percakapan.push("");
    updateField("rakamanSaksi", list);
  };

  const updateSaksiPercakapanPoin = (sIdx: number, pIdx: number, value: string) => {
    const list = [...data.rakamanSaksi];
    list[sIdx].percakapan[pIdx] = value;
    updateField("rakamanSaksi", list);
  };

  const removeSaksiPercakapanPoin = (sIdx: number, pIdx: number) => {
    const list = [...data.rakamanSaksi];
    list[sIdx].percakapan.splice(pIdx, 1);
    updateField("rakamanSaksi", list);
  };

  const removeSaksi = (index: number) => {
    const list = [...data.rakamanSaksi];
    list.splice(index, 1);
    updateField("rakamanSaksi", list);
  };

  // Rekod Lampau
  const addRekodLampau = () => {
    const newR: RekodLampauItem = {
      id: `r-${Date.now()}`,
      oktLabel: "B1",
      rekod: [""]
    };
    updateField("semakanRekodLampau", [...data.semakanRekodLampau, newR]);
  };

  const updateRekodMeta = (index: number, value: string) => {
    const list = [...data.semakanRekodLampau];
    list[index] = { ...list[index], oktLabel: value };
    updateField("semakanRekodLampau", list);
  };

  const addRekodPoin = (rIdx: number) => {
    const list = [...data.semakanRekodLampau];
    list[rIdx].rekod.push("");
    updateField("semakanRekodLampau", list);
  };

  const updateRekodPoin = (rIdx: number, pIdx: number, value: string) => {
    const list = [...data.semakanRekodLampau];
    list[rIdx].rekod[pIdx] = value;
    updateField("semakanRekodLampau", list);
  };

  const removeRekodPoin = (rIdx: number, pIdx: number) => {
    const list = [...data.semakanRekodLampau];
    list[rIdx].rekod.splice(pIdx, 1);
    updateField("semakanRekodLampau", list);
  };

  const removeRekodLampau = (index: number) => {
    const list = [...data.semakanRekodLampau];
    list.splice(index, 1);
    updateField("semakanRekodLampau", list);
  };

  // OKT Statements List
  const addRakamanOkt = () => {
    const newRO: RakamanOktItem = {
      id: `ro-${Date.now()}`,
      oktLabel: "B1",
      nama: "",
      ic: "",
      butiran: [""]
    };
    updateField("rakamanOkt", [...data.rakamanOkt, newRO]);
  };

  const updateRakamanOktMeta = (index: number, key: "oktLabel" | "nama" | "ic", value: string) => {
    const list = [...data.rakamanOkt];
    list[index] = { ...list[index], [key]: value };
    updateField("rakamanOkt", list);
  };

  const addRakamanOktPoin = (roIdx: number) => {
    const list = [...data.rakamanOkt];
    list[roIdx].butiran.push("");
    updateField("rakamanOkt", list);
  };

  const updateRakamanOktPoin = (roIdx: number, pIdx: number, value: string) => {
    const list = [...data.rakamanOkt];
    list[roIdx].butiran[pIdx] = value;
    updateField("rakamanOkt", list);
  };

  const removeRakamanOktPoin = (roIdx: number, pIdx: number) => {
    const list = [...data.rakamanOkt];
    list[roIdx].butiran.splice(pIdx, 1);
    updateField("rakamanOkt", list);
  };

  const removeRakamanOkt = (index: number) => {
    const list = [...data.rakamanOkt];
    list.splice(index, 1);
    updateField("rakamanOkt", list);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 print:bg-white text-slate-800">
      {/* Navigation Top Bar */}
      <header className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0 shadow-md print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <FileCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base md:text-lg tracking-wide uppercase">
              Penjana Minit Siasatan
            </h1>
            <p className="text-[10px] text-slate-300 font-medium tracking-wider">
              POLIS DIRAJA MALAYSIA (PDRM)
            </p>
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-2">
          {/* Samples menu toggle */}
          <div className="relative">
            <button
              onClick={() => setShowSampleSelector(!showSampleSelector)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors border border-slate-700"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Contoh Minit</span>
            </button>
            <AnimatePresence>
              {showSampleSelector && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSampleSelector(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 text-slate-800"
                  >
                    <p className="text-[10px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                      PILIH SAMPEL KES
                    </p>
                    <button
                      onClick={() => handleLoadSample("pertama")}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-100 rounded-lg font-medium transition-all"
                    >
                      Kes Curi Motosikal (Minit Pertama)
                    </button>
                    <button
                      onClick={() => handleLoadSample("dco")}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-100 rounded-lg font-medium transition-all"
                    >
                      Kes Curi Motosikal (Minit DCO ke YA TPR)
                    </button>
                    <button
                      onClick={() => handleLoadSample("asal")}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-100 rounded-lg font-medium transition-all"
                    >
                      Kes Bunuh Sek. 302 KK (Format Asal Umum)
                    </button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={() => handleLoadSample("empty")}
                      className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg font-bold transition-all"
                    >
                      Kosongkan Borang
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Drafts List button */}
          <button
            onClick={() => setShowDraftsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors border border-slate-700"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Draf ({drafts.length})</span>
          </button>

          {/* JSON upload button */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors border border-slate-700">
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>
        </div>
      </header>

      {/* Main Workspace Split layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Form Editor (Scrollable) */}
        <aside className="w-full lg:w-[55%] flex flex-col h-full bg-slate-100 border-r border-slate-200 overflow-hidden print:hidden">
          {/* Subheader tabs selector */}
          <div className="flex overflow-x-auto bg-white border-b border-slate-200 shrink-0 select-none no-scrollbar">
            {[
              { id: "rujukan", label: "Header & Fail", icon: FileText },
              { id: "entiti", label: "Saksi / OKT", icon: User },
              { id: "kejadian", label: "Kejadian", icon: Clock },
              { id: "hasil", label: "Hasil Siasatan", icon: ClipboardList },
              { id: "ulasan", label: "Ulasan / Cadangan", icon: MessageSquare },
              { id: "pegawai", label: "Tandatangan", icon: FileCheck }
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-semibold text-xs whitespace-nowrap transition-all ${
                    active
                      ? "border-blue-600 text-blue-600 bg-blue-50/30"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-blue-600" : "text-slate-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {/* AI Assistant (Always docked at top of rujukan for ease) */}
            {activeTab === "rujukan" && (
              <AiAssistant
                onDataGenerated={(generated) => setData(generated)}
                templateType={data.templateType}
              />
            )}

            {/* TAB: RUJUKAN & TEMPLATE */}
            {activeTab === "rujukan" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5 bg-white p-5 border border-slate-200 rounded-xl"
              >
                <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Rujukan & Jenis Minit
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      No Laporan Polis (Rpt)
                    </label>
                    <input
                      type="text"
                      value={data.rptNo}
                      onChange={(e) => updateField("rptNo", e.target.value)}
                      placeholder="Cth: Tuaran/Rpt/0448/2026"
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      No Kertas Siasatan (KS)
                    </label>
                    <input
                      type="text"
                      value={data.ksNo}
                      onChange={(e) => updateField("ksNo", e.target.value)}
                      placeholder="Cth: Tuaran/JSJ/KS/12/2026"
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Jenis Format / Template Minit
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "minit_pertama", label: "Format Baru: Minit Pertama (IO ke KBSJD)" },
                      { id: "dco", label: "Format Baru: Minit DCO (DCO ke YA TPR)" },
                      { id: "asal", label: "Format Asal: Komprehensif / Am" }
                    ].map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => updateField("templateType", tpl.id)}
                        className={`p-3 border rounded-lg text-center text-xs font-semibold flex flex-col justify-center items-center gap-1 transition-all ${
                          data.templateType === tpl.id
                            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                            : "border-slate-200 hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        {tpl.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Penerima Minit (YDH KBSJD / YA TPR)
                  </label>
                  <input
                    type="text"
                    value={data.penerima}
                    onChange={(e) => updateField("penerima", e.target.value)}
                    placeholder="Cth: YANG ARIF TIMBALAN PENDAKWARAYA NEGERI SABAH"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-bold"
                  />
                  <div className="flex gap-2 mt-1.5">
                    <button
                      type="button"
                      onClick={() => updateField("penerima", "YDH TUAN KBSJD TUARAN")}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
                    >
                      KBSJD Tuaran
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField("penerima", "YANG ARIF TIMBALAN PENDAKWARAYA NEGERI SABAH")}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
                    >
                      YA TPR Sabah
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Seksyen Siasatan Utama
                  </label>
                  <input
                    type="text"
                    value={data.seksyen}
                    onChange={(e) => updateField("seksyen", e.target.value)}
                    placeholder="Cth: Seksyen 379A Kanun Keseksaan"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Butiran Pengadu (Ringkasan)
                  </label>
                  <textarea
                    value={data.pengadu}
                    onChange={(e) => updateField("pengadu", e.target.value)}
                    rows={4}
                    placeholder="1 perempuan berumur 23 tahun berbangsa Bajau, berkerja sebagai seorang sales assistant..."
                    className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-sans"
                  />
                </div>
              </motion.div>
            )}

            {/* TAB: SAKSI / OKT / MANGSA */}
            {activeTab === "entiti" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Mangsa List (Only shown for Format Asal as standard) */}
                {data.templateType === "asal" && (
                  <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="font-bold text-sm uppercase text-slate-900 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-blue-600" />
                        Butiran Mangsa (M1, M2...)
                      </h3>
                      <button
                        type="button"
                        onClick={addMangsa}
                        className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                      >
                        <Plus className="w-3 h-3" /> Tambah Mangsa
                      </button>
                    </div>

                    {data.mangsaList.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Tiada mangsa ditapis.</p>
                    ) : (
                      <div className="space-y-4">
                        {data.mangsaList.map((m, idx) => (
                          <div key={m.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 relative">
                            <button
                              type="button"
                              onClick={() => removeMangsa(idx)}
                              className="absolute top-2 right-2 text-slate-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded mb-2">
                              {m.label}
                            </span>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <label className="block text-[10px] text-slate-500 font-bold mb-1">Nama</label>
                                <input
                                  type="text"
                                  value={m.nama}
                                  onChange={(e) => updateMangsa(idx, "nama", e.target.value)}
                                  placeholder="Nama penuh"
                                  className="w-full p-1.5 border rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-500 font-bold mb-1">No KP/IC</label>
                                <input
                                  type="text"
                                  value={m.ic}
                                  onChange={(e) => updateMangsa(idx, "ic", e.target.value)}
                                  placeholder="No IC"
                                  className="w-full p-1.5 border rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-500 font-bold mb-1">Jantina</label>
                                <select
                                  value={m.jantina}
                                  onChange={(e) => updateMangsa(idx, "jantina", e.target.value)}
                                  className="w-full p-1.5 border rounded bg-white"
                                >
                                  <option value="L">Lelaki</option>
                                  <option value="P">Perempuan</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-500 font-bold mb-1">Umur (Tahun)</label>
                                <input
                                  type="number"
                                  value={m.umur}
                                  onChange={(e) => updateMangsa(idx, "umur", e.target.value)}
                                  placeholder="Umur"
                                  className="w-full p-1.5 border rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-500 font-bold mb-1">Bangsa</label>
                                <input
                                  type="text"
                                  value={m.bangsa}
                                  onChange={(e) => updateMangsa(idx, "bangsa", e.target.value)}
                                  placeholder="Cth: Suluk, Bajau"
                                  className="w-full p-1.5 border rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-500 font-bold mb-1">Warganegara</label>
                                <input
                                  type="text"
                                  value={m.warganegara}
                                  onChange={(e) => updateMangsa(idx, "warganegara", e.target.value)}
                                  placeholder="W/Malaysia"
                                  className="w-full p-1.5 border rounded"
                                />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[10px] text-slate-500 font-bold mb-1">Alamat</label>
                                <input
                                  type="text"
                                  value={m.alamat}
                                  onChange={(e) => updateMangsa(idx, "alamat", e.target.value)}
                                  placeholder="Alamat penuh kediaman"
                                  className="w-full p-1.5 border rounded"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* OKT / Tangkapan List (Always crucial) */}
                <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-sm uppercase text-slate-900 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-orange-600" />
                      Tangkapan / Orang Kena Tuduh (OKT)
                    </h3>
                    <button
                      type="button"
                      onClick={addOkt}
                      className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                    >
                      <Plus className="w-3 h-3" /> Tambah OKT
                    </button>
                  </div>

                  {data.oktList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Tiada Tangkapan/OKT.</p>
                  ) : (
                    <div className="space-y-4">
                      {data.oktList.map((okt, idx) => (
                        <div key={okt.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 relative">
                          <button
                            type="button"
                            onClick={() => removeOkt(idx)}
                            className="absolute top-2 right-2 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <span className="inline-block bg-orange-100 text-orange-800 text-[10px] font-bold px-1.5 py-0.5 rounded mb-2">
                            {okt.label}
                          </span>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-1">Nama OKT</label>
                              <input
                                type="text"
                                value={okt.nama}
                                onChange={(e) => updateOkt(idx, "nama", e.target.value)}
                                placeholder="Nama penuh OKT"
                                className="w-full p-1.5 border rounded"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-1">No KP / Passport / Tiada Dokumen</label>
                              <input
                                type="text"
                                value={okt.ic}
                                onChange={(e) => updateOkt(idx, "ic", e.target.value)}
                                placeholder="Cth: 920524-12-5595"
                                className="w-full p-1.5 border rounded"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-1">Jantina</label>
                              <select
                                value={okt.jantina}
                                onChange={(e) => updateOkt(idx, "jantina", e.target.value)}
                                className="w-full p-1.5 border rounded bg-white"
                              >
                                <option value="L">Lelaki</option>
                                <option value="P">Perempuan</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-1">Umur</label>
                              <input
                                type="number"
                                value={okt.umur}
                                onChange={(e) => updateOkt(idx, "umur", e.target.value)}
                                placeholder="Umur"
                                className="w-full p-1.5 border rounded"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-1">Bangsa</label>
                              <input
                                type="text"
                                value={okt.bangsa}
                                onChange={(e) => updateOkt(idx, "bangsa", e.target.value)}
                                placeholder="Cth: Bajau, Bugis"
                                className="w-full p-1.5 border rounded"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-1">Kewarganegaraan</label>
                              <input
                                type="text"
                                value={okt.warganegara}
                                onChange={(e) => updateOkt(idx, "warganegara", e.target.value)}
                                placeholder="Cth: W/Malaysia, W/Filipina"
                                className="w-full p-1.5 border rounded"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-1">Pekerjaan</label>
                              <input
                                type="text"
                                value={okt.pekerjaan}
                                onChange={(e) => updateOkt(idx, "pekerjaan", e.target.value)}
                                placeholder="Cth: Buruh Kasar"
                                className="w-full p-1.5 border rounded"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-1">Alamat Kediaman OKT</label>
                              <input
                                type="text"
                                value={okt.alamat}
                                onChange={(e) => updateOkt(idx, "alamat", e.target.value)}
                                placeholder="Alamat penuh"
                                className="w-full p-1.5 border rounded"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Status Reman OKT (Penerangan bertulis)
                    </label>
                    <input
                      type="text"
                      value={data.remanStatus}
                      onChange={(e) => updateField("remanStatus", e.target.value)}
                      placeholder="Cth: Reman B1 akan tamat pada 13/02/2026."
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: BUTIRAN KEJADIAN */}
            {activeTab === "kejadian" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-5 border border-slate-200 rounded-xl space-y-5"
              >
                <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Butiran Kejadian & Masa
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Tarikh dan Masa Kejadian (Bertulis)
                  </label>
                  <input
                    type="text"
                    value={data.tarikhMasa}
                    onChange={(e) => updateField("tarikhMasa", e.target.value)}
                    placeholder="Cth: 20/01/2026 lebih kurang jam 1900 hrs."
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Tempat Kejadian (TK)
                  </label>
                  <input
                    type="text"
                    value={data.tempatKejadian}
                    onChange={(e) => updateField("tempatKejadian", e.target.value)}
                    placeholder="Cth: Kebun sayur di Kg. Tambalang, Tuaran, Sabah."
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Keterangan Kes (Standard Statement)
                  </label>
                  <input
                    type="text"
                    value={data.keteranganKes}
                    onChange={(e) => updateField("keteranganKes", e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
                  />
                </div>
              </motion.div>
            )}

            {/* TAB: HASIL SIASATAN */}
            {activeTab === "hasil" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Rakaman Saksi */}
                <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-sm uppercase text-slate-900 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-blue-600" />
                      Rakaman Percakapan Saksi (A1, A2...)
                    </h3>
                    <button
                      type="button"
                      onClick={addSaksi}
                      className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                    >
                      <Plus className="w-3 h-3" /> Tambah Saksi
                    </button>
                  </div>

                  <div className="space-y-4">
                    {data.rakamanSaksi.map((saksi, sIdx) => (
                      <div key={saksi.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 space-y-3 relative">
                        <button
                          type="button"
                          onClick={() => removeSaksi(sIdx)}
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold mb-1">Label (e.g. A1, A2)</label>
                            <input
                              type="text"
                              value={saksi.label}
                              onChange={(e) => updateSaksiMeta(sIdx, "label", e.target.value)}
                              className="w-full p-1.5 border rounded"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[10px] text-slate-500 font-bold mb-1">Nama Saksi</label>
                            <input
                              type="text"
                              value={saksi.nama}
                              onChange={(e) => updateSaksiMeta(sIdx, "nama", e.target.value)}
                              placeholder="Nama penuh saksi"
                              className="w-full p-1.5 border rounded"
                            />
                          </div>
                          <div className="col-span-3">
                            <label className="block text-[10px] text-slate-500 font-bold mb-1">No Kad Pengenalan (KP)</label>
                            <input
                              type="text"
                              value={saksi.ic}
                              onChange={(e) => updateSaksiMeta(sIdx, "ic", e.target.value)}
                              placeholder="Cth: 650123-12-5224"
                              className="w-full p-1.5 border rounded"
                            />
                          </div>
                        </div>

                        {/* Saksi Statements Point-by-point */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-[10px] font-bold text-slate-600 uppercase">
                              Butiran Kenyataan (i, ii, iii...)
                            </label>
                            <button
                              type="button"
                              onClick={() => addSaksiPercakapanPoin(sIdx)}
                              className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 font-bold"
                            >
                              <Plus className="w-2.5 h-2.5" /> Tambah Poin
                            </button>
                          </div>
                          {saksi.percakapan.map((stmt, pIdx) => (
                            <div key={pIdx} className="flex gap-2 items-center">
                              <span className="text-xs font-semibold text-slate-500 shrink-0 w-4">
                                {["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"][pIdx] || `${pIdx + 1}.`}
                              </span>
                              <input
                                type="text"
                                value={stmt}
                                onChange={(e) => updateSaksiPercakapanPoin(sIdx, pIdx, e.target.value)}
                                placeholder="Masukkan kenyataan saksi..."
                                className="w-full p-1.5 border text-xs rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeSaksiPercakapanPoin(sIdx, pIdx)}
                                className="text-slate-400 hover:text-red-500"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Siasatan TK, MO & Others */}
                <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4">
                  <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4 text-blue-600" />
                    Catatan Siasatan Lapangan
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Siasatan di Tempat Kejadian (TK)
                    </label>
                    <textarea
                      value={data.siasatanTK}
                      onChange={(e) => updateField("siasatanTK", e.target.value)}
                      rows={4}
                      placeholder="Terangkan perihal bangunan, struktur atau kedudukan barang..."
                      className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Modus Operandi (MO)
                    </label>
                    <textarea
                      value={data.modusOperandi}
                      onChange={(e) => updateField("modusOperandi", e.target.value)}
                      rows={3}
                      placeholder="Cth: Suspek masuk ke kebun dengan membawa..."
                      className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-sans"
                    />
                  </div>

                  {data.templateType === "asal" && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                        Semakan Jabatan Imigresen
                      </label>
                      <input
                        type="text"
                        value={data.semakanImigresen}
                        onChange={(e) => updateField("semakanImigresen", e.target.value)}
                        placeholder="Cth: Tiada rekod keluar masuk bagi B1..."
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Ujian Saringan Air Kencing / Keputusan
                    </label>
                    <input
                      type="text"
                      value={data.semakanUjianAirKencing}
                      onChange={(e) => updateField("semakanUjianAirKencing", e.target.value)}
                      placeholder="Cth: B2 positif Amph dan Meth..."
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    />
                  </div>

                  {/* Laporan Kawad Cam / Pengecaman */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Laporan Kawad Cam / Pengecaman Barang Bukti
                    </label>
                    <textarea
                      value={data.laporanKawadCam}
                      onChange={(e) => updateField("laporanKawadCam", e.target.value)}
                      rows={3}
                      placeholder="Hasil kawad cam mendapati saksi berjaya mengecam..."
                      className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-sans"
                    />
                  </div>

                  {/* Laporan Perubatan (Only asal / custom) */}
                  {data.templateType === "asal" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                          Laporan Perubatan / Postmortem
                        </label>
                        <textarea
                          value={data.laporanPerubatan}
                          onChange={(e) => updateField("laporanPerubatan", e.target.value)}
                          rows={3}
                          placeholder="Post mortem dijalankan oleh Dr... Kecederaan..."
                          className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                          Senjata Pembunuhan / Bukti Utama
                        </label>
                        <textarea
                          value={data.senjata}
                          onChange={(e) => updateField("senjata", e.target.value)}
                          rows={3}
                          placeholder="Sebilah pisau bersarung kayu..."
                          className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                          Rampasan Lain-lain
                        </label>
                        <textarea
                          value={data.rampasanLain}
                          onChange={(e) => updateField("rampasanLain", e.target.value)}
                          rows={3}
                          placeholder="Bot, pakaian, telefon bimbit..."
                          className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                          Motif Kejadian
                        </label>
                        <textarea
                          value={data.motifKejadian}
                          onChange={(e) => updateField("motifKejadian", e.target.value)}
                          rows={2}
                          placeholder="B4 dan B8 tidak berpuashati kerana..."
                          className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-sans"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Rekod Lampau OKT */}
                <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-sm uppercase text-slate-900 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-orange-600" />
                      Semakan Rekod Lampau OKT
                    </h3>
                    <button
                      type="button"
                      onClick={addRekodLampau}
                      className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                    >
                      <Plus className="w-3 h-3" /> Tambah Rekod OKT
                    </button>
                  </div>

                  <div className="space-y-4">
                    {data.semakanRekodLampau.map((rl, rIdx) => (
                      <div key={rl.id} className="p-3 border rounded-lg bg-slate-50/50 space-y-2 relative">
                        <button
                          type="button"
                          onClick={() => removeRekodLampau(rIdx)}
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-bold text-slate-600">OKT Label (e.g. B1, B2):</label>
                          <input
                            type="text"
                            value={rl.oktLabel}
                            onChange={(e) => updateRekodMeta(rIdx, e.target.value)}
                            className="p-1 border rounded w-16 text-center text-xs font-bold"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Senarai Kes / Jenayah</span>
                            <button
                              type="button"
                              onClick={() => addRekodPoin(rIdx)}
                              className="text-[10px] text-blue-600 font-bold"
                            >
                              + Tambah Rekod
                            </button>
                          </div>
                          {rl.rekod.map((rek, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <span className="text-xs font-bold text-slate-400">{idx + 1}.</span>
                              <input
                                type="text"
                                value={rek}
                                onChange={(e) => updateRekodPoin(rIdx, idx, e.target.value)}
                                placeholder="Cth: Sek. 15(1)ADB - tahun 2020"
                                className="w-full p-1.5 border rounded text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => removeRekodPoin(rIdx, idx)}
                                className="text-slate-400 hover:text-red-500"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rampasan Barang Bukti */}
                <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-sm uppercase text-slate-900 flex items-center gap-1.5">
                      <ClipboardList className="w-4 h-4 text-blue-600" />
                      Rampasan Barang Kes (Perenggan)
                    </h3>
                    <button
                      type="button"
                      onClick={() => addStringItem("rampasanBarangKes", "")}
                      className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                    >
                      <Plus className="w-3 h-3" /> Tambah Perenggan Rampasan
                    </button>
                  </div>

                  <div className="space-y-3">
                    {data.rampasanBarangKes.map((r, rIdx) => (
                      <div key={rIdx} className="flex gap-2 items-start bg-slate-50/50 p-2 border rounded-lg">
                        <span className="text-xs font-bold text-slate-400 mt-2 shrink-0">{rIdx + 1}.</span>
                        <textarea
                          value={r}
                          onChange={(e) => updateStringItem("rampasanBarangKes", rIdx, e.target.value)}
                          rows={3}
                          placeholder="Cth: Sebilah parang bersarung..."
                          className="w-full text-xs p-2 border rounded font-sans focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeStringItem("rampasanBarangKes", rIdx)}
                          className="text-slate-400 hover:text-red-500 mt-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rakaman Percakapan OKT */}
                {data.templateType !== "dco" && (
                  <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="font-bold text-sm uppercase text-slate-900 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-orange-600" />
                        Rakaman Percakapan OKT (B1, B2...)
                      </h3>
                      <button
                        type="button"
                        onClick={addRakamanOkt}
                        className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                      >
                        <Plus className="w-3 h-3" /> Tambah Rakaman OKT
                      </button>
                    </div>

                    <div className="space-y-4">
                      {data.rakamanOkt.map((rokt, sIdx) => (
                        <div key={rokt.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 space-y-3 relative">
                          <button
                            type="button"
                            onClick={() => removeRakamanOkt(sIdx)}
                            className="absolute top-2 right-2 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold mb-1">OKT Label (e.g. B1, B2)</label>
                              <input
                                type="text"
                                value={rokt.oktLabel}
                                onChange={(e) => updateRakamanOktMeta(sIdx, "oktLabel", e.target.value)}
                                className="w-full p-1.5 border rounded text-center font-bold"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[10px] text-slate-500 font-bold mb-1">Nama Penuh OKT</label>
                              <input
                                type="text"
                                value={rokt.nama}
                                onChange={(e) => updateRakamanOktMeta(sIdx, "nama", e.target.value)}
                                placeholder="Nama"
                                className="w-full p-1.5 border rounded"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="block text-[10px] font-bold text-slate-600 uppercase">
                                Butiran Percakapan OKT (i, ii, iii...)
                              </label>
                              <button
                                type="button"
                                onClick={() => addRakamanOktPoin(sIdx)}
                                className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 font-bold"
                              >
                                <Plus className="w-2.5 h-2.5" /> Tambah Poin
                              </button>
                            </div>
                            {rokt.butiran.map((stmt, pIdx) => (
                              <div key={pIdx} className="flex gap-2 items-center">
                                <span className="text-xs font-semibold text-slate-500 shrink-0 w-4">
                                  {["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"][pIdx] || `${pIdx + 1}.`}
                                </span>
                                <input
                                  type="text"
                                  value={stmt}
                                  onChange={(e) => updateRakamanOktPoin(sIdx, pIdx, e.target.value)}
                                  placeholder="Mengaku..."
                                  className="w-full p-1.5 border text-xs rounded"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeRakamanOktPoin(sIdx, pIdx)}
                                  className="text-slate-400 hover:text-red-500"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: ULASAN & CADANGAN */}
            {activeTab === "ulasan" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Ulasan List */}
                <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-sm uppercase text-slate-900 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      Perenggan Ulasan / Rumusan
                    </h3>
                    <button
                      type="button"
                      onClick={() => addStringItem("ulasan", "")}
                      className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                    >
                      <Plus className="w-3 h-3" /> Tambah Perenggan
                    </button>
                  </div>

                  <div className="space-y-3">
                    {data.ulasan.map((ul, idx) => (
                      <div key={idx} className="flex gap-2 items-start bg-slate-50/50 p-2 border rounded-lg">
                        <span className="text-xs font-bold text-slate-400 mt-2 shrink-0">Ulasan {idx + 1}:</span>
                        <textarea
                          value={ul}
                          onChange={(e) => updateStringItem("ulasan", idx, e.target.value)}
                          rows={3}
                          placeholder="Cth: Hasil siasatan menunjukkan bukti kukuh..."
                          className="w-full text-xs p-2 border rounded font-sans focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeStringItem("ulasan", idx)}
                          className="text-slate-400 hover:text-red-500 mt-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cadangan List */}
                <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-sm uppercase text-slate-900 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-green-600" />
                      Cadangan Tindakan / Pertuduhan
                    </h3>
                    <button
                      type="button"
                      onClick={() => addStringItem("cadangan", "")}
                      className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                    >
                      <Plus className="w-3 h-3" /> Tambah Cadangan
                    </button>
                  </div>

                  <div className="space-y-3">
                    {data.cadangan.map((cad, idx) => (
                      <div key={idx} className="flex gap-2 items-start bg-slate-50/50 p-2 border rounded-lg">
                        <span className="text-xs font-bold text-slate-400 mt-2 shrink-0">Cadangan {idx + 1}:</span>
                        <textarea
                          value={cad}
                          onChange={(e) => updateStringItem("cadangan", idx, e.target.value)}
                          rows={2}
                          placeholder="Cth: Tuduh OKT di bawah Seksyen..."
                          className="w-full text-xs p-2 border rounded font-sans focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeStringItem("cadangan", idx)}
                          className="text-slate-400 hover:text-red-500 mt-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: TANDATANGAN PEGAWAI */}
            {activeTab === "pegawai" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-5 border border-slate-200 rounded-xl space-y-5"
              >
                <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  Butiran Pegawai Menandatangan
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Nama Pegawai (Huruf Besar)
                    </label>
                    <input
                      type="text"
                      value={data.namaPegawai}
                      onChange={(e) => updateField("namaPegawai", e.target.value.toUpperCase())}
                      placeholder="Cth: HUMPHREY EDDIE"
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 uppercase font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Pangkat Pegawai
                    </label>
                    <input
                      type="text"
                      value={data.pangkat}
                      onChange={(e) => updateField("pangkat", e.target.value)}
                      placeholder="Cth: SJN / INSP / ASP"
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Jawatan Pegawai
                  </label>
                  <textarea
                    value={data.jawatan}
                    onChange={(e) => updateField("jawatan", e.target.value)}
                    rows={2}
                    placeholder="Cth: Penolong Pegawai Penyiasat Jenayah"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    IPD / Bahagian
                  </label>
                  <input
                    type="text"
                    value={data.ipd}
                    onChange={(e) => updateField("ipd", e.target.value)}
                    placeholder="Cth: IPD Tuaran, Sabah"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>

                {/* Local save quick action */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
                  <h4 className="font-bold text-xs text-blue-800 uppercase">Simpan draf dalam browser</h4>
                  <p className="text-[10px] text-blue-600 leading-relaxed">
                    Anda boleh menyimpan draf ini dalam simpanan browser (Local Storage) untuk diteruskan kemudian.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Tajuk draf (cth: Kes Curi Motor)"
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      className="text-xs p-2 border border-blue-300 rounded-lg bg-white flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm"
                    >
                      Simpan Draf
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </aside>

        {/* Right Column: Live Document Preview Pane */}
        <main className="flex-1 flex flex-col h-full bg-slate-300 overflow-hidden">
          <MinitPreview
            data={data}
            onSaveDraft={handleSaveDraft}
            onExportJson={handleExportJson}
          />
        </main>
      </div>

      {/* MODAL: Draf Tersimpan List */}
      <AnimatePresence>
        {showDraftsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDraftsModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden text-slate-800 z-10"
            >
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                <h3 className="font-bold text-sm uppercase tracking-wide">
                  Draf Minit Tersimpan ({drafts.length})
                </h3>
                <button
                  onClick={() => setShowDraftsModal(false)}
                  className="text-slate-400 hover:text-white font-bold text-xs"
                >
                  Tutup
                </button>
              </div>

              <div className="p-5 max-h-[400px] overflow-y-auto space-y-3">
                {drafts.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs italic">
                    Tiada draf tersimpan ditemui. Gunakan butiran &quot;Simpan Draf&quot; dalam editor.
                  </div>
                ) : (
                  drafts.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => handleLoadDraft(d.data)}
                      className="p-3 border border-slate-100 hover:border-blue-400 rounded-xl bg-slate-50 hover:bg-blue-50/20 cursor-pointer flex justify-between items-center transition-all group"
                    >
                      <div className="flex-1">
                        <h4 className="font-bold text-xs text-slate-800 group-hover:text-blue-700">
                          {d.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1">Disimpan pada: {d.date}</p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteDraft(d.id, e)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="Padam draf"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
