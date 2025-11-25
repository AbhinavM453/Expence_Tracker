from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .authentication import LoginJWTAuthentication
from expense.models import Expense
from income.models import Income
from datetime import datetime, timedelta
from rest_framework.views import APIView
from django.db.models import Sum
from budget.models import Budget
from django.shortcuts import get_object_or_404
from user.models import User
from django.db.models.functions import ExtractMonth
from django.db.models.functions import ExtractDay


# Create your views here.


class AnalyticsSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = get_object_or_404(User, login=request.user)

        total_expense = Expense.objects.filter(user=user).aggregate(Sum("amount"))["amount__sum"] or 0
        total_income = Income.objects.filter(user=user).aggregate(Sum("amount"))["amount__sum"] or 0

        balance = total_income - total_expense

        # Top category spending
        category_data = (
            Expense.objects.filter(user=user).values("category").annotate(total=Sum("amount")).order_by("-total")
        )
        top_category = category_data[0] if category_data else None

        # Current month spending
        now = datetime.now()
        month_expense = Expense.objects.filter(user=user,created_at__month=now.month,created_at__year=now.year
        ).aggregate(Sum("amount"))["amount__sum"] or 0

        return Response({
            "total_income": total_income,
            "total_expense": total_expense,
            "balance": balance,
            "top_category": top_category,
            "current_month_expense": month_expense
        })


class AnalyticsByCategoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = get_object_or_404(User, login=request.user)

        data = (
            Expense.objects.filter(user=user)
            .values("category")
            .annotate(total=Sum("amount"))
            .order_by("-total")
        )

        return Response(data)

class AnalyticsMonthlyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = get_object_or_404(User, login=request.user)
        year = int(request.GET.get("year", datetime.now().year))

        monthly_data = (
            Expense.objects.filter(user=user, created_at__year=year)
            .annotate(month=ExtractMonth("created_at"))
            .values("month")
            .annotate(total=Sum("amount"))
            .order_by("month")
        )

        MONTHS = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ]

        result = {
            MONTHS[item["month"] - 1]: item["total"]
            for item in monthly_data
        }

        return Response(result)


class AnalyticsWeeklyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = get_object_or_404(User, login=request.user)

        today = datetime.now().date()
        last_week = today - timedelta(days=6)

        week_data = (
            Expense.objects.filter(user=user, created_at__date__range=[last_week, today])
            .annotate(day=ExtractDay("created_at"))
            .values("created_at__date")
            .annotate(total=Sum("amount"))
            .order_by("created_at__date")
        )

        result = {
            str(item["created_at__date"]): item["total"]
            for item in week_data
        }

        return Response(result)
