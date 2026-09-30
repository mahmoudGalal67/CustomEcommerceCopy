#!/bin/sh

set -e

echo "Starting Laravel..."

# Clear cached Laravel configuration
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Create the public storage symlink if needed
php artisan storage:link || true

# Start PHP-FPM in the background
php-fpm -D

echo "PHP-FPM started"

# Start Nginx in foreground
nginx -g "daemon off;"