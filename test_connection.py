import requests

def test_server():
    try:
        # Teste da aplicação Flask
        response = requests.get("http://localhost:10000/")
        print(f"Flask server: {'OK' if response.status_code == 200 else 'FALHA'}")
    except Exception as e:
        print(f"Erro no Flask server: {e}")
    
    try:
        # Teste do servidor Socket.IO
        response = requests.get("http://localhost:10001/")
        print(f"Socket.IO server: {'OK' if response.status_code == 200 else 'FALHA'}")
    except Exception as e:
        print(f"Erro no Socket.IO server: {e}")

if __name__ == "__main__":
    test_server()