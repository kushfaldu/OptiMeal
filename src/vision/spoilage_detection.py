import cv2
import numpy as np
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import json
from datetime import datetime
import os

class SpoilageDetector:
    def __init__(self, model_path=None, device=None):
        """
        Initialize the spoilage detection system
        
        Args:
            model_path (str): Path to the pre-trained model weights
            device (str): Device to run the model on ('cuda' or 'cpu')
        """
        self.device = device if device else ('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Initialize model
        self.model = self._create_model()
        if model_path and os.path.exists(model_path):
            self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.to(self.device)
        self.model.eval()
        
        # Define image transformations
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        
    def _create_model(self):
        """Create and modify ResNet model for spoilage detection"""
        model = models.resnet50(pretrained=True)
        
        # Modify the final layer for binary classification (spoiled vs. fresh)
        num_features = model.fc.in_features
        model.fc = nn.Sequential(
            nn.Linear(num_features, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, 2),  # 2 classes: fresh and spoiled
            nn.Softmax(dim=1)
        )
        
        return model
    
    def process_image(self, image_path):
        """
        Process a single image for spoilage detection
        
        Args:
            image_path (str): Path to the image file
            
        Returns:
            dict: Detection results including spoilage probability and confidence
        """
        try:
            # Load and preprocess image
            image = Image.open(image_path).convert('RGB')
            image_tensor = self.transform(image).unsqueeze(0).to(self.device)
            
            # Run inference
            with torch.no_grad():
                output = self.model(image_tensor)
            
            # Get probabilities
            probabilities = output[0].cpu().numpy()
            
            return {
                'fresh_probability': float(probabilities[0]),
                'spoiled_probability': float(probabilities[1]),
                'is_spoiled': bool(probabilities[1] > probabilities[0]),
                'confidence': float(max(probabilities))
            }
            
        except Exception as e:
            print(f"Error processing image: {e}")
            return None
    
    def analyze_batch(self, image_dir, output_path='spoilage_report.json'):
        """
        Analyze a batch of images and generate a report
        
        Args:
            image_dir (str): Directory containing images to analyze
            output_path (str): Path to save the analysis report
        """
        results = []
        
        for filename in os.listdir(image_dir):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                image_path = os.path.join(image_dir, filename)
                detection = self.process_image(image_path)
                
                if detection:
                    results.append({
                        'filename': filename,
                        'timestamp': datetime.now().isoformat(),
                        'detection': detection
                    })
        
        # Generate report
        report = {
            'analysis_date': datetime.now().isoformat(),
            'total_images': len(results),
            'spoiled_items': sum(1 for r in results if r['detection']['is_spoiled']),
            'results': results
        }
        
        # Save report
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=4)
            
        return report
    
    def process_video_frame(self, frame):
        """
        Process a video frame for spoilage detection
        
        Args:
            frame (numpy.ndarray): Video frame to process
            
        Returns:
            dict: Detection results
        """
        # Convert frame to PIL Image
        frame_pil = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        
        # Preprocess frame
        frame_tensor = self.transform(frame_pil).unsqueeze(0).to(self.device)
        
        # Run inference
        with torch.no_grad():
            output = self.model(frame_tensor)
        
        # Get probabilities
        probabilities = output[0].cpu().numpy()
        
        return {
            'fresh_probability': float(probabilities[0]),
            'spoiled_probability': float(probabilities[1]),
            'is_spoiled': bool(probabilities[1] > probabilities[0]),
            'confidence': float(max(probabilities))
        }
    
    def monitor_video_feed(self, video_source=0, display=True):
        """
        Monitor video feed for spoilage detection
        
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
                
                # Process frame
                results = self.process_video_frame(frame)
                
                if display:
                    # Draw results on frame
                    text = f"Spoiled: {results['is_spoiled']}"
                    confidence = f"Conf: {results['confidence']:.2f}"
                    
                    cv2.putText(frame, text, (10, 30),
                              cv2.FONT_HERSHEY_SIMPLEX, 1,
                              (0, 0, 255) if results['is_spoiled'] else (0, 255, 0),
                              2)
                    cv2.putText(frame, confidence, (10, 60),
                              cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                    
                    cv2.imshow('Spoilage Detection', frame)
                    
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break
                        
        finally:
            cap.release()
            if display:
                cv2.destroyAllWindows()

def main():
    # Initialize detector
    detector = SpoilageDetector()
    
    try:
        # Example: Process single image
        result = detector.process_image('sample_food.jpg')
        print(f"Single image result: {result}")
        
        # Example: Analyze batch of images
        report = detector.analyze_batch('food_images/')
        print(f"Batch analysis complete. Found {report['spoiled_items']} spoiled items")
        
        # Example: Monitor video feed
        detector.monitor_video_feed(display=True)
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main() 