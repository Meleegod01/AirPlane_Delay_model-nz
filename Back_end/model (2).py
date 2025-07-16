import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import r2_score, mean_absolute_error
import warnings
warnings.filterwarnings('ignore')

class FlightDelayPredictor:
    def __init__(self, model, feature_columns, label_encoders):
        self.model = model
        self.feature_columns = feature_columns
        self.le_carrier = label_encoders['carrier']
        self.le_airport = label_encoders['airport']
    
    def predict(self, carrier, airport, month, arr_flights,
                weather_severity=1, nas_severity=1, equipment_issues=1):
        """Predict flight delays"""
        
        # Create input features
        input_data = pd.DataFrame({
            'year': [2020],
            'month': [month],
            'arr_flights': [arr_flights],
            'arr_del15': [arr_flights * 0.15 * weather_severity],
            'carrier_ct': [arr_flights * 0.1 * equipment_issues],
            'weather_ct': [arr_flights * 0.02 * weather_severity],
            'nas_ct': [arr_flights * 0.05 * nas_severity],
            'security_ct': [0],
            'late_aircraft_ct': [arr_flights * 0.1 * equipment_issues],
            'arr_cancelled': [arr_flights * 0.02 * weather_severity],
            'arr_diverted': [arr_flights * 0.01],
            'delay_rate': [0.15 * weather_severity],
            'cancellation_rate': [0.02 * weather_severity],
            'diversion_rate': [0.01],
            'is_major_carrier': [carrier in ['AA', 'DL', 'UA', 'WN', 'AS']],
            'is_hub_airport': [airport in ['ATL', 'LAX', 'ORD', 'DFW', 'DEN', 'JFK', 'SFO']],
            'carrier_encoded': [0],
            'airport_encoded': [0]
        })
        
        # Encode categorical variables
        try:
            if carrier in self.le_carrier.classes_:
                input_data['carrier_encoded'] = self.le_carrier.transform([carrier])
            if airport in self.le_airport.classes_:
                input_data['airport_encoded'] = self.le_airport.transform([airport])
        except:
            pass
        
        # Make prediction
        prediction = self.model.predict(input_data[self.feature_columns])
        
        return {
            'total_delay_minutes': max(0, prediction[0]),
            'average_delay_per_flight': max(0, prediction[0] / arr_flights),
            'delay_category': self._categorize_delay(prediction[0] / arr_flights)
        }
    
    def _categorize_delay(self, avg_delay):
        if avg_delay < 5:
            return "Minimal Delay"
        elif avg_delay < 15:
            return "Low Delay"
        elif avg_delay < 30:
            return "Moderate Delay"
        elif avg_delay < 60:
            return "High Delay"
        else:
            return "Severe Delay"

def train_model():
    """Train the flight delay prediction model"""
    
    # Load the dataset
    df = pd.read_csv('airline_delay.csv')
    
    # Create target variable
    df['total_delay'] = df['arr_delay'].fillna(0)
    
    # Feature engineering
    df['delay_per_flight'] = df['total_delay'] / df['arr_flights']
    df['delay_rate'] = df['arr_del15'] / df['arr_flights']
    df['cancellation_rate'] = df['arr_cancelled'] / df['arr_flights']
    df['diversion_rate'] = df['arr_diverted'] / df['arr_flights']
    
    # Create categorical features
    df['is_major_carrier'] = df['carrier'].isin(['AA', 'DL', 'UA', 'WN', 'AS'])
    df['is_hub_airport'] = df['airport'].isin(['ATL', 'LAX', 'ORD', 'DFW', 'DEN', 'JFK', 'SFO'])
    
    # Handle infinite values
    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.fillna(0)
    
    # Select features for modeling
    feature_columns = [
        'year', 'month', 'arr_flights', 'arr_del15', 'carrier_ct', 'weather_ct',
        'nas_ct', 'security_ct', 'late_aircraft_ct', 'arr_cancelled', 'arr_diverted',
        'delay_rate', 'cancellation_rate', 'diversion_rate', 'is_major_carrier', 'is_hub_airport'
    ]
    
    # Encode categorical variables
    le_carrier = LabelEncoder()
    le_airport = LabelEncoder()
    
    df['carrier_encoded'] = le_carrier.fit_transform(df['carrier'])
    df['airport_encoded'] = le_airport.fit_transform(df['airport'])
    
    feature_columns.extend(['carrier_encoded', 'airport_encoded'])
    
    # Prepare features and target
    X = df[feature_columns].copy()
    y = df['total_delay'].copy()
    
    # Remove rows where target is missing
    mask = ~y.isnull()
    X = X[mask]
    y = y[mask]
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train models
    models = {
        'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
        'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
        'Linear Regression': LinearRegression()
    }
    
    results = {}
    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred_test = model.predict(X_test)
        test_r2 = r2_score(y_test, y_pred_test)
        test_mae = mean_absolute_error(y_test, y_pred_test)
        
        results[name] = {
            'r2': test_r2,
            'mae': test_mae,
            'model': model
        }
    
    # Find best model
    best_model_name = max(results.keys(), key=lambda x: results[x]['r2'])
    best_model = results[best_model_name]['model']
    
    # Create predictor
    predictor = FlightDelayPredictor(
        model=best_model,
        feature_columns=feature_columns,
        label_encoders={'carrier': le_carrier, 'airport': le_airport}
    )
    
    # Generate insights
    insights = {
        'best_model': best_model_name,
        'model_performance': {
            'r2': results[best_model_name]['r2'],
            'mae': results[best_model_name]['mae']
        },
        'monthly_delays': df.groupby('month')['delay_per_flight'].mean().to_dict(),
        'carrier_delays': df.groupby('carrier')['delay_per_flight'].mean().to_dict(),
        'airport_delays': df.groupby('airport')['delay_per_flight'].mean().to_dict()
    }
    
    return predictor, insights
