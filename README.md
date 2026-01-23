# CyberShellX CLI 🛡️

CyberShellX CLI adalah platform pentesting siber all-in-one generasi berikutnya, yang didukung oleh kecerdasan buatan. Alat ini dirancang untuk para profesional keamanan, peretas etis, dan penggemar keamanan siber, menyediakan seperangkat alat yang komprehensif dalam satu antarmuka baris perintah yang ramping dan modern.

## Fitur Utama

-   **Antarmuka CLI Terpadu**: Semua alat dan fungsionalitas dapat diakses melalui satu CLI yang kuat dengan indikator kemajuan dan output berwarna.
-   **Didukung AI**: Gunakan kekuatan model bahasa besar untuk penjelasan perintah, perencanaan serangan, dan otomatisasi cerdas.
-   **Otomatisasi Berbasis Umpan Balik**: Mode `automate` secara dinamis menentukan langkah-langkah serangan berdasarkan analisis AI terhadap output perintah sebelumnya.
-   **Manajemen Sesi**: Secara otomatis membuat ruang kerja untuk setiap target, menyimpan riwayat perintah, output, dan catatan yang diekstraksi AI untuk melanjutkan sesi nanti.
-   **Manajemen Alat Otomatis**: Secara otomatis memeriksa alat yang hilang dan menawarkan untuk menginstalnya menggunakan manajer paket asli sistem Anda.
-   **Dapat Diperluas**: Basis data alat dan basis pengetahuan AI yang mudah diperluas.

## Instalasi

1.  **Prasyarat**: Pastikan Anda memiliki Node.js (v18+) dan manajer paket (seperti `apt`, `yum`, `brew`) yang terinstal.

2.  **Clone Repositori:**
    ```bash
    git clone https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus.git
    cd cyber-shell-x-nexus
    ```

3.  **Instal Dependensi Node.js:**
    ```bash
    npm install
    ```

4.  **Siapkan Variabel Lingkungan:**
    Buat file `.env` di direktori root dan tambahkan kunci Gemini API Anda. Anda dapat menambahkan beberapa kunci untuk fallback.
    ```
    GEMINI_API_KEY=AIz...
    GEMINI_API_KEY_2=AIz...
    ```

5.  **Instal Alat Pentesting:**
    CyberShellX dilengkapi dengan manajer alat untuk membantu Anda menginstal alat yang diperlukan. Jalankan perintah berikut untuk memeriksa alat yang hilang dan menginstalnya:
    ```bash
    ./launcher.sh manage-tools
    ```

## Penggunaan

### 1. Jalankan Server Backend

Server backend menangani semua pemrosesan AI. Anda harus menjalankannya di terminal terpisah.

```bash
npx tsx server/index.ts
```

### 2. Jalankan CyberShellX CLI

Setelah server berjalan, buka terminal lain dan mulai CyberShellX CLI menggunakan peluncur:

```bash
./launcher.sh
```

Ini akan memberi Anda menu interaktif. Pilih "CLI Cybersecurity Shell" untuk memulai.

### Perintah yang Tersedia

-   `help`: Menampilkan menu bantuan dengan semua perintah yang tersedia.
-   `status`: Menampilkan status koneksi AI dan ketersediaan alat yang diperiksa.
-   `automate`: Memulai mode pentesting otomatis berbasis umpan balik. Anda akan dimintai target dan tujuan.
-   `<command>`: Jalankan perintah pentesting apa pun (misalnya, `nmap -sV target.com`). CyberShellX akan memberikan penjelasan yang disempurnakan dengan AI sebelum mengeksekusi.

## Arsitektur

-   **Backend**: Server Express.js yang menangani logika AI (menggunakan Google Gemini) dan berfungsi sebagai otak di balik CLI.
-   **Frontend (CLI)**: Antarmuka baris perintah Node.js modern yang berinteraksi dengan server backend, mengeksekusi alat pentesting, dan menyediakan UX yang kaya dengan indikator kemajuan.
-   **Manajemen Sesi**: Membuat dan mengelola ruang kerja per-target di bawah direktori `workspaces/`, menyimpan riwayat dan catatan yang diekstraksi AI.
-   **Manajemen Alat**: Skrip yang mendeteksi OS dan manajer paketnya untuk mengotomatiskan instalasi alat.

## Berkontribusi

Kontribusi sangat kami harapkan! Silakan fork repositori, buat perubahan Anda, dan kirimkan pull request.

## Peringatan Hukum

Alat ini ditujukan untuk tujuan pendidikan dan pengujian resmi saja. Penggunaan alat ini secara tidak sah terhadap sistem yang tidak Anda miliki izinnya adalah ilegal. Pengembang tidak bertanggung jawab atas penyalahgunaan apa pun. Selalu dapatkan izin tertulis sebelum melakukan penilaian keamanan.
