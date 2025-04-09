FROM clamav/clamav:stable

# Custom Virus Database
RUN freshclam && \
    clamscan --version && \
    rm -rf /var/lib/clamav/bytecode.cvd && \
    curl -L https://securedb.securechat.com/clamav/bytecode.cvd -o /var/lib/clamav/bytecode.cvd

# Secure Scan Configuration
COPY scan.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/scan.sh

ENTRYPOINT ["scan.sh"]
