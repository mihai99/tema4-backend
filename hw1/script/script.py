from threading import Thread
import sys
from queue import Queue
import requests
import time

url = 'http://localhost:3000/request'
myobj = {'title': 'cat'}


concurrent = 5
total = 100
concurentArray = []
meanTime = 0
def concurentRequests():
    global meanTime
    while True:
        nr = q.get()
        start = time.time()
        res = getResponse(url)
        end = time.time()
        meanTime += start - end
        outputResult(res)
        q.task_done()
    print("mean time:", meanTime/total)

def getResponse(ourl):
    try:
        x = requests.post(ourl, data = myobj)
        return x
    except:
        return "error"

def outputResult(res):
    global concurentArray
    concurentArray.append(res)
    if (len(concurentArray) == concurrent):
        print(concurentArray)
        concurentArray = []

q = Queue(concurrent)

for i in range(concurrent):
    t = Thread(target=concurentRequests)
    t.daemon = True
    t.start()

try:
    for i in range(total):
        q.put(i)
    q.join()
except KeyboardInterrupt:
    sys.exit(1)