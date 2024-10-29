from django.shortcuts import render

# from django.shortcuts import render_to_response
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from serial.tools import list_ports
import json
import apsw
import os
import requests

def index(request):
    return render(request, "index.html")

class ReturnAppBuild(APIView):
    def get(self, request):
        return render(request, "AppBuild/index.html")
        # return render_to_response("./AppBuild/index.html")

class checkBack(APIView):
    def get(self, request):
        return Response()

class getInts(APIView):
    def get(self, request):
        ports = list_ports.comports()
        portsDevice = []
        for port in ports:
            portsDevice.append(port.device)
        return Response({
            "ints": portsDevice
        })

def getData(file):
    try:
        with apsw.Connection(':memory:') as db:
            db.deserialize('main', file)
            cursor = db.cursor()
            cursor.execute('SELECT * FROM FramesCommonX3;')
            rows = cursor.fetchall()
            log_data = []
            for row in rows:
                log_data.append({
                    "id": row[0],
                    "frame": row[1],
                    "time": row[2],
                    "zone_state": row[3],
                    "note": row[4]
                })
            return {
                "result": True,
                "log_data": log_data
            }
    except:
        return {
            "result": False
        }

class getLogData(APIView):
    def post(self, request):
        file = request.data['file'].read()
        return Response(getData(file))
    
class getCoordsFromPlace(APIView):
    def post(self, request):
        try:
            name = request.data["place"]
            name = "%20".join(name.split(" "))
            result = requests.get(f"https://api.mapbox.com/search/geocode/v6/forward?q={name}&access_token=pk.eyJ1IjoiYmFsZWV2IiwiYSI6ImNsYXBqNmk4dTE5Y3UzcWxiYmt1bTJtcG8ifQ.aE8lRdfDnWq52szIP7gAHw").content
            result_json = json.loads(result)
            return Response({
                "result": True,
                "data": result_json["features"][0]["geometry"]["coordinates"]
            })
        except:
            return Response({"result": False})
