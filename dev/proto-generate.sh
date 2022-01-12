#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.." # cd to repo root dir

echo "--- cargo install rust-protobuf"
which cargo || (curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain stable -y)
which cargo || source "$HOME/.cargo/env"
which protoc-gen-rust || cargo install protobuf-codegen

echo "--- yarn in root"
# mutex is necessary since CI runs various yarn installs in parallel
yarn --mutex network --frozen-lockfile --network-timeout 60000

echo "--- buf"

GOBIN="$PWD/.bin" go install golang.org/x/tools/cmd/goimports
GOBIN="$PWD/.bin" go install github.com/bufbuild/buf/cmd/buf
GOBIN="$PWD/.bin" go install google.golang.org/protobuf/cmd/protoc-gen-go

GOBIN="$PWD/.bin" ./.bin/buf generate
./.bin/goimports -w ./lib/codeintel/lsif_typed/lsif.pb.go
