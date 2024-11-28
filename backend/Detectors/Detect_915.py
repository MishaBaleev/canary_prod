def analize(arr:list) -> int:
    for f in arr:
        if f > 40:
            return 1
    return 0

# 0 - undefined
# 1 - warning
# 2 - safe
def detect_915(arr:list) -> dict:
    return analize(arr)