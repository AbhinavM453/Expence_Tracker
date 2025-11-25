from django.urls import path
from .views import *

urlpatterns = [
    path("expenses/", ExpenseListCreateAPIView.as_view(), name="expenses-list-create"),
    path("expenses/<int:id>/", ExpenseDetailAPIView.as_view(), name="expenses-detail"),
    path('expenses/filter/', ExpenseFilterView.as_view(), name='expense-filter'),
]
