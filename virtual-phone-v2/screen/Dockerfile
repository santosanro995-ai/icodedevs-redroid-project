FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        android-tools-adb \
        ca-certificates \
        novnc \
        scrcpy \
        websockify \
        x11vnc \
        xvfb \
    && rm -rf /var/lib/apt/lists/*

COPY start.sh /usr/local/bin/start-screen
RUN chmod 0755 /usr/local/bin/start-screen

EXPOSE 6080
ENTRYPOINT ["/usr/local/bin/start-screen"]
