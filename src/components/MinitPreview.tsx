import React, { useRef } from "react";
import { Printer, Download, Save, FileText } from "lucide-react";
import { MinitData } from "../types";

interface MinitPreviewProps {
  data: MinitData;
  onSaveDraft?: () => void;
  onExportJson?: () => void;
}

// Word & Print friendly DocPara helper using standard hanging indents
interface DocParaProps {
  label?: string;
  title?: string;
  children?: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  key?: React.Key;
}

function DocPara({ label, title, children, level = 1 }: DocParaProps) {
  let marginLeft = "24pt";
  let textIndent = "-24pt";
  let marginBottom = "12pt";

  if (level === 2) {
    marginLeft = "48pt";
    textIndent = "-24pt";
    marginBottom = "8pt";
  } else if (level === 3) {
    marginLeft = "72pt";
    textIndent = "-24pt";
    marginBottom = "6pt";
  } else if (level === 4) {
    marginLeft = "96pt";
    textIndent = "-24pt";
    marginBottom = "4pt";
  }

  return (
    <div
      style={{
        marginLeft,
        textIndent,
        marginBottom,
        textAlign: "justify",
        fontFamily: "Tahoma, sans-serif",
        fontSize: "11pt",
        lineHeight: "1.5",
        color: "#000000",
      }}
    >
      {label && (
        <strong style={{ fontFamily: "Tahoma, sans-serif", fontWeight: "bold" }}>
          {label}&nbsp;&nbsp;&nbsp;
        </strong>
      )}
      {title && (
        <strong style={{ textTransform: "uppercase", fontFamily: "Tahoma, sans-serif", fontWeight: "bold" }}>
          {title}&nbsp;&nbsp;
        </strong>
      )}
      <span style={{ textIndent: 0 }}>{children}</span>
    </div>
  );
}

export default function MinitPreview({ data, onSaveDraft, onExportJson }: MinitPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const isInIframe = typeof window !== "undefined" && window.self !== window.top;

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = () => {
    const printableElement = document.getElementById("printable-area");
    if (!printableElement) return;

    // Clone the node to clean it up before exporting
    const clone = printableElement.cloneNode(true) as HTMLDivElement;
    
    // Remove all print-hidden items from clone
    const hiddenElements = clone.querySelectorAll(".print\\:hidden, .no-print");
    hiddenElements.forEach((el) => el.remove());

    // Extract the content from the table body cell to get a clean flat paragraph structure for MS Word
    const tbodyTd = clone.querySelector("tbody td");
    const contentHtml = tbodyTd ? tbodyTd.innerHTML : clone.innerHTML;

    const wordHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:w="urn:schemas-microsoft-com:office:word" 
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Minit Siasatan</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page Section1 {
            size: A4;
            margin: 2.0cm;
            mso-header-margin: 1.0cm;
            mso-footer-margin: 1.0cm;
            mso-header: h1;
          }
          div.Section1 {
            page: Section1;
          }
          body {
            font-family: "Tahoma", sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #000000;
            background-color: #ffffff;
          }
          p, div {
            margin: 0 0 12pt 0;
            text-align: justify;
            line-height: 1.5;
            font-family: "Tahoma", sans-serif;
            font-size: 11pt;
            color: #000000;
          }
          .recipient-heading {
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            font-weight: bold;
            text-transform: uppercase;
            margin: 0 0 18pt 0;
            line-height: 1.5;
            color: #000000;
          }
          .MsoHeader {
            margin: 0;
            font-family: "Tahoma", sans-serif;
            font-size: 6pt;
            color: #000000;
            line-height: 1.2;
          }
        </style>
      </head>
      <body>
        <div class="Section1">
          <!-- Word Header Element -->
          <div style="mso-element:header" id="h1">
            <p class="MsoHeader">
              ${data.rptNo || "Tuaran/Rpt/____/2026"}<br>
              ${data.ksNo || "Tuaran/JSJ/KS/____/2026"}
            </p>
          </div>
          
          ${contentHtml}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + wordHtml], {
      type: "application/msword;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    
    // Clean RPT for filename
    const cleanRpt = data.rptNo ? data.rptNo.replace(/[\/\\:*?"<>|]/g, "_") : "minit";
    a.download = `minit_${cleanRpt}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const { templateType } = data;

  return (
    <div className="flex flex-col h-full">
      {/* Action panel */}
      <div className="flex items-center justify-between gap-2 p-3 bg-slate-100 border-b border-slate-200 shrink-0 print:hidden rounded-t-xl">
        <span className="text-xs font-semibold text-slate-700 tracking-wide flex items-center gap-1">
          📄 LIVE DOCUMENT PREVIEW
        </span>
        <div className="flex items-center gap-1.5">
          {onSaveDraft && (
            <button
              onClick={onSaveDraft}
              title="Simpan draf ke Local Storage"
              className="p-1.5 md:px-2.5 md:py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all text-xs font-medium flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Simpan</span>
            </button>
          )}
          {onExportJson && (
            <button
              onClick={onExportJson}
              title="Muat turun draf sebagai JSON"
              className="p-1.5 md:px-2.5 md:py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all text-xs font-medium flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Eksport</span>
            </button>
          )}
          <button
            onClick={handleExportWord}
            title="Muat turun minit sebagai Dokumen Word (.doc)"
            className="p-1.5 md:px-3 md:py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all text-xs font-semibold flex items-center gap-1 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Dokumen Word</span>
          </button>
          <button
            onClick={handlePrint}
            className="p-1.5 md:px-3 md:py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-xs font-semibold flex items-center gap-1 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {isInIframe && (
        <div className="bg-amber-50 border-b border-amber-200 p-3 text-xs text-amber-800 flex items-start gap-2.5 print:hidden">
          <span className="text-sm">⚠️</span>
          <div>
            <p className="font-bold">
              Fungsi Cetak / PDF mungkin disekat oleh pelayar web di dalam mod preview (iframe).
            </p>
            <p className="mt-0.5 text-slate-600">
              Sila klik butang <strong className="text-slate-800">"Buka di Tab Baru"</strong> di penjuru kanan atas untuk mencetak atau menyimpan dokumen sebagai PDF dengan sempurna.
            </p>
          </div>
        </div>
      )}

      {/* A4 sheet preview wrapper */}
      <div className="flex-1 bg-slate-200 overflow-y-auto p-4 md:p-8 print:p-0 print:bg-white print:overflow-visible">
        {/* Printable Area */}
        <div
          ref={previewRef}
          id="printable-area"
          className="w-full max-w-[21cm] min-h-[29.7cm] mx-auto bg-white p-[1.5cm] md:p-[2cm] shadow-xl border border-slate-300 print:shadow-none print:border-none print:p-0 text-slate-900"
          style={{ fontFamily: "Tahoma, sans-serif", fontSize: "11pt", lineHeight: "1.5" }}
        >
          {/* Repeating table header structure for perfect multi-page browser print headers */}
          <table style={{ width: "100%", borderCollapse: "collapse", border: "none", margin: 0, padding: 0 }}>
            <thead>
              <tr>
                <td style={{ border: "none", padding: 0, paddingBottom: "30px" }}>
                  <div style={{ fontSize: "6pt", fontFamily: "Tahoma, sans-serif", textTransform: "uppercase", color: "#000000", lineHeight: "1.3" }}>
                    <div>{data.rptNo ? data.rptNo : "Tuaran/Rpt/____/2026"}</div>
                    <div>{data.ksNo ? data.ksNo : "Tuaran/JSJ/KS/____/2026"}</div>
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "none", padding: 0, verticalAlign: "top" }}>
                  {/* Subject banner / Recipient (Times New Roman Bold 12pt) */}
                  <div className="recipient-heading" style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "12pt", fontWeight: "bold", textTransform: "uppercase", marginBottom: "24pt", color: "#000000", lineHeight: "1.5" }}>
                    {data.penerima || (templateType === "dco" ? "YANG ARIF TIMBALAN PENDAKWARAYA NEGERI SABAH" : "YDH TUAN KBSJD TUARAN")}
                  </div>

                  {/* Template Type: ASAL */}
                  {templateType === "asal" && (
                    <React.Fragment>
                      <DocPara label="1.">
                        Diedarkan Kertas Siasatan untuk makluman dan arahan lanjut Yang Arif tuan.
                      </DocPara>

                      <DocPara label="2.">
                        Pegawai Penyiasat hadir untuk taklimat.
                      </DocPara>

                      <DocPara label="3.">
                        Kes disiasat di bawah {data.seksyen || "[Sila masukkan Seksyen]"}.
                      </DocPara>

                      <DocPara label="4.">
                        <span style={{ color: "#d12c2c" }} className="print:text-black">
                          *Cukup bagitahu jantina, umur dan pekerjaan. Contohnya:
                        </span>
                        <br />
                        {data.pengadu || "[Sila masukkan butiran pengadu]"}
                      </DocPara>

                      <DocPara label="5." title="Mangsa (A1/M1).">
                        {data.mangsaList.length > 0 ? (
                          data.mangsaList.map((mangsa, idx) => (
                            <span key={mangsa.id} style={{ display: "block", marginTop: idx > 0 ? "4pt" : 0 }}>
                              <strong>{mangsa.label}:</strong> {mangsa.nama}
                              {mangsa.ic ? `, KP/${mangsa.ic}` : ""}, {mangsa.jantina}/{mangsa.umur} Tahun,{" "}
                              {mangsa.bangsa}, {mangsa.warganegara}
                              {mangsa.alamat ? `, A/${mangsa.alamat}` : ""}.
                            </span>
                          ))
                        ) : (
                          <span style={{ color: "#71717a", fontStyle: "italic" }}>
                            [Tiada mangsa ditapis/dimasukkan]
                          </span>
                        )}
                      </DocPara>

                      <DocPara label="6." title="Tangkapan (OKT):">
                        {data.oktList.length > 0 ? (
                          data.oktList.map((okt, idx) => (
                            <span key={okt.id} style={{ display: "block", marginTop: idx > 0 ? "4pt" : 0 }}>
                              <strong>{okt.label}</strong> {okt.nama}
                              {okt.ic ? `, KP/${okt.ic}` : ""}, {okt.jantina}/{okt.umur} tahun, B/
                              {okt.bangsa}, W/{okt.warganegara}
                              {okt.pekerjaan ? `, K/${okt.pekerjaan}` : ""}
                              {okt.alamat ? `, A/${okt.alamat}` : ""}.
                            </span>
                          ))
                        ) : (
                          <span style={{ color: "#71717a", fontStyle: "italic" }}>
                            [Tiada Tangkapan/OKT]
                          </span>
                        )}
                        {data.remanStatus && (
                          <span style={{ display: "block", marginTop: "6pt", fontStyle: "italic" }}>
                            {data.remanStatus}
                          </span>
                        )}
                      </DocPara>

                      <DocPara label="7." title="Tarikh dan masa kejadian:">
                        {data.tarikhMasa || "[Sila masukkan Tarikh & Masa]"}
                      </DocPara>

                      <DocPara label="8." title="Tempat kejadian:">
                        {data.tempatKejadian || "[Sila masukkan Tempat Kejadian]"}
                      </DocPara>

                      <DocPara label="9.">
                        {data.keteranganKes}
                      </DocPara>

                      <DocPara label="10." title="Hasil Siasatan." />

                      <DocPara level={2} label="10.1." title="Rakaman percakapan Saksi." />

                      {data.rakamanSaksi.length > 0 ? (
                        data.rakamanSaksi.map((saksi, sIdx) => {
                          const sLabel = `10.1.${sIdx + 1}.`;
                          return (
                            <React.Fragment key={saksi.id}>
                              <DocPara level={3} label={sLabel}>
                                {saksi.nama}
                                {saksi.ic ? ` KP: ${saksi.ic}` : ""} ({saksi.label})
                              </DocPara>
                              {saksi.percakapan.map((line, lIdx) => {
                                const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"][lIdx] || `${lIdx + 1}.`;
                                return (
                                  <DocPara key={lIdx} level={4} label={`${roman}.`}>
                                    {line}
                                  </DocPara>
                                );
                              })}
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <DocPara level={3}>
                          <span style={{ color: "#71717a", fontStyle: "italic" }}>
                            [Tiada rakaman percakapan saksi]
                          </span>
                        </DocPara>
                      )}

                      {data.siasatanTK && (
                        <DocPara level={2} label="10.2." title="Siasatan di tempat kejadian.">
                          {data.siasatanTK}
                        </DocPara>
                      )}

                      {data.modusOperandi && (
                        <DocPara level={2} label="10.3." title="Modus oprandi.">
                          {data.modusOperandi}
                        </DocPara>
                      )}

                      {data.semakanImigresen && (
                        <DocPara level={2} label="10.4." title="Semakan Jabatan Imigresen Malaysia.">
                          {data.semakanImigresen}
                        </DocPara>
                      )}

                      {data.semakanUjianAirKencing && (
                        <DocPara level={2} label="10.5." title="Ujian Saringan Air Kencing.">
                          {data.semakanUjianAirKencing}
                        </DocPara>
                      )}

                      {data.semakanRekodLampau.length > 0 && (
                        <React.Fragment>
                          <DocPara level={2} label="10.6." title="Semakan rekod lampau." />
                          {data.semakanRekodLampau.map((rl, idx) => {
                            const rlLabel = `10.6.${idx + 1}.`;
                            return (
                              <React.Fragment key={rl.id}>
                                <DocPara level={3} label={rlLabel}>
                                  {rl.oktLabel} mempunyai {rl.rekod.length} rekod lampau iaitu:
                                </DocPara>
                                {rl.rekod.map((rek, rIdx) => {
                                  const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii"][rIdx] || `${rIdx + 1}.`;
                                  return (
                                    <DocPara key={rIdx} level={4} label={`${roman}.`}>
                                      {rek}
                                    </DocPara>
                                  );
                                })}
                              </React.Fragment>
                            );
                          })}
                        </React.Fragment>
                      )}

                      {data.rampasanBarangKes.length > 0 && (
                        <React.Fragment>
                          <DocPara level={2} label="10.7." title="Rampasan barang kes." />
                          {data.rampasanBarangKes.map((r, rIdx) => {
                            const rampLabel = `10.7.${rIdx + 1}.`;
                            return (
                              <DocPara key={rIdx} level={3} label={rampLabel}>
                                {r}
                              </DocPara>
                            );
                          })}
                        </React.Fragment>
                      )}

                      {data.laporanKawadCam && (
                        <DocPara level={2} label="10.8." title="Laporan Kawad Cam.">
                          {data.laporanKawadCam}
                        </DocPara>
                      )}

                      {data.laporanPerubatan && (
                        <DocPara level={2} label="10.9." title="Laporan Perubatan Mangsa / Laporan Awal Postmortem.">
                          {data.laporanPerubatan}
                        </DocPara>
                      )}

                      {data.senjata && (
                        <DocPara level={2} label="10.10." title="Senjata pembunuhan.">
                          {data.senjata}
                        </DocPara>
                      )}

                      {data.rampasanLain && (
                        <DocPara level={2} label="10.11." title="Rampasan barang kes yang lain.">
                          {data.rampasanLain}
                        </DocPara>
                      )}

                      {data.motifKejadian && (
                        <DocPara level={2} label="10.12." title="Motif kejadian.">
                          {data.motifKejadian}
                        </DocPara>
                      )}

                      {data.rakamanOkt.length > 0 && (
                        <React.Fragment>
                          <DocPara level={2} label="10.13." title="Rakaman percakapan OKT." />
                          {data.rakamanOkt.map((rokt, idx) => {
                            const roktLabel = `10.13.${idx + 1}.`;
                            return (
                              <React.Fragment key={rokt.id}>
                                <DocPara level={3} label={roktLabel}>
                                  {rokt.oktLabel} - {rokt.nama} {rokt.ic ? `, KP: ${rokt.ic}` : ""}
                                </DocPara>
                                {rokt.butiran.map((b, bIdx) => {
                                  const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii"][bIdx] || `${bIdx + 1}.`;
                                  return (
                                    <DocPara key={bIdx} level={4} label={`${roman}.`}>
                                      {b}
                                    </DocPara>
                                  );
                                })}
                              </React.Fragment>
                            );
                          })}
                        </React.Fragment>
                      )}

                      <DocPara label="11." title="Ulasan/rumusan." />
                      {data.ulasan.map((ul, idx) => {
                        const step = `11.${idx + 1}.`;
                        return (
                          <DocPara key={idx} level={2} label={step}>
                            {ul}
                          </DocPara>
                        );
                      })}

                      <DocPara label="12." title="Cadangan.">
                        Adalah dicadangkan :
                      </DocPara>
                      {data.cadangan.map((cad, idx) => {
                        const step = `12.${idx + 1}.`;
                        return (
                          <DocPara key={idx} level={2} label={step}>
                            {cad}
                          </DocPara>
                        );
                      })}
                      <DocPara level={2}>
                        Sekiranya Yang Arif tuan setuju.
                      </DocPara>

                      <DocPara label="13.">
                        Pohon nasihat dan arahan lanjut Yang Arif tuan.
                      </DocPara>
                      <DocPara level={1}>
                        Terima kasih
                      </DocPara>
                    </React.Fragment>
                  )}

                  {/* Template Type: MINIT PERTAMA */}
                  {templateType === "minit_pertama" && (
                    <React.Fragment>
                      <DocPara label="1.">
                        Diedarkan Kertas Siasatan untuk makluman YDH Tuan.
                      </DocPara>

                      <DocPara label="2.">
                        Kes disiasat di bawah {data.seksyen || "[Sila masukkan Seksyen]"}.
                      </DocPara>

                      <DocPara label="3.">
                        {data.pengadu || "[Sila masukkan butiran pengadu]"}
                      </DocPara>

                      <DocPara label="4." title="Tangkapan (OKT):">
                        {data.oktList.map((okt, idx) => (
                          <span key={okt.id} style={{ display: "block", marginTop: idx > 0 ? "4pt" : 0 }}>
                            <strong>{okt.label}</strong> {okt.nama}
                            {okt.ic ? `, KP/${okt.ic}` : ""}, {okt.jantina}/{okt.umur} tahun, B/
                            {okt.bangsa}, A/{okt.alamat}, K/{okt.pekerjaan}.
                          </span>
                        ))}
                        {data.remanStatus && (
                          <span style={{ display: "block", marginTop: "6pt", fontStyle: "italic" }}>
                            {data.remanStatus}
                          </span>
                        )}
                      </DocPara>

                      <DocPara label="5." title="Tarikh dan masa kejadian:">
                        {data.tarikhMasa || "[Sila masukkan Tarikh & Masa]"}
                      </DocPara>

                      <DocPara label="6." title="Tempat kejadian:">
                        {data.tempatKejadian || "[Sila masukkan Tempat Kejadian]"}
                      </DocPara>

                      <DocPara label="7.">
                        {data.keteranganKes}
                      </DocPara>

                      <DocPara label="8." title="Hasil Siasatan." />

                      <DocPara level={2} label="8.1." title="Rakaman percakapan Pengadu/Saksi/Pegawai Penangkap." />
                      {data.rakamanSaksi.map((saksi, sIdx) => {
                        const sLabel = `8.1.${sIdx + 1}.`;
                        return (
                          <React.Fragment key={saksi.id}>
                            <DocPara level={3} label={sLabel}>
                              {saksi.nama}
                              {saksi.ic ? `, KP: ${saksi.ic}` : ""} ({saksi.label})
                            </DocPara>
                            {saksi.percakapan.map((line, lIdx) => {
                              const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"][lIdx] || `${lIdx + 1}.`;
                              return (
                                <DocPara key={lIdx} level={4} label={`${roman}.`}>
                                  {line}
                                </DocPara>
                              );
                            })}
                          </React.Fragment>
                        );
                      })}

                      {data.siasatanTK && (
                        <DocPara level={2} label="8.2." title="Siasatan di tempat kejadian.">
                          {data.siasatanTK}
                        </DocPara>
                      )}

                      {data.modusOperandi && (
                        <DocPara level={2} label="8.3." title="Modus operandi.">
                          {data.modusOperandi}
                        </DocPara>
                      )}

                      {data.semakanRekodLampau.length > 0 && (
                        <React.Fragment>
                          <DocPara level={2} label="8.4." title="Semakan rekod lampau." />
                          {data.semakanRekodLampau.map((rl, idx) => {
                            const rlLabel = `8.4.${idx + 1}.`;
                            return (
                              <React.Fragment key={rl.id}>
                                <DocPara level={3} label={rlLabel}>
                                  {rl.oktLabel} pernah ditangkap dan dihukum atas kesalahan:
                                </DocPara>
                                {rl.rekod.map((rek, rIdx) => (
                                  <DocPara key={rIdx} level={4} label="-">
                                    {rek}
                                  </DocPara>
                                ))}
                              </React.Fragment>
                            );
                          })}
                        </React.Fragment>
                      )}

                      {data.semakanUjianAirKencing && (
                        <DocPara level={2} label="8.5." title="Saringan air kencing.">
                          {data.semakanUjianAirKencing}
                        </DocPara>
                      )}

                      {data.rampasanBarangKes.length > 0 && (
                        <React.Fragment>
                          <DocPara level={2} label="8.6." title="Rampasan barang kes / Pengecaman." />
                          {data.rampasanBarangKes.map((r, rIdx) => (
                            <DocPara key={rIdx} level={3} label="-">
                              {r}
                            </DocPara>
                          ))}
                        </React.Fragment>
                      )}

                      {data.rakamanOkt.length > 0 && (
                        <React.Fragment>
                          <DocPara level={2} label="8.7." title="Rakaman percakapan OKT." />
                          {data.rakamanOkt.map((rokt, idx) => {
                            const roktLabel = `8.7.${idx + 1}.`;
                            return (
                              <React.Fragment key={rokt.id}>
                                <DocPara level={3} label={roktLabel}>
                                  {rokt.oktLabel} – {rokt.nama}
                                </DocPara>
                                {rokt.butiran.map((b, bIdx) => {
                                  const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii"][bIdx] || `${bIdx + 1}.`;
                                  return (
                                    <DocPara key={bIdx} level={4} label={`${roman}.`}>
                                      {b}
                                    </DocPara>
                                  );
                                })}
                              </React.Fragment>
                            );
                          })}
                        </React.Fragment>
                      )}

                      <DocPara label="9." title="Ulasan/rumusan." />
                      {data.ulasan.map((ul, idx) => {
                        const step = `9.${idx + 1}.`;
                        return (
                          <DocPara key={idx} level={2} label={step}>
                            {ul}
                          </DocPara>
                        );
                      })}

                      <DocPara label="10." title="Cadangan." />
                      {data.cadangan.map((cad, idx) => {
                        const step = `10.${idx + 1}.`;
                        return (
                          <DocPara key={idx} level={2} label={step}>
                            {cad}
                          </DocPara>
                        );
                      })}

                      <DocPara label="11.">
                        Pohon nasihat dan arahan lanjut YDH Tuan.
                      </DocPara>
                      <DocPara level={1}>
                        Terima kasih.
                      </DocPara>
                    </React.Fragment>
                  )}

                  {/* Template Type: DCO */}
                  {templateType === "dco" && (
                    <React.Fragment>
                      <DocPara label="1.">
                        Diedarkan Kertas Siasatan untuk makluman YDH Tuan.
                      </DocPara>

                      <DocPara label="2.">
                        Pegawai Penyiasat Kes hadir untuk taklimat.
                      </DocPara>

                      <DocPara label="3.">
                        Kes disiasat di bawah {data.seksyen || "[Sila masukkan Seksyen]"}.
                      </DocPara>

                      <DocPara label="4.">
                        {data.pengadu || "[Sila masukkan butiran pengadu]"}
                      </DocPara>

                      <DocPara label="5." title="Tangkapan (OKT):">
                        {data.oktList.map((okt, idx) => (
                          <span key={okt.id} style={{ display: "block", marginTop: idx > 0 ? "4pt" : 0 }}>
                            <strong>{okt.label}</strong> {okt.nama}
                            {okt.ic ? `, KP/${okt.ic}` : ""}, {okt.jantina}/{okt.umur} tahun, B/
                            {okt.bangsa}, A/{okt.alamat}, K/{okt.pekerjaan}.
                          </span>
                        ))}
                        {data.remanStatus && (
                          <span style={{ display: "block", marginTop: "6pt", fontStyle: "italic" }}>
                            {data.remanStatus}
                          </span>
                        )}
                      </DocPara>

                      <DocPara label="6." title="Tarikh dan masa kejadian:">
                        {data.tarikhMasa || "[Sila masukkan Tarikh & Masa]"}
                      </DocPara>

                      <DocPara label="7." title="Tempat kejadian:">
                        {data.tempatKejadian || "[Sila masukkan Tempat Kejadian]"}
                      </DocPara>

                      <DocPara label="8.">
                        {data.keteranganKes}
                      </DocPara>

                      <DocPara label="9." title="Hasil Siasatan." />

                      {data.rakamanSaksi.map((saksi, sIdx) => {
                        const sLabel = `9.${sIdx + 1}.`;
                        return (
                          <React.Fragment key={saksi.id}>
                            <DocPara level={2} label={sLabel}>
                              Hasil rakaman percakapan {saksi.nama}
                              {saksi.ic ? `, KP: ${saksi.ic}` : ""} ({saksi.label})
                            </DocPara>
                            {saksi.percakapan.map((line, lIdx) => (
                              <DocPara key={lIdx} level={3} label="-">
                                {line}
                              </DocPara>
                            ))}
                          </React.Fragment>
                        );
                      })}

                      {data.semakanRekodLampau.length > 0 && (
                        <React.Fragment>
                          <DocPara level={2} label="9.3." title="Semakan rekod lampau / Saringan." />
                          {data.semakanRekodLampau.map((rl, idx) => (
                            <React.Fragment key={rl.id}>
                              <DocPara level={3} label="9.3.1.">
                                {rl.oktLabel} pernah ditangkap dan dihukum atas kesalahan:
                              </DocPara>
                              {rl.rekod.map((rek, rIdx) => (
                                <DocPara key={rIdx} level={4} label="-">
                                  {rek}
                                </DocPara>
                              ))}
                            </React.Fragment>
                          ))}
                          {data.semakanUjianAirKencing && (
                            <DocPara level={3}>
                              Keputusan Saringan: {data.semakanUjianAirKencing}
                            </DocPara>
                          )}
                        </React.Fragment>
                      )}

                      {data.rampasanBarangKes.length > 0 && (
                        <React.Fragment>
                          <DocPara level={2} label="9.4." title="Rampasan barang kes." />
                          {data.rampasanBarangKes.map((r, rIdx) => {
                            const rampLabel = `9.4.${rIdx + 1}.`;
                            return (
                              <DocPara key={rIdx} level={3} label={rampLabel}>
                                {r}
                              </DocPara>
                            );
                          })}
                        </React.Fragment>
                      )}

                      {data.laporanKawadCam && (
                        <DocPara level={2} label="9.5." title="Pengecaman barang kes / Laporan Kawad Cam.">
                          {data.laporanKawadCam}
                        </DocPara>
                      )}

                      <DocPara label="10." title="Ulasan/rumusan." />
                      {data.ulasan.map((ul, idx) => {
                        const step = `10.${idx + 1}.`;
                        return (
                          <DocPara key={idx} level={2} label={step}>
                            {ul}
                          </DocPara>
                        );
                      })}

                      <DocPara label="11." title="Cadangan.">
                        Cadangan IO kes seperti di minit (1) dipersetujui untuk menuduh:
                      </DocPara>
                      {data.cadangan.map((cad, idx) => {
                        const step = `11.${idx + 1}.`;
                        return (
                          <DocPara key={idx} level={2} label={step}>
                            {cad}
                          </DocPara>
                        );
                      })}

                      <DocPara label="12.">
                        Pohon nasihat dan arahan lanjut YA Tuan.
                      </DocPara>
                      <DocPara level={1}>
                        Terima kasih.
                      </DocPara>
                    </React.Fragment>
                  )}

                  {/* Signature/Sign-off Footer */}
                  <div
                    className="print-avoid-break"
                    style={{
                      marginLeft: "auto",
                      marginRight: 0,
                      width: "250px",
                      textAlign: "left",
                      marginTop: "40pt",
                      pageBreakInside: "avoid",
                      breakInside: "avoid"
                    }}
                  >
                    <div style={{ marginBottom: "40pt" }}>
                      <p style={{ color: "#a1a1aa", fontStyle: "italic", fontSize: "9pt" }} className="print:hidden">
                        [Tandatangan Pegawai]
                      </p>
                    </div>
                    <p style={{ fontWeight: "bold", textTransform: "uppercase", fontFamily: "Tahoma, sans-serif", fontSize: "11pt", margin: 0 }}>
                      ({data.namaPegawai || "NAMA PEGAWAI"}) {data.pangkat || "PANGKAT"}
                    </p>
                    <p style={{ fontFamily: "Tahoma, sans-serif", fontSize: "11pt", margin: 0, whiteSpace: "pre-line" }}>
                      {data.jawatan || "Jawatan Pegawai"}
                    </p>
                    <p style={{ fontFamily: "Tahoma, sans-serif", fontSize: "11pt", margin: 0 }}>
                      {data.ipd || "IPD Tempat"}
                    </p>
                  </div>
                  <div className="clear-both"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
