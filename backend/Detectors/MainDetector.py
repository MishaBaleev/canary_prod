from .Detect_2400 import detect_2400
from .Detect_915 import detect_915
from .Detect_5800 import detect_5800

# 0 - undefined
class MainDetector():
    def __init__(self):
        pass

    def analize(self, frame):
        match frame["type"]:
            case "type_2400":
                return detect_2400(frame["arr"]) #available 0, 1, 2, 3, 4
            case "type_915":
                return detect_915(frame["arr"]) #available 0, 1
            case "type_5800":
                return detect_5800(frame["arr"])  #available 0, 1