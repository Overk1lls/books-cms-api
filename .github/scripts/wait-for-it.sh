#!/bin/bash

set -e

echo "Starting containers..."

docker compose up -d

echo "Waiting for containers to become healthy..."

services=("pg-books" "redis-books")
timeout=60
interval=5
elapsed=0

while true; do
    all_healthy=true

    for service in "${services[@]}"; do
        health=$(docker inspect --format='{{.State.Health.Status}}' "$service")

        if [ "$health" != "healthy" ]; then
            all_healthy=false

            echo "$service is $health"
        fi
    done

    if $all_healthy; then
        echo "All services are healthy."
        exit 0
    fi

    if [ "$elapsed" -ge "$timeout" ]; then
        echo "Timeout reached. Some services are still unhealthy."

        docker compose logs

        exit 1
    fi

    sleep "$interval"

    elapsed=$((elapsed + interval))
done
