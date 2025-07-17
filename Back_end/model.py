import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import warnings
warnings.filterwarnings('ignore')

# Load the dataset
df = pd.read_csv('airline_delay.csv')

# Display basic information about the dataset
print("Dataset Shape:", df.shape)
print("\nColumn Names:")
print(df.columns.tolist())
print("\nFirst few rows:")
print(df.head())

# Check for missing values and data types
print("Missing Values:")
print(df.isnull().sum())
print("\nData Types:")
print(df.dtypes)
print("\nBasic Statistics:")
print(df.describe())

# Create target variable - total arrival delay
df['total_delay'] = df['arr_delay'].fillna(0)

# Create additional features
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

print("Feature engineering completed!")
print("New features created:")
print("- delay_per_flight")
print("- delay_rate")
print("- cancellation_rate")
print("- diversion_rate")
print("- is_major_carrier")
print("- is_hub_airport")

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

print(f"Training set size: {X_train.shape}")
print(f"Test set size: {X_test.shape}")
print(f"Features used: {len(feature_columns)}")

# Initialize models
models = {
    'Linear Regression': LinearRegression(),
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
    'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42)
}

# Train and evaluate models
results = {}
for name, model in models.items():
    print(f"\nTraining {name}...")

    # Train the model
    model.fit(X_train, y_train)

    # Make predictions
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)

    # Calculate metrics
    train_mse = mean_squared_error(y_train, y_pred_train)
    test_mse = mean_squared_error(y_test, y_pred_test)
    train_r2 = r2_score(y_train, y_pred_train)
    test_r2 = r2_score(y_test, y_pred_test)
    test_mae = mean_absolute_error(y_test, y_pred_test)

    results[name] = {
        'Train MSE': train_mse,
        'Test MSE': test_mse,
        'Train R²': train_r2,
        'Test R²': test_r2,
        'Test MAE': test_mae,
        'Model': model
    }

    print(f"Train R²: {train_r2:.4f}")
    print(f"Test R²: {test_r2:.4f}")
    print(f"Test MAE: {test_mae:.2f}")

# Create performance comparison table
performance_df = pd.DataFrame({
    'Model': list(results.keys()),
    'Train R²': [results[model]['Train R²'] for model in results.keys()],
    'Test R²': [results[model]['Test R²'] for model in results.keys()],
    'Test MAE': [results[model]['Test MAE'] for model in results.keys()],
    'Test RMSE': [np.sqrt(results[model]['Test MSE']) for model in results.keys()]
})

print("Model Performance Comparison:")
print(performance_df.round(4))

# Find best model
best_model_name = performance_df.loc[performance_df['Test R²'].idxmax(), 'Model']
best_model = results[best_model_name]['Model']

print(f"\nBest performing model: {best_model_name}")
print(f"Test R²: {results[best_model_name]['Test R²']:.4f}")
print(f"Test MAE: {results[best_model_name]['Test MAE']:.2f} minutes")

# Analyze feature importance for the best model
if hasattr(best_model, 'feature_importances_'):
    feature_importance = pd.DataFrame({
        'Feature': feature_columns,
        'Importance': best_model.feature_importances_
    }).sort_values('Importance', ascending=False)

    print(f"\nTop 10 Most Important Features ({best_model_name}):")
    print(feature_importance.head(10))

    # Plot feature importance
    plt.figure(figsize=(10, 6))
    sns.barplot(data=feature_importance.head(10), x='Importance', y='Feature')
    plt.title(f'Top 10 Feature Importance - {best_model_name}')
    plt.xlabel('Importance Score')
    plt.tight_layout()
    plt.show()

# Create prediction function
def predict_delay(model, carrier, airport, month, arr_flights, weather_conditions='normal'):
    """
    Predict flight delay for given parameters
    """
    # Create input data
    input_data = pd.DataFrame({
        'year': [2020],
        'month': [month],
        'arr_flights': [arr_flights],
        'arr_del15': [arr_flights * 0.15],
        'carrier_ct': [arr_flights * 0.1],
        'weather_ct': [arr_flights * 0.05 if weather_conditions == 'bad' else arr_flights * 0.01],
        'nas_ct': [arr_flights * 0.08],
        'security_ct': [0],
        'late_aircraft_ct': [arr_flights * 0.12],
        'arr_cancelled': [arr_flights * 0.02],
        'arr_diverted': [arr_flights * 0.01],
        'delay_rate': [0.15],
        'cancellation_rate': [0.02],
        'diversion_rate': [0.01],
        'is_major_carrier': [carrier in ['AA', 'DL', 'UA', 'WN', 'AS']],
        'is_hub_airport': [airport in ['ATL', 'LAX', 'ORD', 'DFW', 'DEN', 'JFK', 'SFO']],
        'carrier_encoded': [0],
        'airport_encoded': [0]
    })

    # Encode carrier and airport if they exist in the training data
    try:
        if carrier in le_carrier.classes_:
            input_data['carrier_encoded'] = le_carrier.transform([carrier])
        if airport in le_airport.classes_:
            input_data['airport_encoded'] = le_airport.transform([airport])
    except:
        pass

    prediction = model.predict(input_data[feature_columns])
    return prediction[0]

# Example predictions
print("\nExample Predictions:")
print("=" * 50)

examples = [
    ('AA', 'DFW', 12, 500, 'normal'),
    ('DL', 'ATL', 12, 800, 'bad'),
    ('WN', 'LAX', 6, 300, 'normal'),
    ('UA', 'ORD', 1, 400, 'bad')
]

for carrier, airport, month, flights, weather in examples:
    predicted_delay = predict_delay(best_model, carrier, airport, month, flights, weather)
    print(f"Carrier: {carrier}, Airport: {airport}, Month: {month}")
    print(f"Flights: {flights}, Weather: {weather}")
    print(f"Predicted Total Delay: {predicted_delay:.0f} minutes")
    print(f"Average Delay per Flight: {predicted_delay/flights:.1f} minutes")
    print("-" * 30)
