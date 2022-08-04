from django.shortcuts import render
from django.http.response import HttpResponse

def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')