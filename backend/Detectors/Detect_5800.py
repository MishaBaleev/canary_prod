def detect_5800(arr:list) -> dict:
    counter = 0
    for a in arr:
        if a >= 95: counter += 1
    if counter >= 2: return 1
    else: return 0
    # for i in range(len(arr)-2):
    #     cur_freq = arr[i]
    #     next_freq = arr[i+1]
    #     next_next_freq = arr[i+2]
    #     if cur_freq >= 95 and next_freq >= 95 and next_next_freq >= 95:
    #         return 1
    # return 0