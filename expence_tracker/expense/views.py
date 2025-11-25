from django.shortcuts import render
from rest_framework.views import APIView
from user.models import User
from category.models import Category
from .models import Expense
from .serializers import ExpenseSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from .authentication import LoginJWTAuthentication
from datetime import datetime


class ExpenseListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
   
    @swagger_auto_schema(
        operation_description="Get all expenses of the authenticated user",
        responses={200: ExpenseSerializer(many=True)}
    )
    def get(self, request):
        expenses = Expense.objects.filter(user__login=request.user).order_by("-date", "-created_at")
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    
    @swagger_auto_schema(
        operation_description="Create a new expense",
        request_body=ExpenseSerializer,
        responses={201: ExpenseSerializer(), 400: "Invalid data"}
    )
    def post(self, request):
        serializer = ExpenseSerializer(data=request.data)
        if serializer.is_valid():
            user = get_object_or_404(User, login=request.user)
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ExpenseDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, id, user):
        try:
            return Expense.objects.get(id=id, user=user)
        except Expense.DoesNotExist:
            return None

    @swagger_auto_schema(
        operation_description="Get a single expense by ID",
        responses={200: ExpenseSerializer(), 404: "Not found"}
    )
    def get(self, request, id):
        expense = get_object_or_404(Expense,id=id,user__login=request.user)
        serializer = ExpenseSerializer(expense)
        return Response(serializer.data, status=status.HTTP_200_OK)

  
    @swagger_auto_schema(
        operation_description="Update an entire expense",
        request_body=ExpenseSerializer,
        responses={200: ExpenseSerializer(), 400: "Invalid data", 404: "Not found"}
    )
    def put(self, request, id):
        expense = get_object_or_404(Expense,id=id,user__login=request.user)
        serializer = ExpenseSerializer(expense, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  
    @swagger_auto_schema(
        operation_description="Partially update an expense",
        request_body=ExpenseSerializer,
        responses={200: ExpenseSerializer(), 400: "Invalid data", 404: "Not found"}
    )
    def patch(self, request, id):
        expense = get_object_or_404(Expense,id=id,user__login=request.user)
        serializer = ExpenseSerializer(expense, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        expense = get_object_or_404(Expense,id=id,user__login=request.user)

        expense.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)






class ExpenseFilterView(APIView):
    permission_classes = [IsAuthenticated]

    def validate_date(self, date_str):
        """Validate date format YYYY-MM-DD"""
        try:
            return datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return None

    @swagger_auto_schema(
        operation_description="Filter expenses based on date range, category, payment method, amount, month, or year.",
        manual_parameters=[
            openapi.Parameter('start_date', openapi.IN_QUERY, description="Start date (YYYY-MM-DD)", type=openapi.TYPE_STRING),
            openapi.Parameter('end_date', openapi.IN_QUERY, description="End date (YYYY-MM-DD)", type=openapi.TYPE_STRING),
            openapi.Parameter('category', openapi.IN_QUERY, description="Category ID", type=openapi.TYPE_INTEGER),
            openapi.Parameter('min_amount', openapi.IN_QUERY, description="Minimum amount", type=openapi.TYPE_NUMBER),
            openapi.Parameter('max_amount', openapi.IN_QUERY, description="Maximum amount", type=openapi.TYPE_NUMBER),
            openapi.Parameter('payment_method', openapi.IN_QUERY, description="Payment method (CASH, CARD, UPI, BANK, OTHER)", type=openapi.TYPE_STRING),
            openapi.Parameter('month', openapi.IN_QUERY, description="Month (1-12)", type=openapi.TYPE_INTEGER),
            openapi.Parameter('year', openapi.IN_QUERY, description="Year (e.g., 2025)", type=openapi.TYPE_INTEGER),
        ],
        responses={200: "Filtered list of expenses"}
    )
    def get(self, request):
        user = get_object_or_404(User, login=request.user)
        expenses = Expense.objects.filter(user=user)

        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        category = request.GET.get("category")
        min_amount = request.GET.get("min_amount")
        max_amount = request.GET.get("max_amount")
        payment_method = request.GET.get("payment_method")
        month = request.GET.get("month")
        year = request.GET.get("year")

        # Validate date format
        if start_date:
            validated = self.validate_date(start_date)
            if not validated:
                return Response({"error": "Invalid start_date format. Use YYYY-MM-DD."}, status=400)
            expenses = expenses.filter(date__gte=validated)

        if end_date:
            validated = self.validate_date(end_date)
            if not validated:
                return Response({"error": "Invalid end_date format. Use YYYY-MM-DD."}, status=400)
            expenses = expenses.filter(date__lte=validated)

        # Other filters
        if category:
            expenses = expenses.filter(category_id=category)

        if min_amount:
            expenses = expenses.filter(amount__gte=min_amount)

        if max_amount:
            expenses = expenses.filter(amount__lte=max_amount)

        if payment_method:
            expenses = expenses.filter(payment_method=payment_method)

        if month:
            expenses = expenses.filter(date__month=month)

        if year:
            expenses = expenses.filter(date__year=year)

        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data, status=200)