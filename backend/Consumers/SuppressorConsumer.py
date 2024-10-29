from channels.generic.websocket import WebsocketConsumer
import ujson as json
import serial 

class SuppressorConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.time = None 
        self.range = None
        self.session = None
                
    def connect(self):
        self.accept()

    def receive(self, text_data):
        data = json.loads(text_data)
        command = data["command"]
        match command:
            case "start":
                print(data["start_config"])
                int_ = data["start_config"]["int"]
                self.session = serial.Serial(int_, baudrate=115200)
                self.time = int(data["start_config"]["time"])
                self.range = int(data["start_config"]["range"])
            case "suppress":
                self.time =int( data["data"]["time"])
                self.range = int(data["data"]["range"])
                command = {"Range": self.range, "Time": self.time}
                byte_command = bytes(json.dumps(command)+"\n", "utf-8")
                print(byte_command)
                self.session.write(byte_command)
                print("---command send---")
            case "stop":
                pass

    def disconnect(self, code):
        pass