import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
import joblib

# 1. Load dataset
df = pd.read_csv("crop_data.csv")

# 2. Encode categorical variables
le_soil = LabelEncoder()
le_season = LabelEncoder()
le_crop = LabelEncoder()

df["soil_encoded"] = le_soil.fit_transform(df["soil_type"])
df["season_encoded"] = le_season.fit_transform(df["season"])
df["crop_encoded"] = le_crop.fit_transform(df["crop"])

# 3. Features and target
X = df[["soil_encoded", "temperature", "rainfall", "season_encoded"]]
y = df["crop_encoded"]

# 4. Train model
model = DecisionTreeClassifier()
model.fit(X, y)

# 5. Save model and encoders
joblib.dump(model, "crop_model.pkl")
joblib.dump(le_soil, "le_soil.pkl")
joblib.dump(le_season, "le_season.pkl")
joblib.dump(le_crop, "le_crop.pkl")

print("✅ Model and encoders saved successfully.")
