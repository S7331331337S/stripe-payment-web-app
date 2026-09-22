#!/usr/bin/env bash
set -euo pipefail

if ! command -v stripe >/dev/null 2>&1; then
  echo "Install the Stripe CLI first: https://docs.stripe.com/stripe-cli/install" >&2
  exit 1
fi

if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env.local
  set +a
fi

python3 - <<'PY'
import json, os, subprocess, sys

stripe = "stripe"
catalog = [
    ("bpc157", "BPC157 10mg", "A healing peptide for tendons, joints, gut issues, and injury recovery.", 2000),
    ("glow", "Glow 70mg", "A combination of 3 healing peptides great for muscle, hair, skin, and nails.", 4500),
    ("reta", "Reta 24mg", "A next-generation triple-action weight loss peptide.", 5000),
    ("tirz", "Tirz 30mg", "The most powerful FDA-approved weight loss injection.", 3000),
    ("motsc", "Mots C 10mg", "A mitochondrial peptide that mimics exercise — boosts metabolism and endurance.", 3500),
    ("mt2", "MT2 10mg", "A fast-acting peptide for tanning, libido enhancement, and appetite control.", 2500),
    ("nad", "NAD+ 500mg", "A cellular energy molecule for DNA repair, metabolism, and anti-aging.", 3000),
    ("cjc-ipa", "CJC/IPA 10mg", "A combination of two GH peptides for muscle gain, fat loss, energy, and skin.", 4000),
    ("tb500", "TB500 10mg", "A tissue repair peptide for flexibility, injury recovery, and systemic healing.", 3000),
    ("ta1", "TA-1 10mg", "An immune-boosting peptide used in 30+ countries for viral defense.", 4500),
]

def run(args):
    result = subprocess.run([stripe, *args], check=False, capture_output=True, text=True)
    if result.returncode != 0:
        raise SystemExit(result.stderr)
    return json.loads(result.stdout)

existing = run(["products", "list", "--limit", "100"])
by_catalog = {}
for product in existing.get("data", []):
    catalog_id = (product.get("metadata") or {}).get("catalog_id")
    if catalog_id:
        by_catalog[catalog_id] = product

for catalog_id, name, description, amount in catalog:
    product = by_catalog.get(catalog_id)
    if product is None:
        product = run([
            "products", "create",
            f"--name={name}",
            f"--description={description}",
            "--default-price-data.currency=usd",
            f"--default-price-data.unit-amount={amount}",
            "-d", f"metadata[catalog_id]={catalog_id}",
        ])
        print(f"created {catalog_id} {product['id']}", file=sys.stderr)
    else:
        print(f"reused {catalog_id} {product['id']}", file=sys.stderr)
    price_id = product["default_price"]
    run([
        "prices", "update", price_id,
        f"--lookup-key=catalog_{catalog_id}",
        "--transfer-lookup-key",
        "-d", f"metadata[catalog_id]={catalog_id}",
    ])
    print(f"{catalog_id}\t{product['id']}\t{price_id}")
PY
