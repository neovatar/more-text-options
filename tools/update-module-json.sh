#!/bin/bash
set -euo pipefail

echo "Updating module.json with version $SEMREL_NEXT_VERSION"
jq --arg version "$SEMREL_NEXT_VERSION" '.version = $version | .download = "https://github.com/neovatar/more-text-options/releases/download/release-\($version)/more-text-options.zip"' module.json > module.tmp.json && mv module.tmp.json module.json
