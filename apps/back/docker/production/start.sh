#!/bin/sh

set -e

echo "Starting Laravel..."

php artisan config:clear
php artisan route:clear
php artisan view:clear

php artisan storage:link || true

php-fpm -D

echo "PHP-FPM started"

nginx -g "daemon off;"