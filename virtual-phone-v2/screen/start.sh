#!/bin/sh
set -eu

ANDROID_HOST="${ANDROID_HOST:-android}"
ANDROID_PORT="${ANDROID_PORT:-5555}"
ANDROID_SERIAL="${ANDROID_HOST}:${ANDROID_PORT}"
SCREEN_WIDTH="${SCREEN_WIDTH:-540}"
SCREEN_HEIGHT="${SCREEN_HEIGHT:-960}"

Xvfb "${DISPLAY:-:0}" -screen 0 "${SCREEN_WIDTH}x${SCREEN_HEIGHT}x24" -nolisten tcp &
x11vnc -display "${DISPLAY:-:0}" -forever -shared -nopw -rfbport 5900 -localhost &
websockify --web=/usr/share/novnc 6080 localhost:5900 &

until adb connect "${ANDROID_SERIAL}" >/dev/null 2>&1 \
    && adb -s "${ANDROID_SERIAL}" get-state >/dev/null 2>&1; do
    sleep 2
done

exec scrcpy \
    --serial "${ANDROID_SERIAL}" \
    --no-audio \
    --stay-awake \
    --max-size 540 \
    -b 1M \
    --window-borderless \
    --window-x 0 \
    --window-y 0
