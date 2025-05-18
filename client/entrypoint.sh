#!/bin/sh

# Replace environment variables in env-config.js template with actual values at runtime
# The env-config.js.template should be in the build/public folder or wherever nginx serves static files

# Example of env-config.js.template:
# window._env_ = {
#   REACT_APP_BACKEND_URL: "$REACT_APP_BACKEND_URL",
# };

# Replace placeholders with actual environment variables
envsubst < /usr/share/nginx/html/env-config.js.template > /usr/share/nginx/html/env-config.js

# Start nginx in foreground (required in containers)
nginx -g 'daemon off;'
