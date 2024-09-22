from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_quote', methods=['POST'])
def get_quote():
    data = request.get_json()
    # Mockup calculation of premium
    quote = random.randint(300, 1000)
    return jsonify({"quote": quote})

@app.route('/send_email', methods=['POST'])
def send_email():
    data = request.get_json()
    email = data['email']
    # In reality, this would send an email (use a library like smtplib or flask-mail)
    print(f"Sending email to {email}")
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True)
