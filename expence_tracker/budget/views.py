from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Budget
from user.models import User
from .serializers import BudgetSerializer
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema

# Create your views here.

class BudgetListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    @swagger_auto_schema(
        operation_description="Get all Budget records of the logged-in user",
        responses={200: BudgetSerializer(many=True)}
    )
    def get(self, request):
        user = get_object_or_404(User,login=request.user)
        budgets = Budget.objects.filter(user=user)
        serializer = BudgetSerializer(budgets, many=True)
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_description="Create a new Income",
        request_body=BudgetSerializer,
        responses={201: BudgetSerializer(), 400: "Invalid data"}
    )

    def post(self, request):
        serializer = BudgetSerializer(data=request.data)
        if serializer.is_valid():
            user = get_object_or_404(User,login=request.user)
            serializer.save(user=user)  
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class BudgetDetailView(APIView):
    permission_classes = [IsAuthenticated]
    

    @swagger_auto_schema(
        operation_description="Get a single Income by ID",
        responses={200: BudgetSerializer(), 404: "Not found"}
    )
    def get(self,request,id):
        user = get_object_or_404(User, login=request.user)
        budget = get_object_or_404(Budget,id=id,user=user)
        serializer = BudgetSerializer(budget)
        return Response(serializer.data)    
    
    @swagger_auto_schema(
        operation_description="Update an entire Income",
        request_body=BudgetSerializer,
        responses={200: BudgetSerializer(), 400: "Invalid data", 404: "Not found"}
    )

    def put(self,request,id):
        user = get_object_or_404(User, login=request.user)
        budget = get_object_or_404(Budget,id=id,user=user)
        serializer = BudgetSerializer(instance=budget,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def delete(self,request,id):
        user = get_object_or_404(User, login=request.user)
        budget = get_object_or_404(Budget,id=id,user=user)
        budget.delete()
        return Response({"message": "Deleted successfully"}, status=204)