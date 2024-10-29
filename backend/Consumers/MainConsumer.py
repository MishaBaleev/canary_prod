from channels.generic.websocket import WebsocketConsumer
import ujson as json
from threading import Thread
from Detectors.MainDetector import MainDetector
from Readers.MainReader import MainReader
import time
import os
import sqlite3

class MainConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.serial_reader = None
        self.thread = None
        self.detector = MainDetector()
        self.base_config = {
            "is_rec": False,
            "rec_arr": [],
            "note": []
        }

    def stopRec(self, file_name):
        connection = sqlite3.connect(f"{os.getcwd().replace('backend', 'logs')}/{file_name}.db")
        cursor = connection.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS FramesCommonX3 (
            id INTEGER PRIMARY KEY,
            frame TEXT,
            time_point REAL,
            zone_state TEXT,
            note TEXT
            )
        ''')
        connection.commit()
        for item in self.base_config["rec_arr"]:
            cursor.execute('INSERT INTO FramesCommonX3 (frame, time_point, zone_state, note) VALUES (?, ?, ?, ?)', 
                           (json.dumps(item["frame"]), item["time"], json.dumps(item["zone_state"]), json.dumps(item["note"], ensure_ascii=False)))
        connection.commit()
        connection.close()
        self.base_config["rec_arr"] = []

    def stableCon(self):
        while self.serial_reader != None:
            frame = self.serial_reader.getData()
            if frame != None:
                send_data = {
                    "frame": frame,
                    "time": time.time(),
                    "zone_state": self.detector.analize(frame)
                }
                if self.base_config["is_rec"] == True:
                    rec_data = {
                       "frame": send_data["frame"],
                        "time": send_data["time"],
                        "zone_state": send_data["zone_state"],
                        "note": self.base_config["note"]
                    }
                    print(rec_data)
                    self.base_config["note"] = []
                    self.base_config["rec_arr"].append(rec_data)
                self.send(json.dumps(send_data))
                
    def connect(self):
        self.accept()

    def receive(self, text_data):
        data = json.loads(text_data)
        command = data["command"]
        # print(data)
        match command:
                case "start":
                    try: 
                        print(data["start_config"])
                        interface = data["start_config"]["int"]
                        self.serial_reader = MainReader(interface)
                        self.serial_reader.createCon()
                        self.thread = Thread(target=self.stableCon, args={})
                        self.thread.daemon = True 
                        self.thread.start()
                    except ValueError as err:
                        print(err) 
                        print("Ошибка при подключении к порту")
                case "off":
                    self.serial_reader = None
                    self.thread.join()
                case  "act_rec":
                    self.base_config["is_rec"] = data["value"]
                    if data["value"] == False:
                        self.stopRec(data["file_name"])
                case  "add_note":
                    self.base_config["note"].append(data["value"])
                    print(self.base_config["note"])

    def disconnect(self, code):
        pass