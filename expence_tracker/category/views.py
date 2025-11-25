from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Category
from user.models import User
from .serializers import CategorySerializer
from django.shortcuts import get_object_or_404
from .authentication import LoginJWTAuthentication
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
# Create your views here.


class CategoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id=None):
        user = get_object_or_404(User,login=request.user)

        if id:
            category = get_object_or_404(Category, id=id, user=user)
            serializer = CategorySerializer(category)  # single object ✔
        else:
            category = Category.objects.filter(user=user)
            serializer = CategorySerializer(category, many=True)  # FIX ✔

        return Response(serializer.data)  
    

    @swagger_auto_schema(
        operation_description="Register a new user with an image",
        request_body=CategorySerializer,   
        responses={201: "User registered successfully", 400: "Invalid data"}
    )

    def post(self,request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            user = get_object_or_404(User, login=request.user)
            serializer.save(user=user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    @swagger_auto_schema(
        operation_description="Register a new user with an image",
        request_body=CategorySerializer,   
        responses={201: "User registered successfully", 400: "Invalid data"}
    )

    def patch(self,request,id):
        user = get_object_or_404(User, login=request.user)
        category = get_object_or_404(Category,id=id,user=user)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def delete(self,request,id):
        user = get_object_or_404(User, login=request.user)
        category = get_object_or_404(Category,id=id,user=user)
        category.delete()
        return Response({"message": "Category deleted successfully"}, status=204)


