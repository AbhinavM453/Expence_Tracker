from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static


schema_view = get_schema_view(
   openapi.Info(
      title="Expence Tracker API",
      default_version='v1',
      description="API for Expence Tracker",
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('User/',include('user.urls')),
    path('Category/',include('category.urls')),
    path('Expense/',include('expense.urls')),
    path('Income/',include('income.urls')),
    path('ai/',include('chatboat.urls')),
    path('budget/',include('budget.urls')),
    path('analytics/',include('analytics.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
