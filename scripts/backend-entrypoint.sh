#!/usr/bin/env sh
set -e

python manage.py migrate
python manage.py collectstatic --noinput || true

exec gunicorn Aboutme.wsgi:application --bind 0.0.0.0:8000 --workers 3
