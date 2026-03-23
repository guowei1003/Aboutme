from django.contrib import admin
from .models import AccessRecord, Tool, ToolsClass

admin.site.register(AccessRecord)
admin.site.register(Tool)
admin.site.register(ToolsClass)
