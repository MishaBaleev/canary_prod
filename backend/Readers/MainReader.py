import serial 
import ujson as json

class MainReader():
    def __init__(self, int, baudrate):
        self.int = int 
        self.baudrate = baudrate
        self.session = None
        self.counter = 0
        self.frame = {
            "arr_915": [],
            "arr_2400": [],
            "arr_5800": []
        }

    def createCon(self):
        self.session = serial.Serial(self.int, baudrate=self.baudrate)

    def parseData(self, data:str) -> None:
        match data["type"]:
            case "1": #915 
                res_arr = [0 for _ in range(51)] 
                for index, value in data["freq"].items(): res_arr[int(index) - 870] = int(value)
                return res_arr
            case "2": #2.4
                channels_shift = {
                    "Channel_1": 0,
                    "Channel_2": 5,
                    "Channel_3": 10,
                    "Channel_4": 15,
                    "Channel_5": 20,
                    "Channel_6": 25,
                    "Channel_7": 30,
                    "Channel_8": 35,
                    "Channel_9": 40,
                    "Channel_10": 45,
                    "Channel_11": 50,
                    "Channel_12": 55,
                    "Channel_13": 60,
                } 
                res_arr = [0 for _ in range(82)]
                for channel_key, shift in channels_shift.items():
                    for index, value in enumerate(data[channel_key]):
                        target_index = index + shift
                        res_arr[target_index] = int(value)
                return res_arr
            case "3": #5.8
                res_arr = [0 for _ in range(39)]
                base = ['5645', '5658', '5665', '5685', '5695', '5705', '5725', '5732', '5733', '5740', '5745', '5752', '5760', '5765', '5769', '5771', '5780', '5785', '5790', '5800', '5805', '5806', '5809', '5820', '5825', '5828', '5840', '5843', '5845', '5847', '5860', '5865', '5866', '5880', '5885', '5905', '5917', '5925', '5945']
                for _, value in enumerate(data["freq"].items()):
                    res_arr[base.index(value[0])] = int(value[1])
                return res_arr

    def parseDataCommonX2(self, data:str) -> None:
        try: #all
            json_data = json.loads(data)
            try: #2400
                channels_shift = {
                    "Channel_1": 0,
                    "Channel_2": 5,
                    "Channel_3": 10,
                    "Channel_4": 15,
                    "Channel_5": 20,
                    "Channel_6": 25,
                    "Channel_7": 30,
                    "Channel_8": 35,
                    "Channel_9": 40,
                    "Channel_10": 45,
                    "Channel_11": 50,
                    "Channel_12": 55,
                    "Channel_13": 60,
                }
                res_arr = [0 for _ in range(82)]
                for key in json_data.keys():
                    for index, value in enumerate(json_data[key]):
                        target_index = index + channels_shift[key]
                        res_arr[target_index] = int(value) 
                return {"type": 2400, "res": res_arr}
            except:
                # print("error 2400")
                try: #915
                    res_arr = [0 for _ in range(100)] 
                    for key in json_data.keys():
                        res_arr[int(key)-820] = int(json_data[key][0])
                    return {"type": 915, "res": res_arr}
                except:
                    # print("error 915")
                    return None 
        except: 
            return None


    def getData(self):
        raw_data = self.session.readline()
        if ("type" in raw_data[:6].decode()):
            print(1)
            try:
                line_data = json.loads(raw_data.decode().replace("'", '"'))
                if (line_data["type"] == "1"):
                    # print(line_data, "\n")
                    return {
                        "type": "type_915",
                        "arr": self.parseData(line_data)
                    } 
                elif (line_data["type"] == "2"):
                    # print(line_data, "\n")
                    return {
                        "type": "type_2400",
                        "arr": self.parseData(line_data)
                    } 
                elif (line_data["type"] == "3"):
                    # print(line_data, "\n")
                    return {
                        "type": "type_5800",
                        "arr": self.parseData(line_data)
                    }
            except: 
                return None
        else:
            result = self.parseDataCommonX2(raw_data.decode().replace("'", '"'))
            if result == None: return None 
            else:
                if result["type"] == 2400:
                    return {
                        "type": "type_2400",
                        "arr": result["res"]
                    } 
                elif result["type"] == 915:
                    return {
                        "type": "type_915",
                        "arr": result["res"]
                    }