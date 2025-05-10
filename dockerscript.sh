#!/bin/bash

yarn run mock:start &

echo "Waiting for mock server to be ready on port 3000..."
while ! curl -s http://localhost:3000 > /dev/null; do
  sleep 1
done
echo "Mock server is ready!"

# Run the both UI and API tests
yarn test