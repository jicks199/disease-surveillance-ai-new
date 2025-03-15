from flask import Flask, render_template
from flask_socketio import SocketIO
import time

app = Flask(__name__)
# Configure CORS to allow the React frontend origin
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")

# Default disease data
default_data = [
    {"disease": "Influenza", "location": "Gandhinagar", "cases": 500, "threshold": 300},
    {"disease": "Malaria", "location": "Ahmedabad", "cases": 150, "threshold": 200},
    {"disease": "COVID-19", "location": "surat", "cases": 800, "threshold": 500}
]

# Function to check for alerts
def check_alerts(data):
    for entry in data:
        if entry["cases"] > entry["threshold"]:
            message = f"Warning: High risk of {entry['disease']} in {entry['location']}!"
            socketio.emit("alert", {"message": message})
            time.sleep(2)  # Delay between alerts for readability

# Route to serve the frontend (optional, only if you still need it)
@app.route("/")
def index():
    return render_template("index.html")

# Simulate continuous monitoring
def monitor_data():
    while True:
        check_alerts(default_data)
        time.sleep(10)  # Check every 10 seconds

if __name__ == "__main__":
    socketio.start_background_task(monitor_data)  # Run monitoring in background
    socketio.run(app, debug=True, host="0.0.0.0", port=5000)