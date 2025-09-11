# Dockerfile (Laravel PHP-FPM)
FROM php:8.3-fpm

# System deps
RUN apt-get update && apt-get install -y \
    git unzip libpng-dev libzip-dev libonig-dev libicu-dev \
 && docker-php-ext-configure intl \
 && docker-php-ext-install pdo_mysql gd zip intl \
 && rm -rf /var/lib/apt/lists/*

# Opcache (good for performance, safe in dev too)
RUN docker-php-ext-install opcache

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Workdir
WORKDIR /var/www/html

# (Optional) faster first build: copy composer files first
COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --no-scripts || true

# Copy the rest of the app
COPY . .

# Writable dirs
RUN chown -R www-data:www-data storage bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache
