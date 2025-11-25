from django.urls import path
from .views import *

urlpatterns = [
    path("chatbot/", FinanceChatbotAPIView.as_view(), name="finance-chatbot"),
    path("insights/", AIInsightsView.as_view(), name="ai-insights"),
    path("predict/", AIPredictView.as_view(), name="ai-predict"),
]