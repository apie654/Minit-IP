import { MinitData } from "./types";

export const emptyMinit: MinitData = {
  rptNo: "",
  ksNo: "",
  penerima: "YDH TUAN KBSJD TUARAN",
  templateType: "minit_pertama",
  seksyen: "Seksyen 379A Kanun Keseksaan",
  pengadu: "",
  mangsaList: [],
  oktList: [],
  remanStatus: "",
  tarikhMasa: "",
  tempatKejadian: "",
  keteranganKes: "Keterangan kes adalah seperti di muka surat 2 kertas siasatan.",
  rakamanSaksi: [],
  siasatanTK: "",
  modusOperandi: "",
  semakanImigresen: "",
  semakanUjianAirKencing: "",
  semakanRekodLampau: [],
  rampasanBarangKes: [],
  laporanKawadCam: "",
  laporanPerubatan: "",
  senjata: "",
  rampasanLain: "",
  motifKejadian: "",
  rakamanOkt: [],
  ulasan: [],
  cadangan: [],
  namaPegawai: "",
  pangkat: "",
  jawatan: "",
  ipd: "",
};

export const sampleMinitAsal: MinitData = {
  rptNo: "Tuaran/Rpt/1234/2019",
  ksNo: "Tuaran/JSJ/KS/56/2019",
  penerima: "YDH TUAN KBSJD TUARAN / YANG ARIF TIMBALAN PENDAKWARAYA NEGERI SABAH",
  templateType: "asal",
  seksyen: "Seksyen 307 Kanun Keseksaan",
  pengadu: "Pengadu dalam kes ini adalah 1 lelaki berumur 35 tahun berbangsa Cina bertugas sebagai Doktor perubatan di Hospital Tuaran.",
  mangsaList: [
    {
      id: "m1",
      label: "A1/M1",
      nama: "Nur Tissya Binti Abdullah",
      ic: "160411-12-1054",
      jantina: "P",
      umur: "2",
      bangsa: "Suluk",
      warganegara: "W/Malaysia",
      alamat: "Blok 15-4-18, Fasa 3, Taman Telipok Ria, Tuaran",
    }
  ],
  oktList: [
    {
      id: "okt1",
      label: "B1",
      nama: "Junuer bin Elmi",
      ic: "Tiada Dokumen",
      jantina: "L",
      umur: "28",
      bangsa: "Bajau Suluk",
      warganegara: "W/Filipina",
      pekerjaan: "Pemandu Hitachi",
      alamat: "Kampung Baru, Tuaran",
    },
    {
      id: "okt2",
      label: "B2",
      nama: "Jailo bin Jailan",
      ic: "851211-12-7153",
      jantina: "L",
      umur: "31",
      bangsa: "Bajau",
      warganegara: "W/Malaysia",
      pekerjaan: "Buruh Kasar",
      alamat: "Kg Kiulu Tuaran",
    }
  ],
  remanStatus: "Reman B1 berakhir pada 25/03/2024 manakala reman B2 berakhir pada 26/03/2024.",
  tarikhMasa: "13/01/2019 di antara jam 1300hrs hingga 1735hrs",
  tempatKejadian: "Blok 15-4-18, Fasa 3, Taman Telipok Ria, Tuaran, Sabah.",
  keteranganKes: "Keterangan kes adalah seperti di muka surat 2 kertas siasatan.",
  rakamanSaksi: [
    {
      id: "saksi1",
      label: "A1",
      nama: "Tuminah binti Tarip",
      ic: "650123-12-5224",
      percakapan: [
        "A1 adalah seorang surirumah sepenuh masa.",
        "A1 memberitahu pada masa kejadian A1 berada di luar rumah apabila dia terdengar anak perempuannya (M1) menjerit meminta tolong.",
        "A1 jelas melihat perlakuan B1 memegang kedua tangan M1 manakala B2 pula berada di atas badan M1."
      ]
    },
    {
      id: "saksi2",
      label: "A2",
      nama: "Nur Tissya Binti Abdullah",
      ic: "101131-12-1054",
      percakapan: [
        "A2 adalah pelajar tingkat 3 sekolah SMK Sri Nangka.",
        "A2 menceritakan pada 12/01/2024 jam lebih kurang 1400 hrs kejadian tetakan berlaku.",
        "A2 melihat kejadian tersebut dari jarak dekat."
      ]
    }
  ],
  siasatanTK: "Tempat kejadian merupakan bangunan rumah kedai 2 tingkat. Terdapat 2 lot kedai di kawasan tersebut. Setiap lot kedai ada 10 unit kedai. Tempat kejadian adalah unit nombor 15.\n\nSiasatan di tempat kejadian mendapati keadaan kaunter kedai berselerak. Mesin juruwang telah dilarikan hanya terdapat wayar yang terjuntai yang terdapat kesan potongan. Terdapat kesan darah di cermin tingkap yang pecah dan terbuka. Swab DNA telah diambil untuk tujuan perbandingan.\n\nPengesanan cap jari berjaya menimbulkan 4 laten cap jari.\n\nRajah kasar tempat kejadian dan gambar-gambar tempat kejadian adalah seperti di folio D5.",
  modusOperandi: "Suspek dipercayai masuk ke premis kedai dengan cara memecahkan cermin tingkap di belakang kedai lalu mengambil barang-barang berharga di kawasan kedai melarikan peti besi premis yang diletakkan di dalam pejabat.",
  semakanImigresen: "Semakan melalui pihak Jabatan Imigresen Malaysia mendapati tiada rekod keluar/masuk ke Malaysia bagi B1. Didapati B1 telah masuk ke dalam Malaysia secara tidak sah. Pohon rujuk folio D7.",
  semakanUjianAirKencing: "Tapisan air kencing mendapati B2 positif Amph dan Meth. Report polis telah dibuat dan pihak BSJND telah membuka kertas siasatan bersabit Tuaran/JSJN/021/2024. IO: Insp. Farid sek. 15(1) ADB. Pohon rujuk folio AAA.",
  semakanRekodLampau: [
    {
      id: "rekod1",
      oktLabel: "B1",
      rekod: [
        "Sek. 15(1)ADB – tahun 2020 Jatuh hukum",
        "Sek. 457 KK – Tahun 2021 Jatuh hukum",
        "Sek. 379 KK – tahun 2022 jatuh hukum"
      ]
    },
    {
      id: "rekod2",
      oktLabel: "B2",
      rekod: [
        "Sek. 392/397 KK – Tahun 2015 Jatuh hukum",
        "Sek. 324 KK – tahun 2010 Jatuh hukum"
      ]
    }
  ],
  rampasanBarangKes: [
    "Pada 15/02/2024 jam lebihkurang 1300hrs dengan dipanduarah oleh B1 telah pergi ke rumahnya di alamat Kampung Baru dan membuat rampasan barang kes berupa:\n- Sebilah pedang samurai berhulu hitam panjang lebih kurang 250cm berhulu kayu berwarna hitam.\n- Sebuah motosikal nombor pendaftaran SAB 1234 D yang disembunyikan di dalam stor di belakang rumah B1.\n- 1 unit telefon bimbit jenis vivo model A31 warna kelabu yang disembunyikan di dalam almari baju.",
    "Penggeledahan dan rampasan mengikut keperluan di bawah seksyen 27 Akta Keterangan. Report-report yang berkaitan pohon rujuk folio AAAA dan AAAAA."
  ],
  laporanKawadCam: "Kawad cam telah dijalankan pada 29/02/2024 jam 1400hrs di Bilik Kawad Cam Lokap Berpusat IPD Kota Kinabalu. Pegawai Kawad Cam adalah Insp. Mohd Esqal bin Mohd Naim Pegawai Penyiasat Jenayah IPD Kota Kinabalu.\n\nHasil kawad cam mendapati A1 dan A2 cam B1 sebagai orang yang telah masuk ke kedai bersenjatakan parang dan mengarahkan mereka menyerahkan wang tunai yang terdapat di dalam mesin juruwang.\n\nLaporan kawad cam pohon rujuk folio D10.",
  laporanPerubatan: "Post mortem telah dijalankan oleh Dr. Murali Narayasamy pada 23/05/2021 @ 1430hr di Hospital Duchess of Kent Sandakan. Terdapat beberapa kecederaan di badan simati iaitu:\ni. Kecederaan luaran.\n  a. 21 luka hirisan.\n  b. 4 luka tikaman.\n  c. 3 luka abrasi pada tubuh.\nii. Kecederaan dalaman.\n  a. Paru-paru kiri.\n  b. Patah tulang rusuk.\n  c. Hirisan pada hati, pinggang dan saraf tunjang.\nPunca kematian adalah multiple slash and stab wounds. Pohon rujuk folio A8.",
  senjata: "Terdapat beberapa kombinasi penggunaan senjata pembunuhan di dalam kes ini. Senjata-senjata pembunuhan yang dipercayai digunakan adalah seperti berikut:\n\n1. Sebilah (1) pisau bersarung kayu warna kuning pudar. Panjang lebih kurang 25 cm. Pohon rujuk folio D5(12).\n- Senjata ini dirampas dengan dipanduarah oleh B1. Pohon dirujuk folio 11A.\n- Senjata ini telah dibuang oleh B1 tepi jambatan kawasan semak hutan bakau Kg Pulau Batu Laut Sandakan.\n- Pemeriksaan mata kasar terdapat kesan darah di bahagian mata pisau dan sarung.\n\n2. Sebilah tembaga tajam bilah segitiga panjang lebih kurang 24 cm ditandakan Pohon rujuk folio D5 (11).\n- Senjata ini dirampas dengan dipanduarah oleh B1.\n- Senjata ini telah dibuang oleh B1 tepi jambatan kawasan semak hutan bakau Kg Pulau Batu Laut Sandakan.\n- Pemeriksaan mata kasar tidak terdapat kesan darah. Akan dihantar untuk analisa DNA.",
  rampasanLain: "1. Sebuah bakul biru bersama sehelai baju merah hitam, dipanduarah oleh B7. Tiada terdapat kesan darah. Dihantar untuk analisa DNA.\n2. Sehelai seluar jeans warna hitam jenama loos dipanduarah oleh B7. Terdapat kesan tompokan darah di bahagian paha depan.\n3. Sebuah bot warna kelabu bersama enjin sangkut Yamaha 15 hp digunakan oleh B7 untuk pergi/balik dari TK.\n4. Sehelai seluar jeans warna hitam dari B8 yang dipakai semasa kejadian berdasarkan pengakuannya. Ada kesan tompokan darah.",
  motifKejadian: "B4 dan B8 tidak berpuashati terhadap M1 kerana telah menjatuhkan maruah keluarga mereka dengan cara melakukan hubungan sulit dengan isteri B2 serta memalukan dan menghina B2.",
  rakamanOkt: [
    {
      id: "rokt1",
      oktLabel: "B1",
      nama: "Asis bin Arsad",
      ic: "Passport AU 292088",
      butiran: [
        "Adalah pekerja ladang tersebut tinggal berhampiran dengan tempat kejadian.",
        "Tidak mengaku terlibat dengan kejadian bunuh ini."
      ]
    },
    {
      id: "rokt2",
      oktLabel: "B2",
      nama: "Ulan bin Mohd",
      ic: "Tiada Dokumen",
      butiran: [
        "Telah bekerja di ladang tersebut sejak September 2020 dan tinggal di alamat 32B, Kuarters Pekerja, Lot ME, Ladang Malangking, Sandakan.",
        "B2 diberitahu oleh B4 bahawa isteri (A4) ada hubungan sulit dengan si mati, tetapi B2 tidak mempercayainya.",
        "Pada 11.05.2021 jam lebih kurang 1600 hrs, berlaku pertengkaran antara M1, A3 dan B2 kerana isu hutang di mana M1 dan A3 memukul B2.",
        "Semasa kejadian bunuh, B2 berada di rumah bersama A4 dan tidak menyaksikan kejadian.",
        "B2 tidak mengaku terlibat dengan perbincangan untuk membunuh M1."
      ]
    }
  ],
  ulasan: [
    "Berdasarkan hasil siasatan di atas menunjukkan terdapat bukti kukuh bahawa B4 dan B8 telah melakukan kesalahan bunuh terhadap M1 bersama 2 orang lagi yang masih bebas iaitu Sari dan Adong. Keterangan saksi A2, A3, dan A5 mengukuhkan kehadiran dan perbuatan mereka di TK.",
    "Kecederaan tikaman yang dialami oleh M1 adalah konsisten dengan senjata besi tembaga tajam yang dirampas (Folio D5/11).",
    "Berdasarkan hasil siasatan tersebut dapatlah disimpulkan bahawa perbuatan B4 dan B8 bersama 2 orang yang masih bebas terjumlah di bawah kesalahan di bawah seksyen 300(a) Kanun Keseksaan."
  ],
  cadangan: [
    "B4 dan B8 dituduh di bawah Sek. 302 Kanun Keseksaan. Selain itu B4 juga dituduh di bawah seksyen 6(1)(c) Akta Imigresen.",
    "B4 dituduh di bawah Sek. 324 Kanun Keseksaan terhadap A3.",
    "B2, B3, B5, B6 dan B7 dituduh di bawah seksyen 6(1)(c) Akta Imigresen. Adalah dicadangkan B2, B6 dan B7 dijadikan sebagai saksi pendakwaan.",
    "B1 dan B9 dibebaskan tanpa syarat."
  ],
  namaPegawai: "NUR FARID BIN AHMAD",
  pangkat: "INSP",
  jawatan: "Pegawai Penyiasat Jenayah",
  ipd: "IPD Tuaran, Sabah",
};

export const sampleMinitPertama: MinitData = {
  rptNo: "Tuaran/Rpt/0448/2026",
  ksNo: "Tuaran/JSJ/KS/12/2026",
  penerima: "YDH TUAN KBSJD TUARAN",
  templateType: "minit_pertama",
  seksyen: "Seksyen 379A Kanun Keseksaan",
  pengadu: "Pengadu dalam kes ini adalah 1 perempuan berumur 23 tahun berbangsa Bajau, bekerja sebagai seorang sales assistant di kedai G-Mart, Pekan Tuaran dan tinggal di Kg. Laya-Laya, Tuaran, Sabah.",
  mangsaList: [],
  oktList: [
    {
      id: "okt1",
      label: "B1",
      nama: "Mohd Ezuandy bin Rintan",
      ic: "920524-12-5595",
      jantina: "L",
      umur: "33",
      bangsa: "Bajau",
      warganegara: "W/Malaysia",
      pekerjaan: "Mekanik persendirian",
      alamat: "Kg. Simpangan, Tuaran, Sabah",
    }
  ],
  remanStatus: "Reman B1 akan tamat pada 13/02/2026.",
  tarikhMasa: "20/01/2026 lebih kurang jam 1900 hrs",
  tempatKejadian: "Kebun sayur di Kg. Tambalang, Tuaran, Sabah.",
  keteranganKes: "Keterangan kes adalah seperti di muka surat 2 kertas siasatan.",
  rakamanSaksi: [
    {
      id: "saksi1",
      label: "A1",
      nama: "Nurshahira binti Bakaria",
      ic: "020509-12-0864",
      percakapan: [
        "A1 membeli motosikal tersebut pada tahun 2023 daripada sebuah kedai motosikal Smart Bike di Penampang, Sabah secara ansuran dengan harga lebih kurang RM20,000.00 dan A1 membayar secara bulanan sebanyak RM347.00 sebulan selama tempoh 5 tahun.",
        "Motosikal itu didaftarkan atas nama A1 dan pada hari kejadian iaitu 20/01/2026, bapa A1 telah menggunakan motosikal tersebut untuk ke kebun sayur di Kg. Tambalang, Tuaran.",
        "Pada 22/01/2026 jam lebih kurang 0930 Hrs, bapa A1 telah memberitahu A1 yang motosikal tersebut dibawa lari oleh seorang lelaki yang bernama Appy iaitu B1, tanpa kebenaran bapa A1.",
        "Motosikal adalah atas nama A1 dan masih belum habis dibayar. Motosikal tersebut tidak mempunyai hutang tertunggak dengan bank.",
        "Tanda-tanda jelas pada motosikal tersebut adalah coverset standard dan rim tayar warna emas."
      ]
    },
    {
      id: "saksi2",
      label: "A2",
      nama: "Bakaria bin Wkk Lida @ KK Lidah",
      ic: "690421-12-5487",
      percakapan: [
        "A2 adalah bapa kandung kepada A1. Pada hari kejadian 20/01/2026, jam lebih kurang 0900 hrs, A2 telah menggunakan motosikal A1 untuk pergi ke kebun sayur di Kg. Tambalang, Tuaran.",
        "Pada jam lebih kurang 1530 hrs, semasa A2 sedang membajak di kebunnya itu, telah datang 2 orang lelaki menaiki sebuah motosikal. A2 mengenali 2 lelaki tersebut sebagai Appy (B1) dan Minjan.",
        "A2 menyatakan Appy iaitu B1, membaiki motosikal yang dinaikinya itu di sebelah pondok kebun tersebut, sementara Minjan balik ke rumahnya dengan berjalan kaki.",
        "A2 menyambung kerja membajak di kebunnya dan membiarkan B1 seorang diri membaiki motosikal yang dibawa oleh B1 di dalam kawasan pondok. Pada jam lebih kurang 1900 hrs, semasa A2 masih membajak, dia sedari sebuah motosikal keluar dari kawasan kebun berdasarkan lampu motosikal. Apabila dia membuat pemeriksaan, dia dapati motosikalnya telah tiada disitu dan A2 percaya B1 telah membawa lari motosikal itu tanpa kebenaran daripadanya.",
        "A2 telah cuba menghubungi B1 dan mencari B1 di rumahnya di Kg. Simpangan, Tuaran, namun tidak berhasil. Selepas itu, pada 22/01/2026, barulah A2 memberitahu A1 tentang motosikal itu dan A1 membuat laporan Polis."
      ]
    },
    {
      id: "saksi3",
      label: "A3",
      nama: "Insp. Ridhzuan bin Abd Majid",
      ic: "G/26696",
      percakapan: [
        "A3 adalah seorang Pegawai Kanan PDRM berpangkat Inspektor, yang bertugas sebagai Insp. Risikan/Operasi Bahagian Siasatan Jenayah IPD Tuaran.",
        "A3 bersama anggota serbuan daripada Bahagian Siasatan Jenayah IPD Tuaran telah membuat pemerhatian di Stesen Minyak Shell, Rugading, Tuaran setelah mendapat maklumat tentang saspek iaitu B1 yang akan datang ke lokasi tersebut.",
        "Setelah membuat pemerhatian, A3 dan anggota serbuan telah melihat B1 sampai di lokasi dengan menunggang sebuah motosikal. A3 dan anggota BSJD IPD Tuaran membuat serbuan dan tangkapan terhadap B1 di lokasi tersebut dan setelah membuat pemeriksaan, mendapati motosikal yang ditunggang oleh B1 adalah motosikal yang dilaporkan hilang tersebut.",
        "A3 membuat tangkapan terhadap B1 dan merampas motosikal. B1 dan motosikal dibawa ke IPD Tuaran untuk tindakan lanjut."
      ]
    }
  ],
  siasatanTK: "Tempat kejadian merupakan sebuah kawasan kebun yang jaraknya dari jalanraya lebih kurang 80 meter. Tempat motosikal itu diletakkan adalah di tepi sebuah pondok kecil dalam kebun itu.\n\nSiasatan di tempat kejadian mendapati kawasan tersebut tidak mempunyai kamera litar tertutup (CCTV) dan tidak ada saksi yang melihat kejadian.",
  modusOperandi: "Suspek disyaki membawa lari motosikal tanpa kebenaran A2 dengan menghidupkan enjin motosikal menggunakan kunci motosikal yang ditinggalkan di badan motosikal.",
  semakanImigresen: "",
  semakanUjianAirKencing: "Saringan air kencing B1 yang telah dibuat di pejabat BSJND pada 06/02/2026 mendapati B1 positif dadah jenis Methamphetamine. (Mohon rujuk Folio AAA).",
  semakanRekodLampau: [
    {
      id: "rekod1",
      oktLabel: "B1",
      rekod: [
        "B1 pernah ditangkap dan dihukum atas kesalahan penyalahgunaan dadah, Sek. 15(1) (a) ADB 1952 sebanyak 3 kes iaitu pada tahun 2021, 2022 dan 2024."
      ]
    }
  ],
  rampasanBarangKes: [
    "Satu serbuan telah dilakukan oleh pasukan serbuan yang diketuai oleh A3 di Stesen Minyak Shell Rugading, Tuaran dan dalam serbuan tersebut, A3 telah merampas sebuah motosikal yang ditunggangi oleh B1, yang bernombor pendaftaran SAB4678 (palsu) yang mana setelah diperiksa dan semakan dibuat melalui nombor chasis dan nombor enjin, mendapati, nombor sebenar motosikal tersebut adalah SYY8752 yang merupakan motosikal yang dilaporkan hilang oleh A1."
  ],
  laporanKawadCam: "",
  laporanPerubatan: "",
  senjata: "",
  rampasanLain: "",
  motifKejadian: "",
  rakamanOkt: [
    {
      id: "rokt1",
      oktLabel: "B1",
      nama: "Mohd Ezuandy bin Rintan",
      ic: "920524-12-5595",
      butiran: [
        "Mengaku membawa motosikal A1 yang digunakan oleh bapa A1 iaitu A2, semasa berada di kebun sayur di Kg. Tambalang.",
        "Menyatakan bahawa A2 memintanya membeli barang-barang dapur dan memberikan wang sebanyak RM150.00. B1 menyatakan telah meminta kebenaran A2 untuk menggunakan motosikal tersebut.",
        "Semasa dalam perjalanan untuk membeli barang, telah terima makluman daripada isteri yang berada di Keningau, yang ibu mertua B1 akan menjalani pembedahan perut di Hospital Keningau. Ini menyebabkan B1 membawa menunggang motosikal tersebut ke Keningau untuk melawat ibu mertuanya.",
        "Menyatakan mahu mengembalikan motosikal tetapi tidak dapat menghubungi bapa A1.",
        "Mengaku menukar nombor pendaftaran motosikal dari SYY 8752 kepada SAB4678 di sebuah kedai di Papar semasa dalam perjalanan ke Keningau dengan alasan dia berulang alik ke Tuaran dan Keningau."
      ]
    }
  ],
  ulasan: [
    "Siasatan mendapati B1 telah melarikan motosikal A1 yang digunakan oleh A2 semasa berada di kebun sayur di Kg. Tambalang tanpa kebenaran daripada A2.",
    "Keterangan B1 yang menyatakan telah mendapat kebenaran untuk menggunakan motosikal tersebut daripada A2 adalah diragukan kerana jikalau B1 mendapat kebenaran seperti yang didakwannya, B1 tidak akan menukar nombor pendaftaran motosikal tersebut kepada nombor palsu yang mana menunjukkan B1 memang mempunyai niat untuk menyimpan motosikal tersebut untuk kegunaan dirinya."
  ],
  cadangan: [
    "Adalah dicadangkan B1 dituduh dibawah Seksyen 379A Kanun Keseksaan, pertuduhan alternatif dibawah Seksyen 411 Kanun Keseksaan kerana semasa ditangkap, B1 didapati dalam milikannya, sebuah motosikal yang dilaporkan hilang, sekiranya YDH Tuan bersetuju."
  ],
  namaPegawai: "HUMPHREY EDDIE",
  pangkat: "SJN",
  jawatan: "Penolong Pegawai Penyiasat Jenayah",
  ipd: "IPD Tuaran, Sabah",
};

export const sampleMinitDco: MinitData = {
  rptNo: "Tuaran/Rpt/0448/2026",
  ksNo: "Tuaran/JSJ/KS/12/2026",
  penerima: "YANG ARIF TIMBALAN PENDAKWARAYA NEGERI SABAH",
  templateType: "dco",
  seksyen: "Seksyen 379A Kanun Keseksaan",
  pengadu: "Pengadu dalam kes ini adalah 1 perempuan berumur 23 tahun berbangsa Bajau, bekerja sebagai seorang sales assistant di kedai G-Mart, Pekan Tuaran dan tinggal di Kg. Laya-Laya, Tuaran, Sabah.",
  mangsaList: [],
  oktList: [
    {
      id: "okt1",
      label: "B1",
      nama: "Mohd Ezuandy bin Rintan",
      ic: "920524-12-5595",
      jantina: "L",
      umur: "33",
      bangsa: "Bajau",
      warganegara: "W/Malaysia",
      pekerjaan: "Mekanik persendirian",
      alamat: "Kg. Simpangan, Tuaran, Sabah",
    }
  ],
  remanStatus: "Reman B1 akan tamat pada 13/02/2026.",
  tarikhMasa: "20/01/2026 lebih kurang jam 1900 hrs",
  tempatKejadian: "Kebun sayur di Kg. Tambalang, Tuaran, Sabah.",
  keteranganKes: "Keterangan kes adalah seperti di muka surat 2 kertas siasatan.",
  rakamanSaksi: [
    {
      id: "saksi1",
      label: "A2",
      nama: "Bakaria bin Wkk Lida @ KK Lidah (Bapa Pengadu)",
      ic: "690421-12-5487",
      percakapan: [
        "Hasil rakaman percakapan A2 iaitu bapa kepada A1, yang menggunakan motosikal A1 ke kebun sayur di Kg. Tambalang, Tuaran mendapati B1 datang bersama seorang lagi lelaki bernama panggilan Minjan. Minjan kemudian meninggalkan tempat kejadian, yang mana Minjan tidak ada terlibat dalam kes yang disiasat.",
        "A2 menyambung kerja-kerja membajak di kebunnya itu, meninggalkan B1 sendirian di pondok kebun. A2 menyatakan B1 tidak ada meminta kebenaran daripadanya dan A2 juga tidak ada memberikan kebenaran kepada B1 untuk membawa motosikalnya keluar dari kawasan tersebut. Mohon rujuk Folio A2."
      ]
    },
    {
      id: "saksi2",
      label: "B1",
      nama: "Mohd Ezuandy bin Rintan (Kenyataan OKT)",
      ic: "920524-12-5595",
      percakapan: [
        "Dalam rakaman percakapan B1, B1 menyatakan yang dia diminta oleh A2 dan mendapat kebenaran untuk menggunakan motosikal bagi tujuan membeli barang dapur, malah diberikan wang sebanyak RM150.00. (mohon rujuk Folio B1).",
        "Namun siasatan mendapati keterangan B1 meragukan kerana setelah membawa motosikal tersebut keluar dari kawasan itu, B1 tidak mengembalikan motosikal tersebut dan telah menukar nombor pendaftaran asal motosikal itu dengan nombor palsu. Ini menunjukkan B1 tidak ada niat untuk mengembalikan motosikal tersebut dan mempunyai niat untuk menyimpan motosikal tersebut secara tidak sah."
      ]
    }
  ],
  siasatanTK: "Tempat kejadian merupakan sebuah kawasan kebun yang jaraknya dari jalanraya lebih kurang 80 meter. Siasatan di tempat kejadian mendapati kawasan tersebut tidak mempunyai kamera litar tertutup (CCTV).",
  modusOperandi: "Suspek membawa lari motosikal tanpa kebenaran A2 dengan menghidupkan enjin menggunakan kunci yang ditinggalkan di badan motosikal.",
  semakanImigresen: "",
  semakanUjianAirKencing: "Saringan air kencing B1 yang telah dibuat di pejabat BSJND pada 06/02/2026 mendapati B1 positif dadah jenis Methamphetamine. (Mohon rujuk Folio AAA).",
  semakanRekodLampau: [
    {
      id: "rekod1",
      oktLabel: "B1",
      rekod: [
        "B1 pernah ditangkap dan dihukum atas kesalahan penyalahgunaan dadah, Sek. 15(1) (a) ADB 1952 sebanyak 3 kes iaitu pada tahun 2021, 2022 dan 2024."
      ]
    }
  ],
  rampasanBarangKes: [
    "Satu serbuan telah dilakukan oleh pasukan serbuan yang diketuai oleh A3 di Stesen Minyak Shell Rugading, Tuaran dan dalam serbuan tersebut, A3 telah merampas sebuah motosikal yang ditunggangi oleh B1, yang bernombor pendaftaran SAB4678 (palsu) yang mana setelah diperiksa dan semakan dibuat melalui nombor chasis dan nombor enjin, mendapati, nombor sebenar motosikal tersebut adalah SYY8752 yang merupakan motosikal yang dilaporkan hilang oleh A1."
  ],
  laporanKawadCam: "Pengecaman barang kes oleh A1 telah dibuat pada 10/02/2026 di perkarangan IPD Tuaran dan A1 mengecam barang kes itu sebagai motosikal miliknya yang dilaporkan hilang berdasarkan daripada rupa bentuk motosikal, coverset, rim tayar warna emas dan nombor chasis motosikal. Gambar pengecaman dan sambungan percakapan pengecaman oleh A1 seperti di Folio D5/A dan A1/1.",
  laporanPerubatan: "",
  senjata: "",
  rampasanLain: "",
  motifKejadian: "",
  rakamanOkt: [],
  ulasan: [
    "Hasil siasatan mendapati B1 telah melarikan motosikal A1 yang digunakan oleh A2 semasa berada di kebun sayur di Kg. Tambalang tanpa kebenaran daripada A2.",
    "Keterangan B1 yang menyatakan telah mendapat kebenaran untuk menggunakan motosikal tersebut daripada A2 adalah diragukan kerana B1 setelah melarikan motosikal tersebut, telah menukar nombor pendaftaran asal motosikal tersebut kepada nombor palsu yang mana menunjukkan B1 memang mempunyai niat untuk menyimpan motosikal tersebut untuk dirinya."
  ],
  cadangan: [
    "Cadangan IO kes seperti di minit (1) dipersetujui untuk menuduh B1 di bawah Seksyen 379A Kanun Keseksaan, pertuduhan alternatif di bawah Seksyen 411 Kanun Keseksaan."
  ],
  namaPegawai: "ISMAIL BIN MOHAMAD RAZALI",
  pangkat: "ASP",
  jawatan: "Insp. Siasatan/Perundangan\nb.p. Ketua Bahagian Siasatan Jenayah",
  ipd: "IPD Tuaran, Sabah",
};

export const allSamples = {
  empty: emptyMinit,
  asal: sampleMinitAsal,
  pertama: sampleMinitPertama,
  dco: sampleMinitDco,
};
