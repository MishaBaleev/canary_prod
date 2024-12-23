from django.shortcuts import render

# from django.shortcuts import render_to_response
from rest_framework.views import APIView
from rest_framework.response import Response
from serial.tools import list_ports
import json
import apsw
import requests
import pandas as pd
import os

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

def addChart(workbook, worksheet, start:list, end:list, place_coords:list, name:str) -> None:
    chart = workbook.add_chart({"type": "line"})
    chart.set_legend({'none': True})
    chart.add_series({"values": ["table_data", start[0], start[1], end[0], end[1]], "name": name})
    worksheet.insert_chart(place_coords[0], place_coords[1], chart)
        
class saveAnalize(APIView):
    def post(self, request):
        try: 
            data = json.loads(request.data["data"])
            log_name = request.data["log_name"]
            data_frame = pd.DataFrame()
            topics = ["time", "av_value", "payload", "zone_state"]
            for type in ["915", "2400", "5800"]:
                for top in topics:
                    new_data_frame = pd.DataFrame({f"{top} {type}": data[top][f"type_{type}"]})
                    data_frame = pd.concat([data_frame, new_data_frame], axis=1)
            writer = pd.ExcelWriter(f"{os.getcwd().replace('backend', 'reports')}/{log_name[:len(log_name)-3]}.xlsx", engine="xlsxwriter")
            data_frame.to_excel(writer, sheet_name="table_data")
            workbook = writer.book 
            worksheet = writer.sheets["table_data"]

            addChart(workbook, worksheet, [1, 2], [len(data["av_value"]["type_915"]), 2], [1, 14], "Change average value 915")
            addChart(workbook, worksheet, [1, 3], [len(data["payload"]["type_915"]), 3], [1, 22], "Change payload 915")
            addChart(workbook, worksheet, [1, 4], [len(data["zone_state"]["type_915"]), 4], [1, 30], "Change zone state 915")

            addChart(workbook, worksheet, [1, 6], [len(data["av_value"]["type_2400"]), 6], [16, 14], "Change average value 2,4")
            addChart(workbook, worksheet, [1, 7], [len(data["payload"]["type_2400"]), 7], [16, 22], "Change payload 2,4")
            addChart(workbook, worksheet, [1, 8], [len(data["zone_state"]["type_2400"]), 8], [16, 30], "Change zone state 2,4")

            addChart(workbook, worksheet, [1, 10], [len(data["av_value"]["type_5800"]), 10], [31, 14], "Change average value 5800")
            addChart(workbook, worksheet, [1, 11], [len(data["payload"]["type_5800"]), 11], [31, 22], "Change payload 5800")
            addChart(workbook, worksheet, [1, 12], [len(data["zone_state"]["type_5800"]), 12], [31, 30], "Change zone state 5800")
            writer.close()
            return Response({"result": True})
        except ValueError as err:
            print(err)
            return Response({"result": False})
