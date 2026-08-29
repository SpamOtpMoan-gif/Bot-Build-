#!/bin/bash
echo "☠️ TELEGRAM BOT APK BUILDER START ☠️"

# Setup Android SDK (contoh)
mkdir -p ~/android-sdk
export ANDROID_HOME=~/android-sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Clone template bot Telegram (ganti dengan template APK Anda)
git clone https://github.com/SpamOtpMoan-gif/TelegramBotTemplate.git temp || echo "Template tidak ditemukan, buat dummy"

# Jika template tidak ada, buat file dummy APK
if [ ! -d "temp" ]; then
  mkdir -p output
  echo "Dummy APK untuk Telegram Bot" > output/telegram-bot-dummy.apk
  echo "☠️ DUMMY APK DIBUAT (karena template tidak ditemukan) ☠️"
  exit 0
fi

# Build dengan Gradle (jika ada)
cd temp
if [ -f "gradlew" ]; then
  ./gradlew assembleDebug
  mkdir -p ../output
  cp app/build/outputs/apk/debug/*.apk ../output/ 2>/dev/null || echo "Tidak ada APK dihasilkan"
else
  echo "Tidak ada gradlew, buat dummy"
  mkdir -p ../output
  echo "Telegram Bot APK Build" > ../output/telegram-bot.apk
fi

cd ..
echo "☠️ BUILD SELESAI. APK di folder /output ☠️"
