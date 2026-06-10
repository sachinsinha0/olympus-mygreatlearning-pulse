#!/usr/bin/env python3
"""
Send an AI Pulse email via Gmail SMTP.

Setup:
  1. cp emails/.env.example emails/.env
  2. Fill GMAIL_USER, GMAIL_APP_PASSWORD (16-digit app password), SENDER_NAME
  3. Run from repo root:
       python3 emails/send.py <recipient> [--file emails/product-launch.html] [--subject "Subject"]

Example:
  python3 emails/send.py sachin.sinha@greatlearning.in
"""
import argparse, os, smtplib, ssl, sys
from email.message import EmailMessage
from email.utils import formataddr
from pathlib import Path

HERE = Path(__file__).resolve().parent


def load_env():
    env_path = HERE / ".env"
    if not env_path.exists():
        sys.exit(f"Missing {env_path}. Copy .env.example to .env and fill it in.")
    out = {}
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        out[k.strip()] = v.strip().strip('"').strip("'")
    return out


def main():
    p = argparse.ArgumentParser()
    p.add_argument("recipient")
    p.add_argument("--file", default=str(HERE / "product-launch.html"))
    p.add_argument("--subject", default="AI Pulse. Your AI learning channel.")
    args = p.parse_args()

    env = load_env()
    user = env.get("GMAIL_USER")
    pw = (env.get("GMAIL_APP_PASSWORD") or "").replace(" ", "")
    sender_name = env.get("SENDER_NAME", "AI Pulse")
    if not user or not pw:
        sys.exit("GMAIL_USER and GMAIL_APP_PASSWORD must be set in emails/.env")

    html = Path(args.file).read_text()

    msg = EmailMessage()
    msg["Subject"] = args.subject
    msg["From"] = formataddr((sender_name, user))
    msg["To"] = args.recipient
    msg.set_content("Open this email in an HTML-capable client to view AI Pulse.")
    msg.add_alternative(html, subtype="html")

    ctx = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=ctx) as s:
        s.login(user, pw)
        s.send_message(msg)
    print(f"Sent to {args.recipient}")


if __name__ == "__main__":
    main()
