from picamera2 import Picamera2
import cv2
from person_counter import YOLODetector, FeatureExtractor, AppearanceTracker, LineCounter
import Send_Data

def Data_put(data):
        Send_Data.http_put_data(data)

def main():
 
    picam2 = Picamera2()
    picam2.preview_configuration.main.size = (1280, 720)
    picam2.preview_configuration.main.format = "RGB888"
    picam2.configure("preview")
    picam2.start()
   
    detector = YOLODetector()
    extractor = FeatureExtractor()
    tracker = AppearanceTracker(max_distance=0.5, max_disappeared=15)
    counter = LineCounter(line_x=640)

    print("System initialized. Press 'q' to quit.")

    while True:
        frame = picam2.capture_array()
 
        if frame.shape[2] == 4:
            frame = cv2.cvtColor(frame, cv2.COLOR_RGBA2RGB)

        detections = detector.detect(frame)

        features = []
        for (_, _, bbox) in detections:
            feat = extractor.extract(frame, bbox)
            features.append(feat)

        objects = tracker.update(detections, features)
    
        counter.update(objects)
     
        for object_id, data in objects.items():
            cx, cy = data['centroid']
            cv2.circle(frame, (cx, cy), 5, (255, 255, 0), -1)
            cv2.putText(frame, f"ID {object_id}", (cx + 5, cy - 5),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 1)

        counter.draw(frame)
        count = counter.get_count()
        Data_put(count)
        cv2.imshow("People Counter", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cv2.destroyAllWindows()
    print("Program ended.")

if __name__ == "__main__":
    main()