from flask import Flask, render_template, request, jsonify
import itertools
from typing import List, Set
import logging
from logging.handlers import RotatingFileHandler
import os

app = Flask(__name__)

# ConfiguraÃ§Ã£o de logs
if not os.path.exists('logs'):
    os.mkdir('logs')
file_handler = RotatingFileHandler('logs/combinacoes.log', maxBytes=10240, backupCount=10)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
))
file_handler.setLevel(logging.INFO)
app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)
app.logger.info('Iniciando aplicação de combinações')

def gerar_combinacoes(numeros: List[int], tamanho: int) -> Set[tuple]:
    """Gera todas as combinações possíveis dos números dados."""
    return set(itertools.permutations(numeros, tamanho))

def formatar_numero(combinacao: tuple) -> str:
    """Formata uma combinação como uma string de dois dígitos."""
    return "".join(map(str, combinacao))

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/calcular", methods=["POST"])
def calcular():
    try:
        dados = request.get_json()
        numeros_str = dados.get("numeros", "")
        tamanho = int(dados.get("tamanho", 0))
        
        app.logger.info(f'Calculando combinações para números: {numeros_str}, tamanho: {tamanho}')
        
        # ValidaÃ§Ã£o dos dados
        if not numeros_str or tamanho < 1:
            app.logger.warning('Dados inválidos recebidos')
            return jsonify({"erro": "Dados inválidos"}), 400
        
        # Processamento dos números
        numeros = [int(n.strip()) for n in numeros_str.split(",")]
        
        # cálculo das combinações
        combinacoes = gerar_combinacoes(numeros, tamanho)
        combinacoes_formatadas = [formatar_numero(c) for c in combinacoes]
        combinacoes_formatadas.sort()
        
        app.logger.info(f'Geradas {len(combinacoes)} combinações')
        
        return jsonify({
            "total": len(combinacoes),
            "combinacoes": combinacoes_formatadas
        })
        
    except ValueError as e:
        app.logger.error(f'Erro nos dados de entrada: {str(e)}')
        return jsonify({"erro": f"Erro nos dados de entrada: {str(e)}"}), 400
    except Exception as e:
        app.logger.error(f'Erro inesperado: {str(e)}')
        return jsonify({"erro": f"Erro inesperado: {str(e)}"}), 500


"""
if __name__ == "__main__":
    app.run(debug=True)
"""

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)