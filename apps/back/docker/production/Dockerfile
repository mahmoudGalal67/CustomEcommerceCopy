FROM php:8.3-fpm

WORKDIR /var/www

# System dependencies
RUN apt-get update && apt-get install -y \
    nginx \
    git \
    curl \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo_mysql \
        pdo_pgsql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Composer dependency files
COPY composer.json composer.lock ./

# Production PHP dependencies
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

# Laravel application
COPY . .

# Generate optimized autoload files
RUN composer dump-autoload --optimize \
    && php artisan package:discover --ansi

# Writable Laravel directories
RUN mkdir -p \
        storage/framework/cache \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Nginx configuration
COPY docker/production/nginx.conf /etc/nginx/conf.d/default.conf

# Startup script
COPY docker/production/start.sh /start.sh

RUN chmod +x /start.sh \
    && rm -f /etc/nginx/sites-enabled/default \
    && rm -f /etc/nginx/conf.d/default.conf.bak

EXPOSE 80

CMD ["/start.sh"]