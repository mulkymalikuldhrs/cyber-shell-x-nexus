
#!/usr/bin/env node

// Fix build script untuk CyberShellX
const fs = require('fs');
const path = require('path');

console.log('🔧 Memperbaiki konfigurasi build CyberShellX...');

// Baca package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
let packageJson;

try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
} catch (error) {
  console.error('❌ Tidak dapat membaca package.json:', error.message);
  process.exit(1);
}

// Tambahkan script build:dev jika belum ada
if (!packageJson.scripts['build:dev']) {
  packageJson.scripts['build:dev'] = 'vite build --mode development';
  console.log('✅ Menambahkan script build:dev');
}

// Pastikan script lain ada
const requiredScripts = {
  'dev': 'tsx watch server/index.ts',
  'build': 'vite build',
  'start': 'node dist/server/index.js',
  'db:push': 'drizzle-kit push'
};

Object.entries(requiredScripts).forEach(([key, value]) => {
  if (!packageJson.scripts[key]) {
    packageJson.scripts[key] = value;
    console.log(`✅ Menambahkan script ${key}`);
  }
});

// Tulis kembali package.json
try {
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json berhasil diperbarui');
} catch (error) {
  console.error('❌ Gagal menulis package.json:', error.message);
  process.exit(1);
}

console.log('🚀 Konfigurasi build selesai diperbaiki!');
