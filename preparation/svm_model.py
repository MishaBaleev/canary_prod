import sqlite3
import ujson as json
import numpy as np
import csv
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report

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

def isIn(target:int, range:list) -> bool:
    if range[0] <= target <= range[1]: return True 
    else: return False

# 0 - unknown
# 1 - hand-control
# 2 - wi-fi control
# 3 - wi-fi download
# 4 - wi-fi upload
def autoAnalize(freqArr:list) -> list:
    hillArr = {
        10: [],
        15: [],
        20: []
    }
    for critLevel in [10, 15, 20]:
        hills = getHills(freqArr, critLevel)
        for h in hills:
            hillArr[critLevel].append(h)
            # hillArr.append({
            #     "critLevel": critLevel,
            #     "hill": h
            # })
    # print(hillArr)
    res_hills = []
    centers_15 = [(item[1]+item[0])/2 for item in hillArr[15]]
    centers_20 = [(item[1]+item[0])/2 for item in hillArr[20]]
    for h in hillArr[10]:
        counter = 0
        center = (h[0] + h[1])/2
        for c in centers_15: 
            if c-3 <= center <= c+3: 
                counter += 1
                break
        for c in centers_20: 
            if c-3 <= center <= c+3: 
                counter += 1
                break
        if counter == 2: res_hills.append(h)
    return res_hills
    # targetHills = []
    # for h1 in hillArr:
    #     counter = 0
    #     for h2 in hillArr:
    #         if h1["critLevel"] != h2["critLevel"]: 
    #             centerH1 = (h1["hill"][1] + h1["hill"][0])/2
    #             centerH2 = (h2["hill"][1] + h2["hill"][0])/2
    #             if (centerH2 - 3) <= centerH1 <= (centerH2 + 3): counter += 1
    #     if counter >= 2:
    #         targetHills.append(h1["hill"])
    #         rgetHills.remove()

    # return targetHills

def getHeight(freqs:list) -> float:
    summ = 0
    for f in freqs: 
        summ += f 
    if len(freqs) == 0: return 0
    else: return summ/len(freqs)

def getData(file_path:str) -> list:
    with sqlite3.connect(file_path) as db:
        cursor = db.cursor()
        cursor.execute('SELECT * FROM Frames;')
        rows = cursor.fetchall()
        log_data = []
        for r in rows:
            log_data.append(json.loads(r[1]))
    return log_data

def getMetrics(data:list) -> list:
    mean = float(np.mean(data))
    median = int(np.median(data))
    std = float(np.std(data))
    width = len(data)
    return [mean, median, std, width]

def input_dataset(files:list) -> tuple:
    x = []
    y = []
    for index, file in enumerate(files):
        data = getData(file)
        for d in data:
            res_analize = autoAnalize(d)
            for new_range in res_analize:
                np_list = d[new_range[0]:new_range[1]]
                if len(np_list) == 0: pass 
                else:
                    x.append(getMetrics(np_list))
                    y.append(index)
    return x, y

def getExample(model, scaler) -> None:
    data = getData("./wi-fi_norm.db")
    example = data[11]
    res_analise = autoAnalize(example)[0]
    np_list = example[res_analise[0]:res_analise[1]]
    res_data = getMetrics(np_list)
    features_scaled = scaler.transform([res_data])
    prediction = model.predict(features_scaled)
    print(f"Предсказанная метка класса: {prediction[0]}")

if __name__ == "__main__":
    x, y = input_dataset(["./hand_control.db", "./wi-fi_control.db"])
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=42)
    scaler = StandardScaler()
    x_train = scaler.fit_transform(x_train)
    x_test = scaler.transform(x_test)
    svm_model = SVC(kernel='linear', C=1.0, random_state=42)
    svm_model.fit(x_train, y_train)
    y_pred = svm_model.predict(x_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Точность модели: {accuracy:.2f}")
    print("Отчет о классификации:")
    print(classification_report(y_test, y_pred))

    #predict
    getExample(svm_model, scaler)