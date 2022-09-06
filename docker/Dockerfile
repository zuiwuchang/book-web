FROM ghcr.io/linuxserver/baseimage-ubuntu:focal

RUN set -ex; \
    apt-get update; \
    apt-get install -y --no-install-recommends openssh-client git; \
    rm -rf /var/lib/apt/lists/*

COPY root/ /

RUN set -ex; \
    mkdir /opt/book-web; \
    tar -zxvf /linux_amd64.tar.gz -C /opt/book-web; \
    mv /book-web.jsonnet /opt/book-web/; \
    rm /linux_amd64.tar.gz -rf;

VOLUME /data
EXPOSE 80
WORKDIR /data
