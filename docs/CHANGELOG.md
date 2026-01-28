# Changelog

Semua perubahan penting pada proyek ini akan didokumentasikan dalam file ini.

Formatnya didasarkan pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dan proyek ini mematuhi [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-07-25

### Diubah

-   **Perombakan Total Proyek**: Proyek diubah dari platform multifaset (Web, Android, CLI) menjadi alat pentesting yang berfokus pada CLI.
-   **Fokus pada CLI**: Semua komponen UI web dan Android telah dihapus.
-   **Eksekusi Perintah Nyata**: CLI sekarang mengeksekusi perintah shell nyata alih-alih simulasi.
-   **Backend yang Disederhanakan**: Server backend sekarang secara eksklusif mendukung CLI.
-   **Peningkatan AI**: Logika AI diperluas untuk tidak hanya menjelaskan perintah tetapi juga untuk merencanakan serangan dalam mode otomatis.
-   **Struktur Proyek**: Kode CLI direfaktor ke dalam direktorinya sendiri (`cli/`) dengan utilitas terpisah untuk meningkatkan modularitas.

### Ditambahkan

-   **Manajemen Alat**: Fungsionalitas ditambahkan untuk memeriksa alat pentesting yang diperlukan dan memandu pengguna melalui instalasi. Mendukung `apt-get`, `yum`, `dnf`, dan `brew`.
-   **Mode Otomatisasi**: Mode `automate` baru ditambahkan, yang menggunakan AI untuk menghasilkan dan (secara konseptual) mengeksekusi rencana serangan berdasarkan tujuan yang ditentukan pengguna.
-   **Pemeriksaan Status Alat**: Perintah `status` sekarang memeriksa dan menampilkan ketersediaan semua alat yang diperlukan.
-   **Dokumentasi Baru**: `README.md`, `BLUEPRINT.md`, `CHANGELOG.md`, dan `TODO.md` baru dibuat untuk mencerminkan status proyek saat ini.

### Dihapus

-   **Antarmuka Web**: Seluruh direktori `client` dan semua dependensi frontend terkait telah dihapus.
-   **Aplikasi Android**: Direktori `android-assistant` dan semua kode terkait Android telah dihapus.
-   **Database PostgreSQL**: Integrasi database PostgreSQL dan Drizzle ORM telah dihapus.
-   **Penyimpanan Riwayat**: Riwayat perintah sekarang disimpan dalam file `command_history.json` lokal alih-alih database.
-   **Mode Offline**: Kemampuan CLI untuk berjalan dalam "mode offline" atau "simulasi" tanpa backend AI telah dihapus untuk memastikan pengalaman yang konsisten dan didukung AI.
