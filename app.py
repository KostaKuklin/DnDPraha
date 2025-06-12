from flask import Flask, jsonify, request, send_from_directory
import json
import os

app = Flask(__name__)
USERS_FILE = 'users.json'
NPCS_FILE = 'npcs.json'
RULES_FILE = 'rules.json'
PARTY_FILE = 'party.json'
SESSION_INFO_FILE = 'session_info.json'

# Helper to load users from JSON
def load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, 'r') as f:
        return json.load(f)

# Helper to save users to JSON
def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=4)

# Generic helper to load data from JSON files
def load_data(filename):
    if not os.path.exists(filename):
        return []
    with open(filename, 'r') as f:
        return json.load(f)

# Generic helper to save data to JSON files
def save_data(filename, data):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)

# Helper to load session info
def load_session_info():
    if not os.path.exists(SESSION_INFO_FILE):
        return {"date": "", "time": ""}
    with open(SESSION_INFO_FILE, 'r') as f:
        return json.load(f)

# Helper to save session info
def save_session_info(data):
    with open(SESSION_INFO_FILE, 'w') as f:
        json.dump(data, f, indent=4)

# Serve static files (HTML, CSS, JS)
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

# API endpoint for user login
@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    users = load_users()
    user = users.get(username)

    if user and user['password'] == password:
        return jsonify({'message': 'Login successful', 'user': {'username': username, 'role': user['role']}}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

# API endpoints for NPC data
@app.route('/api/npcs', methods=['GET', 'POST'])
def handle_npcs():
    if request.method == 'GET':
        npcs = load_data(NPCS_FILE)
        return jsonify(npcs)
    elif request.method == 'POST':
        new_npc = request.json
        npcs = load_data(NPCS_FILE)
        new_npc['id'] = len(npcs) + 1 # Simple ID generation
        npcs.append(new_npc)
        save_data(NPCS_FILE, npcs)
        return jsonify({'message': 'NPC added successfully', 'npc': new_npc}), 201

@app.route('/api/npcs/<int:npc_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_npc(npc_id):
    npcs = load_data(NPCS_FILE)
    npc = next((n for n in npcs if n['id'] == npc_id), None)

    if not npc:
        return jsonify({'message': 'NPC not found'}), 404

    if request.method == 'GET':
        return jsonify(npc)
    elif request.method == 'PUT':
        updated_data = request.json
        npc.update(updated_data)
        save_data(NPCS_FILE, npcs)
        return jsonify({'message': 'NPC updated successfully', 'npc': npc}), 200
    elif request.method == 'DELETE':
        npcs = [n for n in npcs if n['id'] != npc_id]
        save_data(NPCS_FILE, npcs)
        return jsonify({'message': 'NPC deleted successfully'}), 200

# API endpoints for Rules data
@app.route('/api/rules', methods=['GET', 'POST'])
def handle_rules():
    if request.method == 'GET':
        rules = load_data(RULES_FILE)
        return jsonify(rules)
    elif request.method == 'POST':
        new_rule = request.json
        rules = load_data(RULES_FILE)
        # Assign a simple ID for rules, similar to NPCs for consistency
        new_rule['id'] = len(rules) + 1 
        rules.append(new_rule)
        save_data(RULES_FILE, rules)
        return jsonify({'message': 'Rule added successfully', 'rule': new_rule}), 201

@app.route('/api/rules/<int:rule_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_rule(rule_id):
    rules = load_data(RULES_FILE)
    rule = next((r for r in rules if r['id'] == rule_id), None)

    if not rule:
        return jsonify({'message': 'Rule not found'}), 404

    if request.method == 'GET':
        return jsonify(rule)
    elif request.method == 'PUT':
        updated_data = request.json
        rule.update(updated_data)
        save_data(RULES_FILE, rules)
        return jsonify({'message': 'Rule updated successfully', 'rule': rule}), 200
    elif request.method == 'DELETE':
        rules = [r for r in rules if r['id'] != rule_id]
        save_data(RULES_FILE, rules)
        return jsonify({'message': 'Rule deleted successfully'}), 200

# API endpoints for Party data
@app.route('/api/party', methods=['GET', 'POST'])
def handle_party():
    if request.method == 'GET':
        party = load_data(PARTY_FILE)
        return jsonify(party)
    elif request.method == 'POST':
        new_member = request.json
        party = load_data(PARTY_FILE)
        new_member['id'] = len(party) + 1 # Simple ID generation
        party.append(new_member)
        save_data(PARTY_FILE, party)
        return jsonify({'message': 'Party member added successfully', 'member': new_member}), 201

@app.route('/api/party/<int:member_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_party_member(member_id):
    party = load_data(PARTY_FILE)
    member = next((m for m in party if m['id'] == member_id), None)

    if not member:
        return jsonify({'message': 'Party member not found'}), 404

    if request.method == 'GET':
        return jsonify(member)
    elif request.method == 'PUT':
        updated_data = request.json
        member.update(updated_data)
        save_data(PARTY_FILE, party)
        return jsonify({'message': 'Party member updated successfully', 'member': member}), 200
    elif request.method == 'DELETE':
        party = [m for m in party if m['id'] != member_id]
        save_data(PARTY_FILE, party)
        return jsonify({'message': 'Party member deleted successfully'}), 200

# API endpoints for Session Info
@app.route('/api/session_info', methods=['GET', 'PUT'])
def handle_session_info():
    if request.method == 'GET':
        session_info = load_session_info()
        return jsonify(session_info)
    elif request.method == 'PUT':
        updated_data = request.json
        save_session_info(updated_data)
        return jsonify({'message': 'Session info updated successfully', 'session_info': updated_data}), 200

if __name__ == '__main__':
    # Initialize users.json if it doesn't exist with some sample data
    if not os.path.exists(USERS_FILE):
        initial_users = {
            'admin': {'password': 'admin', 'role': 'admin'},
            'user1': {'password': 'userpass', 'role': 'normal user'}
        }
        save_users(initial_users)
        print(f'Created initial {USERS_FILE} with sample users.')

    # Initialize data JSON files if they don't exist
    if not os.path.exists(NPCS_FILE):
        save_data(NPCS_FILE, []) # Empty array for initial NPCs
    if not os.path.exists(RULES_FILE):
        save_data(RULES_FILE, []) # Empty array for initial Rules
    if not os.path.exists(PARTY_FILE):
        save_data(PARTY_FILE, []) # Empty array for initial Party
    if not os.path.exists(SESSION_INFO_FILE):
        save_session_info({"date": "27.06.2025", "time": "18:00"}) # Default session info

    app.run(host='0.0.0.0', port=8000, debug=True) 