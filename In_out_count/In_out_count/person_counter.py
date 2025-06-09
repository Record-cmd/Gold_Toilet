import cv2
import numpy as np
from ultralytics import YOLO
from collections import OrderedDict
import math
from scipy.spatial import distance as dist


class YOLODetector:
    def __init__(self, model_path='yolov8n.pt'):
        self.model = YOLO(model_path)

    def detect(self, frame):
        input_frame = cv2.resize(frame, (320, 240))
        results = self.model(input_frame, verbose=False)[0]
        detections = []
        h_ratio = frame.shape[0] / 240
        w_ratio = frame.shape[1] / 320

        for result in results.boxes.data:
            x1, y1, x2, y2, score, cls = result
            if int(cls) == 0:  # person
                x1, y1, x2, y2 = int(x1 * w_ratio), int(y1 * h_ratio), int(x2 * w_ratio), int(y2 * h_ratio)
                cx = int((x1 + x2) / 2)
                cy = int((y1 + y2) / 2)
                detections.append((cx, cy, (x1, y1, x2, y2)))
        return detections


class FeatureExtractor:
    def extract(self, image, bbox):
        x1, y1, x2, y2 = bbox
        cropped = image[y1:y2, x1:x2]
        if cropped.size == 0:
            return np.zeros(512)
        hsv = cv2.cvtColor(cropped, cv2.COLOR_BGR2HSV)
        hist = cv2.calcHist([hsv], [0, 1, 2], None, (8, 8, 8),
                            [0, 180, 0, 256, 0, 256])
        cv2.normalize(hist, hist)
        return hist.flatten()


class AppearanceTracker:
    def __init__(self, max_distance=0.5, max_disappeared=15):
        self.next_id = 0
        self.objects = OrderedDict()
        self.disappeared = OrderedDict()
        self.max_distance = max_distance
        self.max_disappeared = max_disappeared

    def register(self, centroid, feature):
        self.objects[self.next_id] = {'centroid': centroid, 'feature': feature}
        self.disappeared[self.next_id] = 0
        self.next_id += 1

    def deregister(self, object_id):
        del self.objects[object_id]
        del self.disappeared[object_id]

    def update(self, detections, features):
        if len(detections) == 0:
            for obj_id in list(self.disappeared.keys()):
                self.disappeared[obj_id] += 1
                if self.disappeared[obj_id] > self.max_disappeared:
                    self.deregister(obj_id)
            return self.objects

        input_centroids = [det[:2] for det in detections]
        input_features = features

        if len(self.objects) == 0:
            for (centroid, feat) in zip(input_centroids, input_features):
                self.register(centroid, feat)
        else:
            object_ids = list(self.objects.keys())
            object_features = [self.objects[obj_id]['feature'] for obj_id in object_ids]

            D = dist.cdist(object_features, input_features, metric="cosine")
            rows = D.min(axis=1).argsort()
            cols = D.argmin(axis=1)[rows]

            used_rows, used_cols = set(), set()
            for (row, col) in zip(rows, cols):
                if row in used_rows or col in used_cols:
                    continue
                if D[row, col] > self.max_distance:
                    continue
                object_id = object_ids[row]
                self.objects[object_id] = {
                    'centroid': input_centroids[col],
                    'feature': input_features[col]
                }
                self.disappeared[object_id] = 0
                used_rows.add(row)
                used_cols.add(col)

            unused_rows = set(range(len(object_ids))) - used_rows
            for row in unused_rows:
                obj_id = object_ids[row]
                self.disappeared[obj_id] += 1
                if self.disappeared[obj_id] > self.max_disappeared:
                    self.deregister(obj_id)

            unused_cols = set(range(len(input_centroids))) - used_cols
            for col in unused_cols:
                self.register(input_centroids[col], input_features[col])

        return self.objects


class LineCounter:
    def __init__(self, line_x=320):
        self.line_x = line_x
        self.count_in = 0
        self.count_out = 0
        self.count = 0
        self.tracked = {}

    def update(self, objects):
        for object_id, data in objects.items():
            cx, cy = data['centroid']
            prev_cx = self.tracked.get(object_id, None)
            if prev_cx is not None:
                if prev_cx < self.line_x <= cx:
                    self.count_in += 1
                    self.count +=1
                    print(f"ID {object_id} crossed line In")
                elif prev_cx > self.line_x >= cx:
                    self.count_out += 1
                    self.count -=1
                    print(f"ID {object_id} crossed line Out")
            self.tracked[object_id] = cx

    def draw(self, frame):
        h, w = frame.shape[:2]
        cv2.line(frame, (self.line_x, 0), (self.line_x, h), (0, 255, 255), 2)
        cv2.putText(frame, f"In: {self.count_in}", (10, 30),cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.putText(frame, f"Out: {self.count_out}", (10, 70),cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        cv2.putText(frame, f"count: {self.count}", (10, 110),cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    def get_count(self):
        return self.count