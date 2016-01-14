# Django settings for Aboutme project.

import os
BASE_URL = os.path.join(os.path.dirname(__file__), '..').replace('\\','/')

LOADING_SIZE = 10

SAE_DEFAULT_STORAGE_DOMAIN_NAME = 'storage01'

#Define environments enum
class Env():
    dev = False
    test = False
    prod = False


ADMINS = (
    ('guowei1003', 'guowei1003@sina.com'),
)

MANAGERS = ADMINS

from os import environ
env_work = not environ.get("APP_NAME", "")

if env_work:
    #LOCAL
    DEBUG = True
    TEMPLATE_DEBUG = DEBUG
    db_name = "xxblog"
    name = "root"
    pwd = "111111"
    host = "127.0.0.1"
    port = "3306"
else:
    #SAE
    DEBUG = False
    TEMPLATE_DEBUG = DEBUG
    import sae.const
    db_name = sae.const.MYSQL_DB
    name = sae.const.MYSQL_USER
    pwd = sae.const.MYSQL_PASS
    host = sae.const.MYSQL_HOST
    port = sae.const.MYSQL_PORT
    host_s = sae.const.MYSQL_HOST_S

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': db_name,                      # Or path to database file if using sqlite3.
        'USER': name,                      # Not used with sqlite3.
        'PASSWORD': pwd,                  # Not used with sqlite3.
        'HOST': host,                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': port,                      # Set to empty string for default. Not used with sqlite3.
    }
}

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.4/ref/settings/#allowed-hosts
ALLOWED_HOSTS = ["*"]

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'Asia/Shanghai'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'zh-cn'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = False

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = ''

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = ''

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = os.path.join(BASE_URL,'static')

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/static/'

# Additional locations of static files
STATICFILES_DIRS = (
    ('css', os.path.join(STATIC_ROOT, 'css')),
    ('js', os.path.join(STATIC_ROOT, 'js')),
    ('images', os.path.join(STATIC_ROOT, 'images')),
    ('fonts', os.path.join(STATIC_ROOT, 'fonts')),
    ('upload', os.path.join(STATIC_ROOT, 'upload')),
    ('media_pic', os.path.join(STATIC_ROOT, 'media_pic')),
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = '4e+ch5v$c56%iy&amp;_)a%qrgx%@acu_m*p^1!6yi+o4j49(fcdb3'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'Aboutme.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'Aboutme.wsgi.application'


TEMPLATE_DIRS = (os.path.join(BASE_URL, 'templates').replace('\\','/'),)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
    'mine',
    'tools',
    'nav',
)

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
