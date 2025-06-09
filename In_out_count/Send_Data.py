import requests, json
import sys

URL = "http://192.168.22.73:3000/"
API = ["post_toilet_info","put_toilet_info"]

    
def http_put_data(data):
    while True:
        Data = {
            'ToiletId' : 2,
            'Count' : data,
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
    
