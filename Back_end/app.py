from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pickle
from model import train_model, FlightDelayPredictor

app = Flask(__name__)
CORS(app)

predictor = None
insights = None

def initialize_model():
    global predictor, insights
    model_files = ['model.pkl', 'insights.pkl']
    files_exist = all(os.path.exists(f) for f in model_files)

    if not files_exist:
        print("Training new model...")
        predictor, insights = train_model()
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

@app.route('/')
def index():
    return "🎉 Hello from the Flight Delay Predictor API!"

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        prediction = predictor.predict(
            carrier=data['carrier'],
            airport=data['airport'],
            month=int(data['month']),
            arr_flights=int(data['arr_flights']),
            weather_severity=int(data.get('weather_severity', 1)),
            nas_severity=int(data.get('nas_severity', 1)),
            equipment_issues=int(data.get('equipment_issues', 1))
        )
        return jsonify({'success': True, 'prediction': prediction})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/insights', methods=['GET'])
def get_insights():
    try:
        return jsonify({'success': True, 'insights': insights})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/carriers', methods=['GET'])
def get_carriers():
    return jsonify({'success': True, 'carriers': ['AA', 'DL', 'UA', 'WN', 'AS', 'B6', 'NK', 'F9', 'G4', 'YX']})

@app.route('/api/airports', methods=['GET'])
def get_airports():
    return jsonify({'success': True, 'airports': ['ATL', 'LAX', 'ORD', 'DFW', 'DEN', 'JFK', 'SFO', 'SEA', 'LAS', 'MCO']})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    initialize_model()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
