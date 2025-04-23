#!/bin/bash

set -e

if [ ! -f .env.example ]; then
  echo "Error: .env.example not found. Cannot create .env file."
  exit 1
fi

if [ ! -f .env ]; then
  echo ".env file not found. Creating from .env.example..."
  cp .env.example .env
else
  echo ".env file already exists. Skipping copy."
fi
