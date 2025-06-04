import time
import board#DHT22 lib1
import adafruit_dht #DHT22 lib2
import Send_Data
from flask import Flask, request , jsonify
from time import sleep
import sys #safe Exit
from hx711 import HX711 #hx711
from flask_cors import CORS

from gpiozero import MotionSensor #PIR
import threading
#from signal import pause


dhtDevice = adafruit_dht.DHT22(board.D4) #DHT22 Object
pir = MotionSensor(27)
state = False
hx = HX711(20,16)
Post = False
app = Flask(__name__)
CORS(app)
Control_State_Admin = False

@app.route('/')
def TestConnect():
    return "conntect Flask"

@app.route('/state')
def Control_State():
    global Control_State_Admin
    Control_State_Admin =not Control_State_Admin
    print(Control_State_Admin)
    return jsonify({"Control_State_Admin": Control_State_Admin})


def cleanAndExit(): #^C Exit
    print("Cleaning...")
        
    print("Bye!")
    sys.exit()

def Detect():
    global state, Control_State_Admin    
    print(f'Control_State_Admin : {Control_State_Admin}')
    print("Motion Detected!")
    if(not Control_State_Admin):
        state = True

def NoDetect():
    global state, Control_State_Admin
    print(f'Control_State_Admin : {Control_State_Admin}')
    print("No motion")
    if(not Control_State_Admin):
        state = False

def Data_post(temperature_c, humidity, state, weight):
    global Post, Control_State_Admin
    data = [temperature_c,humidity,state, weight]
    if(not Post):
        Send_Data.http_post_data(data)
        Post = True
    elif(Post and not Control_State_Admin):
        Send_Data.http_put_data(data)
    elif(Post and Control_State_Admin):
        Send_Data.http_put_data2(data)
        
        
sleep(5)
print("PIR START")

pir.when_motion = Detect
pir.when_no_motion = NoDetect




def main():
    hx.set_reading_format("MSB", "MSB")
    referenceUnit = 3120 #ladcell weight
    hx.set_reference_unit(referenceUnit)
    hx.reset()
    hx.tare()

    while True:
        try:
            weight = hx.get_weight(5)

            hx.power_down()
            hx.power_up()
            time.sleep(0.1)
            

            
            temperature_c = dhtDevice.temperature
            #temperature_f = temperature_c * (9 / 5) + 32
            humidity = dhtDevice.humidity
            
            print(f"{temperature_c:.1f} C   humidity: {humidity}%   state: {state}  Weight: {weight} ")#float float bool
            #print(f"temperature_c: {type(temperature_c)}, humidity: {type(humidity)}, state: {type(state)}")
            print(weight)
            print("PIR Detected:", pir.motion_detected)
            Data_post(temperature_c,humidity,state, weight)
            time.sleep(1.0)
        except (KeyboardInterrupt, SystemExit):
            cleanAndExit()
            
        except RuntimeError as error:
            # Errors happen fairly often, DHT's are hard to read, just keep going state: {state}
            print("Runtime Error")
            print(error.args[0])
            time.sleep(2.0)
            continue
        except Exception as error:
            dhtDevice.exit()
            raise error
    
    
if __name__ == '__main__':
    t1 = threading.Thread(target=main)
    t1.start()

    app.run('0.0.0.0', port=5000, debug = False, threaded=True)