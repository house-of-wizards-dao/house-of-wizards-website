#!/usr/bin/env python3
"""Install checksum-pinned Solidity sources without nested Git repos or Node dependencies."""
import hashlib
import io
import json
from pathlib import Path
import shutil
import tarfile
import tempfile
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
for name, dependency in json.loads((ROOT / "dependencies.lock.json").read_text()).items():
    destination = ROOT / "lib" / name
    marker = destination / ".dependency-sha256"
    if marker.exists() and marker.read_text().strip() == dependency["sha256"]:
        print(f"{name}: already installed ({dependency['version']})")
        continue
    data = urllib.request.urlopen(dependency["url"], timeout=120).read()
    if hashlib.sha256(data).hexdigest() != dependency["sha256"]:
        raise SystemExit(f"Checksum mismatch for {name}; refusing to install")
    (ROOT / "lib").mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(dir=ROOT / "lib") as staging:
        with tarfile.open(fileobj=io.BytesIO(data)) as archive:
            for member in archive.getmembers():
                parts = Path(member.name).parts[1:]
                if not parts:
                    continue
                if ".." in parts or member.issym() or member.islnk() or not (member.isfile() or member.isdir()):
                    raise SystemExit(f"Unsafe archive member: {member.name}")
                relative = Path(*parts)
                if relative.is_absolute():
                    raise SystemExit(f"Unsafe archive path: {member.name}")
                member.name = str(relative)
                archive.extract(member, staging)
        if destination.exists():
            shutil.rmtree(destination)
        shutil.copytree(staging, destination)
    marker.write_text(dependency["sha256"] + "\n")
    print(f"{name}: installed {dependency['version']}")
