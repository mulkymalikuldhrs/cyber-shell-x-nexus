# Daftar Tugas Proyek CyberShellX

Daftar fitur dan peningkatan yang direncanakan untuk masa depan.

## Prioritas Tinggi

-   [x] ~~**Implementasi Eksekusi Nyata dalam Mode Otomatis**~~ (Selesai)
-   [x] ~~**Analisis Output AI**~~ (Selesai)
-   [x] ~~**Manajemen Sesi/Target**~~ (Selesai)
-   [ ] **Pelaporan Otomatis**: Menambahkan fitur untuk menghasilkan laporan pentesting (misalnya, dalam format Markdown atau PDF) berdasarkan riwayat perintah dan output yang dikumpulkan selama sesi.
-   [ ] **Penyempurnaan Strategi AI**: Meningkatkan prompt sistem dan logika dalam mode `otomatis` untuk menangani skenario yang lebih kompleks dan membuat keputusan yang lebih strategis.

## Prioritas Sedang

-   [ ] **Sistem Plugin**: Mengembangkan sistem plugin untuk memungkinkan pengguna dan pengembang lain dengan mudah menambahkan alat dan kemampuan baru ke CyberShellX.
-   [ ] **Peningkatan Basis Pengetahuan Alat**: Memperluas `cybershell-commands/commands.json` untuk menyertakan informasi yang lebih detail tentang setiap alat, seperti flag umum, contoh penggunaan, dan metode penginstalan.
-   [ ] **Grafik Pengetahuan Target**: Membangun representasi grafis dari target dan lingkungannya. Ini akan memungkinkan AI untuk membuat keputusan yang lebih cerdas tentang langkah-langkah serangan berikutnya.
-   [ ] **Integrasi Kerangka Kerja Eksploitasi**: Integrasi yang lebih dalam dengan alat seperti Metasploit, memungkinkan AI untuk secara otomatis memilih, mengkonfigurasi, dan meluncurkan eksploit.

## Prioritas Rendah

-   [ ] **Kustomisasi Prompt Pengguna**: Memungkinkan pengguna untuk menyesuaikan prompt shell mereka (misalnya, warna, format).
-   [ ] **Dukungan untuk Lebih Banyak Manajer Paket**: Menambahkan dukungan untuk manajer paket lain (misalnya, `pacman` untuk Arch Linux).
-   [ ] **Antarmuka Web (Opsional, Read-only)**: Mempertimbangkan kembali antarmuka web sebagai dasbor hanya-baca untuk melihat status pengujian otomatis yang sedang berjalan atau untuk meninjau laporan yang sudah selesai.
-   [ ] **Output Terstruktur**: Memungkinkan perintah untuk menghasilkan output terstruktur (misalnya, JSON) yang dapat dengan mudah diurai oleh AI dan modul lain.
