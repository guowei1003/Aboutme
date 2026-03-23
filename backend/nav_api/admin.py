from django.contrib import admin
from .models import Site, SiteClass, SiteGroup

admin.site.register(Site)
admin.site.register(SiteClass)
admin.site.register(SiteGroup)
