import cv2
import numpy as np
from ultralytics import YOLO
import torch
from datetime import datetime
import json

class InventoryTracker:
    def __init__(self, model_path='yolov8n.pt', confidence_threshold=0.5):
        """
        Initialize the inventory tracking system
        
        Args:
            model_path (str): Path to the YOLO model weights
            confidence_threshold (float): Minimum confidence score for detections
        """
        self.model = YOLO(model_path)
        self.confidence_threshold = confidence_threshold
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        
    def process_image(self, image_path):
        """
        Process an image to identify ingredients
        
        Args:
            image_path (str): Path to the image file
            
        Returns:
            dict: Detected ingredients with their counts and confidence scores
        """
        # Read image
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not read image at {image_path}")
            
        # Run inference
        results = self.model(image)[0]
        
        # Process detections
        detections = {}
        for r in results.boxes.data.tolist():
            x1, y1, x2, y2, score, class_id = r
            if score > self.confidence_threshold:
                class_name = self.model.names[int(class_id)]
                if class_name not in detections:
                    detections[class_name] = {
                        'count': 1,
                        'confidence': score
                    }
                else:
                    detections[class_name]['count'] += 1
                    detections[class_name]['confidence'] = max(
                        detections[class_name]['confidence'], 
                        score
                    )
        
        return detections
    
    def log_inventory(self, detections, output_path='inventory_log.json'):
        """
        Log detected inventory to a JSON file
        
        Args:
            detections (dict): Dictionary of detected ingredients
            output_path (str): Path to save the log file
        """
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'detections': detections
        }
        
        try:
            with open(output_path, 'r') as f:
                log = json.load(f)
        except FileNotFoundError:
            log = []
            
        log.append(log_entry)
        
        with open(output_path, 'w') as f:
            json.dump(log, f, indent=4)
    
    def process_video_feed(self, video_source=0, display=True):
        """
        Process live video feed for real-time inventory tracking
        
        Args:
            video_source: Camera index or video file path
            display (bool): Whether to display the processed feed
        """
        cap = cv2.VideoCapture(video_source)
        
        try:
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Run inference
                results = self.model(frame)[0]
                
                if display:
                    # Draw detections
                    annotated_frame = results.plot()
                    cv2.imshow('Inventory Tracking', annotated_frame)
                    
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break
                        
        finally:
            cap.release()
            if display:
                cv2.destroyAllWindows()

def main():
    # Initialize tracker
    tracker = InventoryTracker()
    
    # Example usage
    try:
        # Process single image
        detections = tracker.process_image('sample_image.jpg')
        tracker.log_inventory(detections)
        
        # Process video feed
        tracker.process_video_feed(display=True)
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main() 