/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface OktItem {
  id: string;
  label: string; // e.g. "B1", "B2"
  nama: string;
  ic: string;
  jantina: string;
  umur: string;
  bangsa: string;
  warganegara: string;
  pekerjaan: string;
  alamat: string;
}

export interface MangsaItem {
  id: string;
  label: string; // e.g. "A1/M1"
  nama: string;
  ic: string;
  jantina: string;
  umur: string;
  bangsa: string;
  warganegara: string;
  alamat: string;
}

export interface SaksiPercakapan {
  id: string;
  nama: string;
  ic: string;
  label: string; // e.g. "A1", "A2"
  percakapan: string[]; // List of points (i, ii, iii)
}

export interface RekodLampauItem {
  id: string;
  oktLabel: string; // e.g. "B1"
  rekod: string[]; // List of points
}

export interface RakamanOktItem {
  id: string;
  oktLabel: string; // e.g. "B1"
  nama: string;
  ic?: string;
  butiran: string[]; // List of points (i, ii, iii)
}

export interface MinitData {
  id?: string;
  title?: string;
  updatedAt?: string;

  // Header info
  rptNo: string;
  ksNo: string;
  penerima: string; // "YDH TUAN KBSJD TUARAN" | "YANG ARIF TIMBALAN PENDAKWARAYA NEGERI SABAH" | Custom
  templateType: "asal" | "minit_pertama" | "dco";

  // General items
  seksyen: string; // "Seksyen 379A Kanun Keseksaan"
  pengadu: string; // Raw paragraph

  // Entities
  mangsaList: MangsaItem[];
  oktList: OktItem[];
  remanStatus: string; // Text summary of remand

  // Incident details
  tarikhMasa: string;
  tempatKejadian: string;
  keteranganKes: string; // e.g., "Keterangan kes adalah seperti di muka surat 2 kertas siasatan."

  // Hasil Siasatan
  rakamanSaksi: SaksiPercakapan[];
  siasatanTK: string; // TK details
  modusOperandi: string;
  semakanImigresen: string;
  semakanUjianAirKencing: string;
  semakanRekodLampau: RekodLampauItem[];
  rampasanBarangKes: string[];
  laporanKawadCam: string;
  laporanPerubatan: string;
  senjata: string;
  rampasanLain: string;
  motifKejadian: string;
  rakamanOkt: RakamanOktItem[];

  // Summary and Recommendations
  ulasan: string[];
  cadangan: string[];

  // Sign-off
  namaPegawai: string;
  pangkat: string; // e.g. "SJN", "ASP"
  jawatan: string; // e.g. "Penolong Pegawai Penyiasat Jenayah"
  ipd: string; // e.g. "IPD Tuaran, Sabah"
}
