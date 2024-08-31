from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    number = request.json.get('number')
    if number.isdigit():
        square = int(number) ** 2
        return jsonify({'result': square})
    return jsonify({'error': 'Invalid input'}), 400

if __name__ == '__main__':
    app.run(debug=True)
