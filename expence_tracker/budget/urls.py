from django.urls import path
from .views import *

urlpatterns = [
    path('budget/',BudgetListCreateView.as_view()),
    path('budget/<int:id>/',BudgetDetailView.as_view()),
]
