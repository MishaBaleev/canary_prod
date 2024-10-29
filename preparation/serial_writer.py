import serial
from serial.tools import list_ports
import ujson as json
import time

def getInterfaces() -> list:
    ints = list_ports.comports()
    list = []
    for int in ints: list.append(int.device)
    print(f"---port list - {list}---")
    return list

def writeSerial(json_obj:json, int:str, baudrate_:int) -> None:
    session = serial.Serial(int, baudrate=baudrate_)
    time.sleep(1)
    byte_str = bytes(json.dumps(json_obj)+"\n", "utf-8")
    print(f"---byte string - {byte_str}---")
    session.write(byte_str)
    print("---the line has been sent---")
    time.sleep(0.1)
    print(f"---line - {session.read_all()}---")

def readSerial(session) -> None:
    
    print(f"---line - {session.readline()}---")

if __name__ == "__main__":
    # ints = getInterfaces()
    # input_value = int(input("input - "))
    # print(ints[3])
    # session = serial.Serial("/dev/cu.usbserial-1120", baudrate=115200)
    # while input_value != 0:
    #     readSerial(session)
    #     input_value = int(input("input - "))
    command = {
        "Range": 915,
        "Time": 500
    }
    baudrate = 115200
    writeSerial(command, ints[3], baudrate)
    # readSerial(ints[3], baudrate)
