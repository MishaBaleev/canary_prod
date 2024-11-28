from django.contrib import admin
from django.urls import path
from django.urls import re_path as url
from api.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", index, name="index"),
    path("checkBack", checkBack.as_view()),
    path("getInts", getInts.as_view()),
    path("getLogData", getLogData.as_view()),
    path("getCoordsFromPlace", getCoordsFromPlace.as_view()),
    path("saveAnalize", saveAnalize.as_view())
]
