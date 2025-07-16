from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import os
from model import train_model, FlightDelayPredictor

app = Flask(__name__)
CORS(app)

# Global variables to store the model and encoders
predictor = None
insights = None

def initialize_model():
    """Initialize the model on startup"""
    global predictor, insights
    
    # Check if model files exist
    model_files = ['model.pkl', 'encoders.pkl', 'insights.pkl']
    files_exist = all(os.path.exists(f) for f in model_files)
    
    if not files_exist:
        print("Training new model...")
        predictor, insights = train_model()
        
        # Save the model and encoders
        with open('model.pkl', 'wb') as f:
            pickle.dump(predictor, f)
        with open('insights.pkl', 'wb') as f:
            pickle.dump(insights, f)
    else:
        print("Loading existing model...")
        with open('model.pkl', 'rb') as f:
            predictor = pickle.load(f)
        with open('insights.pkl', 'rb') as f:
            insights = pickle.load(f)

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict flight delays"""
    try:
        data = request.get_json()
        
        # Extract parameters
        carrier = data.get('carrier')
        airport = data.get('airport')
        month = int(data.get('month'))
        arr_flights = int(data.get('arr_flights'))
        weather_severity = int(data.get('weather_severity', 1))
        nas_severity = int(data.get('nas_severity', 1))
        equipment_issues = int(data.get('equipment_issues', 1))
        
        # Make prediction
        prediction = predictor.predict(
            carrier=carrier,
            airport=airport,
            month=month,
            arr_flights=arr_flights,
            weather_severity=weather_severity,
            nas_severity=nas_severity,
            equipment_issues=equipment_issues
        )
        
        return jsonify({
            'success': True,
            'prediction': prediction
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/insights', methods=['GET'])
def get_insights():
    """Get model insights and statistics"""
    try:
        return jsonify({
            'success': True,
            'insights': insights
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/carriers', methods=['GET'])
def get_carriers():
    """Get available carriers"""
    try:
        carriers = ['AA', 'DL', 'UA', 'WN', 'AS', 'B6', 'NK', 'F9', 'G4', 'YX']
        return jsonify({
            'success': True,
            'carriers': carriers
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/airports', methods=['GET'])
def get_airports():
    """Get available airports"""
    try:
        airports = ['ATL', 'LAX', 'ORD', 'DFW', 'DEN', 'JFK', 'SFO', 'SEA', 'LAS', 'MCO']
        return jsonify({
            'success': True,
            'airports': airports
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    initialize_model()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
