import cv2
import numpy as np
from ultralytics import YOLO
import torch
from datetime import datetime
import json
import threading
import queue
import time

class StockDetector:
    def __init__(self, model_path='yolov8n.pt', confidence_threshold=0.5):
        """
        Initialize the stock detection system
        
        Args:
            model_path (str): Path to the YOLO model weights
            confidence_threshold (float): Minimum confidence score for detections
        """
        self.model = YOLO(model_path)
        self.confidence_threshold = confidence_threshold
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.frame_queue = queue.Queue(maxsize=10)
        self.result_queue = queue.Queue()
        self.is_running = False
        
    def start_detection(self, camera_ids):
        """
        Start stock detection on multiple camera feeds
        
        Args:
            camera_ids (list): List of camera indices or video sources
        """
        self.is_running = True
        self.cameras = []
        self.threads = []
        
        # Start camera threads
        for cam_id in camera_ids:
            cam_thread = threading.Thread(
                target=self._camera_stream,
                args=(cam_id,)
            )
            cam_thread.daemon = True
            cam_thread.start()
            self.threads.append(cam_thread)
            
        # Start processing thread
        process_thread = threading.Thread(target=self._process_frames)
        process_thread.daemon = True
        process_thread.start()
        self.threads.append(process_thread)
        
    def stop_detection(self):
        """Stop all detection threads"""
        self.is_running = False
        for thread in self.threads:
            thread.join()
            
    def _camera_stream(self, camera_id):
        """
        Capture frames from a camera and add to queue
        
        Args:
            camera_id: Camera index or video source path
        """
        cap = cv2.VideoCapture(camera_id)
        
        try:
            while self.is_running:
                ret, frame = cap.read()
                if not ret:
                    break
                    
                if not self.frame_queue.full():
                    self.frame_queue.put({
                        'camera_id': camera_id,
                        'frame': frame,
                        'timestamp': datetime.now()
                    })
                    
        finally:
            cap.release()
            
    def _process_frames(self):
        """Process frames from the queue and detect stock levels"""
        while self.is_running:
            if not self.frame_queue.empty():
                frame_data = self.frame_queue.get()
                
                # Run inference
                results = self.model(frame_data['frame'])[0]
                
                # Process detections
                detections = {}
                for r in results.boxes.data.tolist():
                    x1, y1, x2, y2, score, class_id = r
                    if score > self.confidence_threshold:
                        class_name = self.model.names[int(class_id)]
                        if class_name not in detections:
                            detections[class_name] = {
                                'count': 1,
                                'confidence': score,
                                'bounding_boxes': [(x1, y1, x2, y2)]
                            }
                        else:
                            detections[class_name]['count'] += 1
                            detections[class_name]['bounding_boxes'].append(
                                (x1, y1, x2, y2)
                            )
                
                # Add result to queue
                self.result_queue.put({
                    'camera_id': frame_data['camera_id'],
                    'timestamp': frame_data['timestamp'],
                    'detections': detections
                })
                
    def estimate_stock_levels(self, shelf_regions=None):
        """
        Estimate stock levels based on detected objects
        
        Args:
            shelf_regions (dict): Dictionary mapping shelf IDs to region coordinates
            
        Returns:
            dict: Estimated stock levels per shelf
        """
        if not self.result_queue.empty():
            result = self.result_queue.get()
            
            if shelf_regions is None:
                # If no shelf regions defined, return overall counts
                return {
                    'timestamp': result['timestamp'],
                    'camera_id': result['camera_id'],
                    'stock_levels': {
                        item: data['count']
                        for item, data in result['detections'].items()
                    }
                }
            
            # Calculate stock levels per shelf
            shelf_stock = {}
            for shelf_id, region in shelf_regions.items():
                rx1, ry1, rx2, ry2 = region
                shelf_stock[shelf_id] = {}
                
                for item, data in result['detections'].items():
                    count = 0
                    for box in data['bounding_boxes']:
                        x1, y1, x2, y2 = box
                        # Check if box center is within shelf region
                        center_x = (x1 + x2) / 2
                        center_y = (y1 + y2) / 2
                        if (rx1 <= center_x <= rx2 and 
                            ry1 <= center_y <= ry2):
                            count += 1
                    
                    if count > 0:
                        shelf_stock[shelf_id][item] = count
            
            return {
                'timestamp': result['timestamp'],
                'camera_id': result['camera_id'],
                'stock_levels': shelf_stock
            }
            
        return None

def main():
    # Initialize detector
    detector = StockDetector()
    
    # Example shelf regions (normalized coordinates)
    shelf_regions = {
        'shelf_1': (0.0, 0.0, 0.5, 0.5),
        'shelf_2': (0.5, 0.0, 1.0, 0.5),
        'shelf_3': (0.0, 0.5, 0.5, 1.0),
        'shelf_4': (0.5, 0.5, 1.0, 1.0)
    }
    
    try:
        # Start detection on multiple cameras
        detector.start_detection([0, 1])  # Camera indices
        
        # Monitor stock levels
        while True:
            stock_levels = detector.estimate_stock_levels(shelf_regions)
            if stock_levels:
                print(f"Stock Levels: {stock_levels}")
            time.sleep(1)  # Check every second
            
    except KeyboardInterrupt:
        detector.stop_detection()
        print("Stock detection stopped")
    
if __name__ == "__main__":
    main() 