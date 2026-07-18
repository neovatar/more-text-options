#!/bin/bash
set -euo pipefail

TYPE="${1:?Usage: $0 <release|snapshot> <semver> (e.g. release 13.2.0)}"
SEMVER="${2:?Usage: $0 <release|snapshot> <semver> (e.g. release 13.2.0)}"

case "$TYPE" in
  release|snapshot) ;;
  *) echo "First argument must be 'release' or 'snapshot', got '$TYPE'" >&2; exit 1 ;;
esac

VERSION="${TYPE}-${SEMVER}"

echo "Updating module.json with version $VERSION"
sed -i -E "s/\"version\": \"([a-z]+-)?[0-9]+\.[0-9]+\.[0-9]+\"/\"version\": \"${SEMVER}\"/; s#(\"download\": \"[^\"]*/download/)([a-z]+-)?[0-9]+\.[0-9]+\.[0-9]+(/)#\1${VERSION}\3#" module.json

if [[ "$TYPE" == "release" ]]; then
  echo "Updating README.md with version $VERSION"
  sed -i -E "/Downloads \(release-/s/release-[0-9]+\.[0-9]+\.[0-9]+/${VERSION}/g" README.md
fi
