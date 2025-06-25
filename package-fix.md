
# Manual Package.json Fix

Jika Anda masih mengalami masalah "Missing script: build:dev", silakan tambahkan manual ke package.json:

## Langkah-langkah:

1. Buka file `package.json`
2. Cari bagian `"scripts"`
3. Tambahkan baris berikut di dalam scripts:

```json
"build:dev": "vite build --mode development"
```

## Contoh lengkap bagian scripts:

```json
{
  "scripts": {
    "dev": "tsx watch server/index.ts",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "start": "node dist/server/index.js",
    "db:push": "drizzle-kit push",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

4. Simpan file
5. Jalankan `./start-cybershellx.sh` atau `./launcher.sh`

## Alternatif cepat:
Jalankan: `node scripts/fix-build.js` untuk perbaikan otomatis.
