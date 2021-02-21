from threading import Thread
import sys
from queue import Queue
import requests

url = 'http://localhost:3000/request'
myobj = {'title': 'cat'}


concurrent = 50
total = 200

def concurentRequests():
    while True:
        url = q.get()
        res = getResponse(url)
        outputResult(res)
        q.task_done()

def getResponse(ourl):
    try:
        x = requests.post(ourl, data = myobj)
        return x
    except:
        return "error"

def outputResult(res):
    print(res)

q = Queue(concurrent)

for i in range(concurrent):
    t = Thread(target=concurentRequests)
    t.daemon = True
    t.start()
try:
    for i in range(total):
        q.put(url)
    q.join()
except KeyboardInterrupt:
    sys.exit(1)