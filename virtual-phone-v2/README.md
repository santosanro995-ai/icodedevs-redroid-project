# ICodeDevs Android Virtual

Satu perangkat Android Redroid yang bisa dikendalikan dari browser di
`https://icodedevs.biz.id`. Layar Android ditampilkan memenuhi jendela browser;
VNC dan ADB hanya tersedia di jaringan internal Docker. HTTPS otomatis dikelola
Caddy dan akses dilindungi HTTP Basic Authentication.

## Kebutuhan VPS

- Ubuntu Server 22.04/24.04 x86_64 dan Docker Engine dengan plugin Docker Compose.
- KVM serta modul kernel Redroid (`binder_linux` dan `memfd_create`) aktif.
- Minimal 2 vCPU disarankan. Batas memori container adalah 1024 MiB untuk
  Android, 160 MiB untuk proses layar, dan 96 MiB untuk web. Android 10 dipakai
  sebagai nilai awal dan resolusi layar rendah untuk menekan penggunaan RAM.
  Jika total RAM VPS hanya 1.6 GB, sisa untuk OS sangat terbatas; swap 1-2 GB
  sangat disarankan. Android 11-13 atau aplikasi berat mungkin perlu batas RAM
  lebih tinggi dan tambahan RAM/swap.
- Sediakan ruang disk untuk image Android dan data aplikasi. Volume Android
  persisten dapat bertambah seiring pemakaian; pantau disk VPS 25 GB.

Redroid menjalankan Android AOSP, bukan perangkat Google Play tersertifikasi.
Versi Android yang tersedia dapat dipilih 10, 11, 12, atau 13.

## Persiapan domain

1. Arahkan record DNS `A` untuk `icodedevs.biz.id` ke alamat IPv4 VPS.
2. Buka port TCP 80 dan 443 pada firewall VPS dan firewall penyedia VPS.
   UDP 443 opsional untuk HTTP/3.
3. Pastikan domain sudah mengarah ke VPS sebelum menjalankan layanan agar
   Caddy dapat menerbitkan sertifikat HTTPS.

## Instalasi

```bash
git clone <URL-REPOSITORY-ANDA> icodedevs-android-virtual
cd icodedevs-android-virtual
cp .env.example .env
```

Edit `.env`: pilih nama pengguna dan isi hash bcrypt untuk autentikasi. Buat
hash dengan Caddy (ganti teks contoh dengan kata sandi yang kuat):

```bash
docker run --rm caddy:2-alpine caddy hash-password --plaintext 'GANTI_DENGAN_PASSWORD_KUAT'
```

Salin hasilnya ke `BASIC_AUTH_HASH` di `.env`, dalam tanda kutip tunggal,
misalnya `BASIC_AUTH_HASH='$2a$14$...'`. Jangan unggah `.env` atau hash/kata
sandi ke GitHub. Untuk Android lain, set `ANDROID_VERSION` menjadi `10`, `12`,
atau `13`; nilai awal adalah `10`. Mengganti versi tidak menghapus data Android
yang tersimpan di volume, tetapi kompatibilitas data antarversi tidak dijamin.

Pastikan kernel dan perangkat binder tersedia sebelum menyalakan Android:

```bash
ls -l /dev/binder /dev/hwbinder /dev/vndbinder
docker compose up -d --build
docker compose ps
docker compose logs -f android screen web
```

Setelah Caddy berhasil mendapatkan sertifikat, buka
`https://icodedevs.biz.id` dan masuk menggunakan kredensial yang sudah dibuat.
Layar Android menerima klik dan sentuhan dari browser; gunakan tombol layar
penuh di pojok untuk menyembunyikan UI browser jika didukung perangkat.

## Operasi

```bash
docker compose logs -f
docker compose restart
docker compose down
```

`docker compose down` mempertahankan data Android. Hindari `docker compose down
-v` kecuali memang ingin menghapus seluruh data aplikasi dan konfigurasi
sertifikat yang tersimpan di volume.

Jika Android tidak mulai, periksa `docker compose logs android screen` dan
`dmesg` pada VPS. Modul binder harus tersedia dan kompatibel dengan kernel VPS.
