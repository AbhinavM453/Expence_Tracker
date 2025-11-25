from django.urls import path
from .views import *

urlpatterns = [
    path("summary/", AnalyticsSummaryView.as_view(), name="analytics-summary"),
    path("by-category/", AnalyticsByCategoryView.as_view(), name="analytics-by-category"),
    path("monthly/", AnalyticsMonthlyView.as_view(), name="analytics-monthly"),
    path("weekly/", AnalyticsWeeklyView.as_view(), name="analytics-weekly"),
]
