from django.urls import path
from .views import *

urlpatterns = [
    path('income/', IncomeListCreateView.as_view()),
    path('income/<int:id>/', IncomeDetailView.as_view()),
]
