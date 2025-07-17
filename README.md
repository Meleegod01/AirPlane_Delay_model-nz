# ✈️ Flight Delay Prediction Model

> Predict total and average flight arrival delays using real-world airline and airport data. Includes model training, evaluation, feature engineering, and an interactive predictor class for scenario simulation.

---

## 📦 Project Overview

This project builds and evaluates multiple regression models to **predict total flight delays** using a dataset of US flight arrival statistics.

Features:
- 🔍 Exploratory data analysis and preprocessing
- 🛠️ Feature engineering (delay rates, cancellations, major carriers, etc.)
- 🤖 Training and comparing **Linear Regression**, **Random Forest**, and **Gradient Boosting** models
- 📊 Model evaluation using R², MAE, and RMSE
- 🧠 Custom predictor class for simulating delay predictions
- 📈 Visualizations for feature importances

---

## 📁 Dataset

Dataset shape: `(3351, 21)`  
Contains delay data from multiple airlines and airports, including:

| Feature               | Description |
|-----------------------|-------------|
| `year`, `month`       | Time period |
| `carrier`, `airport`  | Airline and Airport codes |
| `arr_flights`         | Number of arriving flights |
| `arr_delay`           | Total arrival delay (in minutes) |
| `arr_del15`           | Flights delayed more than 15 mins |
| `carrier_ct`, `weather_ct`, etc. | Cause-wise delay counts |
| `arr_cancelled`, `arr_diverted` | Cancelled/diverted arrivals |
| `carrier_delay`, `weather_delay`, etc. | Cause-wise delay durations |

**Missing values:** Only 8 rows have missing values across numerical features, handled during preprocessing.

---

## 🧪 Feature Engineering

Additional features added for modeling:

| Feature | Description |
|--------|-------------|
| `delay_per_flight` | Average delay per flight |
| `delay_rate` | Proportion of delayed flights |
| `cancellation_rate` | Proportion of cancelled flights |
| `diversion_rate` | Proportion of diverted flights |
| `is_major_carrier` | Whether the airline is a major carrier |
| `is_hub_airport` | Whether the airport is a major hub |

Categorical columns `carrier` and `airport` are label-encoded.

---

## 🧠 Model Training

Models trained:
1. **Linear Regression**
2. **Random Forest Regressor**
3. **Gradient Boosting Regressor**

### Evaluation Metrics:
- R² Score
- Mean Absolute Error (MAE)
- Root Mean Squared Error (RMSE)

### 📊 Model Performance:

| Model               | Train R² | Test R² | Test MAE | Test RMSE |
|--------------------|----------|---------|----------|-----------|
| Linear Regression  | 0.9547   | 0.9624  | 767.42   | 2078.73   |
| Random Forest      | 0.9907   | 0.9500  | 594.34   | 2395.95   |
| Gradient Boosting  | 0.9963   | 0.9514  | 595.01   | 2361.08   |

✅ **Best Performing Model:** `Linear Regression` (Highest R² on test set)

---

## 🔮 Prediction Functionality

Includes a custom predictor to simulate scenarios with inputs:

```python
predictor.predict(
    carrier='AA',
    airport='DFW',
    month=12,
    arr_flights=500,
    weather_severity=3,
    nas_severity=2,
    equipment_issues=2
)
