import sqlite3
import ujson as json

HAND_CONTROL_RANGE = [5, 12] # нужно исправить
WI_FI_CONTROL_RANGE = [13, 15]
WI_FI_DOWNLOAD_RANGE = [18, 25]
WI_FI_UPLOAD_RANGE = [30, 85]
RANGES = [HAND_CONTROL_RANGE, WI_FI_CONTROL_RANGE, WI_FI_DOWNLOAD_RANGE, WI_FI_UPLOAD_RANGE]

def getHills(freq_arr:list, crit_level:int) -> list:
    hill_arr = []
    range_start = 0
    range_end = 0
    for i in range(len(freq_arr)-1):
        cur_freq = freq_arr[i]
        next_freq = freq_arr[i+1]
        if cur_freq <= crit_level and next_freq > crit_level:
            range_start = i+1
        if cur_freq > crit_level and next_freq <= crit_level:
            range_end = i
            hill_arr.append([range_start, range_end])
            range_start = 0
            range_end = 0
    return hill_arr

def getAvHeight(arr:list, start:int, end:int) -> float:
    sum = 0
    for i in range(start, end):
        sum += arr[i]
    return sum/(end-start) if ((end-start)>0) else 0

def getWidth(freqArr:list, critLevel:int) -> int:
    counter = 0
    for d in freqArr:
        if d >= critLevel: counter += 1
    return counter 

def isIn(target:int, range:list) -> bool:
    if range[0] <= target <= range[1]: return True 
    else: return False

# 0 - unknown
# 1 - hand-control
# 2 - wi-fi control
# 3 - wi-fi download
# 4 - wi-fi upload
def autoAnalize(freqArr:list) -> int:
    hillArr = []
    for critLevel in [10, 15, 20]:
        hills = getHills(freqArr, critLevel)
        for h in hills:
            hillArr.append({
                "critLevel": critLevel,
                "hill": h
            })
    targetHills = []
    for h1 in hillArr:
        counter = 0
        for h2 in hillArr:
            print(h1, h2)
            print("-----")
            if h1["critLevel"] != h2["critLevel"]: 
                centerH1 = (h1["hill"][1] + h1["hill"][0])/2
                centerH2 = (h2["hill"][1] + h2["hill"][0])/2
                if (centerH2 - 3) <= centerH1 <= (centerH2 + 3): counter += 1
        if counter >= 2:
            targetHills.append(h1["hill"])

    for th in targetHills:
        length = th[1] - th[0]
        for index, r in enumerate(RANGES): 
            if isIn(length, r): return index+1
    return 0

def getData(file_path:str) -> list:
    with sqlite3.connect(file_path) as db:
        cursor = db.cursor()
        cursor.execute('SELECT * FROM Frames;')
        rows = cursor.fetchall()
        log_data = []
        for r in rows:
            log_data.append(r[1])
    return log_data

def analize915(arr:list) -> int:
    for f in arr:
        if f >= 25: return 1
    return 0
def analize2400(arr:list) -> int:
    return autoAnalize(arr)

if __name__ == "__main__":
    data = getData("./мавик_цпл_пульт.db")
    counter = 0
    for d in data: 
        res_2400 = analize2400(json.loads(d))
        if res_2400 == 1 or res_2400 == 2: counter += 1

    print(f"all - {len(data)}, warnings - {counter}")
    