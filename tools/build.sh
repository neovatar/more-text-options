#!/bin/bash
set -euo pipefail

echo
echo "Building dist/more-text-options.zip"
mkdir -p dist
zip -r dist/more-text-options.zip module.json scripts README.md LICENSE.md

