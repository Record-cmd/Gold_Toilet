import requests, json
import sys

URL = "http://192.168.57.73:3000/"
API = ["post_toilet_info","put_toilet_info"]

def http_post_data(data):
    while True:
        Data = {
            'ToiletId' : 2,
            'Temperature' : data[0],
            'Humidity' : data[1],
            'State' : data[2],
            'Weight' : data[3]
        }
        try:
            URL_api = URL + API[0]
            res = requests.post(URL_api, json = Data)
            print(res.status_code)
            print("post")
        except (KeyboardInterrupt, SystemExit):
            sys.exit()
            break
        except:
            print("Failed")

        break
    
def http_put_data(data):
    while True:
        Data = {
            'ToiletId' : 2,
            'Temperature' : data[0],
            'Humidity' : data[1],
            'State' : data[2],
            'Weight' : data[3]
        }
        try:
            URL_api = URL + API[1]
            res = requests.put(URL_api, json = Data)
            print(res.status_code)
            print("put")
        except (KeyboardInterrupt, SystemExit):
            sys.exit()
            break
        except:
            print("Failed")  
        break
    
def http_put_data2(data):
    while True:
        Data = {
            'ToiletId' : 2,
            'Temperature' : data[0],
            'Humidity' : data[1],
            'Weight' : data[3]
        }
        try:
            URL_api = URL + API[1]
            res = requests.put(URL_api, json = Data)
            print(res.status_code)
            print("put")
        except (KeyboardInterrupt, SystemExit):
            sys.exit()
            break
        except:
            print("Failed")  
        break