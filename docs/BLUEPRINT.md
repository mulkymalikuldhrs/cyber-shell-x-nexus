# CyberShellX CLI - Cetak Biru Teknis

Dokumen ini menguraikan arsitektur teknis dan desain dari CyberShellX CLI.

## Komponen Inti

1.  **Backend Server (`server/`)**
    -   **Teknologi**: Express.js, Node.js, TypeScript.
    -   **Tanggung Jawab**:
        -   Menyediakan endpoint API untuk CLI.
        -   Berinteraksi dengan Google Gemini API untuk semua pemrosesan bahasa alami.
        -   Mengelola logika untuk mode otomatis, secara dinamis menentukan perintah berikutnya berdasarkan riwayat dan catatan.
        -   Mengekstrak informasi kunci dari output perintah.
    -   **File Utama**:
        -   `server/index.ts`: Titik masuk server Express.
        -   `server/routes.ts`: Mendefinisikan semua rute API (`/api/command`, `/api/automate/next-step`, `/api/automate/extract-info`).
        -   `server/cybershell-ai.ts`: Otak di balik sistem. Berisi semua logika untuk pemrosesan perintah, peningkatan AI, dan otomatisasi berbasis umpan balik.

2.  **Antarmuka Baris Perintah (CLI) (`cli/`)**
    -   **Teknologi**: Node.js, Ora, Chalk.
    -   **Tanggung Jawab**:
        -   Menyediakan antarmuka pengguna interaktif yang kaya dengan spinner dan output berwarna.
        -   Mengirim perintah dan data sesi ke server backend.
        -   Mengeksekusi perintah shell nyata dan menangkap outputnya.
        -   Mengelola ruang kerja sesi (membuat direktori, menyimpan riwayat dan catatan).
        -   Mengelola instalasi dan pemeriksaan alat.
    -   **File Utama**:
        -   `cli/index.js`: Titik masuk utama untuk CLI. Berisi loop prompt, penanganan perintah, dan orkestrasi otomatisasi.
        -   `cli/utils.js`: Berisi fungsi pembantu untuk logging, eksekusi perintah, dan deteksi manajer paket.

3.  **Manajemen Sesi (`workspaces/`)**
    -   **Struktur**: Setiap target mendapatkan direktorinya sendiri (`workspaces/<target_name>/`).
    -   `history.json`: Menyimpan riwayat lengkap percakapan dengan AI, termasuk perintah dan outputnya. Ini memungkinkan sesi untuk dilanjutkan.
    -   `notes.json`: Menyimpan informasi kunci yang diekstraksi AI dari output perintah, menciptakan basis pengetahuan yang terus berkembang tentang target.

## Alur Kerja Pengguna

### Alur Kerja Perintah Standar

1.  Pengguna memasukkan perintah di CLI (misalnya, `nmap -sV example.com`).
2.  `cli/index.js` mengirimkan perintah ke endpoint `/api/command`.
3.  `server/cybershell-ai.ts` menghasilkan penjelasan yang disempurnakan dengan AI.
4.  CLI menampilkan penjelasan. Perintah yang sebenarnya *tidak* dieksekusi secara otomatis dalam mode ini; ini murni untuk eksplorasi dan pembelajaran. Pengguna kemudian dapat menyalin dan menjalankan perintah jika mereka mau.

### Alur Kerja Otomatisasi (Loop Umpan Balik Cerdas)

1.  Pengguna menjalankan perintah `automate`.
2.  CLI meminta target dan tujuan, lalu membuat/memuat ruang kerja yang sesuai.
3.  **Loop Dimulai:**
4.  CLI mengirimkan riwayat percakapan dan catatan yang ada ke endpoint `/api/automate/next-step`.
5.  AI menganalisis status saat ini dan menentukan perintah berikutnya yang paling logis.
6.  Server mengembalikan satu perintah ini ke CLI. Jika AI menentukan tugas selesai, ia mengembalikan "FINISH".
7.  CLI menjalankan perintah yang diterima dan menangkap outputnya.
8.  CLI mengirimkan output ke endpoint `/api/automate/extract-info`.
9.  AI menganalisis output dan mengembalikan JSON berisi informasi kunci (port, kerentanan, dll.).
10. CLI menyimpan informasi baru ini ke `notes.json` dan menambahkan output ke `history.json`.
11. Loop kembali ke langkah 4.

## Desain Masa Depan & Peningkatan Potensial

-   **Pelaporan Otomatis**: Menggunakan `history.json` dan `notes.json` untuk secara otomatis menghasilkan laporan pentesting.
-   **Grafik Pengetahuan**: Mengubah `notes.json` menjadi basis data grafik yang lebih canggih untuk memetakan hubungan antara aset.
-   **Plugin**: Sistem plugin untuk dengan mudah menambahkan alat dan kemampuan baru.
-   **Eksekusi Perintah Jarak Jauh**: Kemampuan untuk mengeksekusi perintah pada host jarak jauh melalui SSH.
