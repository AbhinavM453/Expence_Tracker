from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from expense.models import Expense
from income.models import Income
from user.models import User
from groq import Groq
from django.conf import settings
from dateutil.relativedelta import relativedelta
from budget.models import Budget
from datetime import datetime
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


client = Groq(api_key=settings.GROQ_API_KEY)


class FinanceChatbotAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Ask the AI financial assistant a question based on your income and expenses.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["question"],
            properties={
                "question": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="User question for the AI financial chatbot"
                )
            }
        ),
        responses={
            200: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "answer": openapi.Schema(
                        type=openapi.TYPE_STRING,
                        description="AI generated answer"
                    )
                }
            ),
            400: "Bad Request",
            401: "Unauthorized"
        }
    )
    def post(self, request):
        question = request.data.get("question")
        user = get_object_or_404(User, login=request.user)

        if not question:
            return Response({"error": "Question is required"}, status=400)

        total_expenses = Expense.objects.filter(user=user).aggregate(total=Sum("amount"))["total"] or 0
        total_income = Income.objects.filter(user=user).aggregate(total=Sum("amount"))["total"] or 0

        system_prompt = f"""
        You are a financial assistant AI.

        User Financial Summary:
        - Total Income: ₹{total_income}
        - Total Expenses: ₹{total_expenses}
        """

        

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question},
            ]
        )

        answer = response.choices[0].message.content
        return Response({"answer": answer})



class AIInsightsView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Generate AI-powered financial insights based on your income, expenses, and budget.",
        responses={
            200: openapi.Response(
                description="AI-generated financial insights",
                examples={
                    "application/json": {
                        "insights": "Your food expenses increased 22%. You are exceeding your monthly budget by ₹1500. Reduce online shopping to stay within limits."
                    }
                }
            )
        }
    )
    def get(self, request):
        user = get_object_or_404(User,login=request.user)

        expenses = Expense.objects.filter(user=user)
        income = Income.objects.filter(user=user)
        budget = Budget.objects.filter(user=user)

        total_expense = expenses.aggregate(Sum("amount"))["amount__sum"] or 0
        total_income = income.aggregate(Sum("amount"))["amount__sum"] or 0

        now = datetime.now()
        monthly_expense = expenses.filter(
            created_at__month=now.month,
            created_at__year=now.year
        ).aggregate(Sum("amount"))["amount__sum"] or 0

        monthly_budget = budget.filter(
            month=now.month,
            year=now.year
        ).first()

        prompt = f"""
        You are an AI finance assistant.

        Financial Summary:
        - Total Income: ₹{total_income}
        - Total Expense: ₹{total_expense}
        - This Month Expense ({now.month}/{now.year}): ₹{monthly_expense}
        - This Month Budget: {monthly_budget.amount if monthly_budget else "Not Set"}

        Generate 4–5 short, helpful insights to improve the user's financial health.
        """

        res = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a finance advisor."},
                {"role": "user", "content": prompt},
            ]
        )

        return Response({
            "insights": res.choices[0].message.content
        })


months_param = openapi.Parameter(
    name="months",
    in_=openapi.IN_QUERY,
    description="Number of months to predict (default = 3)",
    type=openapi.TYPE_INTEGER,
    required=False
)


class AIPredictView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Predict the next N months of expenses using AI based on your past 6 months spending.",
        manual_parameters=[months_param],
        responses={
            200: openapi.Response(
                description="AI-generated expense predictions",
                examples={
                    "application/json": {
                        "history_used": [
                            {"month": "October", "year": 2025, "amount": 12000},
                            {"month": "September", "year": 2025, "amount": 11500},
                        ],
                        "prediction": {
                            "December": 13000,
                            "January": 14000,
                            "February": 13800
                        }
                    }
                }
            )
        }
    )
    def get(self, request):
        user = get_object_or_404(User,login=request.user)
        months = int(request.GET.get("months", 3))

        expenses = Expense.objects.filter(user=user)

        history = []
        today = datetime.now()

        for i in range(6):
            month_date = today - relativedelta(months=i)
            amount = expenses.filter(
                created_at__month=month_date.month,
                created_at__year=month_date.year
            ).aggregate(Sum("amount"))["amount__sum"] or 0

            history.append({
                "month": month_date.strftime("%B"),
                "year": month_date.year,
                "amount": float(amount)
            })

        prompt = f"""
        Based on this 6-month expense history:
        {history}

        Predict the next {months} months of expenses.
        Respond ONLY in pure JSON like:
        {{
            "December": 14500,
            "January": 15200
        }}
        """

        res = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a financial predictor."},
                {"role": "user", "content": prompt},
            ]
        )

        return Response({
            "history_used": history,
            "prediction": res.choices[0].message.content
        })
