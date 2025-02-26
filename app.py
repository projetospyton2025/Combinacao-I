from flask import Flask, render_template, request, jsonify
import itertools
from typing import List, Set
import logging
from logging.handlers import RotatingFileHandler
import os
import random
import time  # Para o caso de uso de sleep no código 2


app = Flask(__name__)

# Configuração de logs
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
        
        # Validação dos dados
        if not numeros_str or tamanho < 1:
            app.logger.warning('Dados inválidos recebidos')
            return jsonify({"erro": "Dados inválidos"}), 400
        
        # Processamento dos números
        numeros = [int(n.strip()) for n in numeros_str.split(",")]
        
        # Cálculo das combinações
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


# Função otimizada de gerar palpites para a Mega Sena
def gerar_palpites_mega_sena(combinacoes_formatadas, total_palpites=10):
    """
    Gera palpites para a Mega Sena a partir das combinações de dois dígitos.
    Cada palpite contém 6 números únicos entre 1 e 60.
    
    Args:
        combinacoes_formatadas: Lista de combinações de dois dígitos já formatadas
        total_palpites: Número de palpites a serem gerados
        
    Returns:
        Uma lista de palpites, onde cada palpite é uma lista de 6 números únicos
    """
    numeros_unicos = set()
    
    # Extrair números das combinações de dois dígitos
    for combinacao in combinacoes_formatadas:
        i = 0
        while i < len(combinacao):
            # Tentar extrair um número de 2 dígitos
            if i + 1 < len(combinacao):
                try:
                    num_str = combinacao[i:i+2]
                    numero = int(num_str)
                    if 1 <= numero <= 60:  # Garantir que está no intervalo da Mega Sena
                        numeros_unicos.add(numero)
                except ValueError:
                    pass
            i += 2  # Avançar para o próximo par de dígitos
    
    # Converter o conjunto para lista para facilitar a manipulação
    numeros_disponiveis = list(numeros_unicos)
    
    # Se não houver números suficientes, complementar com números aleatórios
    if len(numeros_disponiveis) < 6:
        numeros_faltantes = set(range(1, 61)) - set(numeros_disponiveis)
        numeros_complementares = random.sample(list(numeros_faltantes), 6 - len(numeros_disponiveis))
        numeros_disponiveis.extend(numeros_complementares)
    
    # Garantir que temos pelo menos 6 números
    if len(numeros_disponiveis) < 6:
        raise ValueError("Não foi possível extrair números suficientes das combinações")
    
    # Para geração de grandes quantidades, usamos uma abordagem mais eficiente
    if total_palpites > 100:
        return gerar_palpites_grande_quantidade(numeros_disponiveis, total_palpites)
    
    # Para quantidades menores, usamos a abordagem normal
    palpites = []
    tentativas_maximas = total_palpites * 3  # Tentativas extras caso gere duplicatas
    tentativas = 0
    
    while len(palpites) < total_palpites and tentativas < tentativas_maximas:
        tentativas += 1
        
        # Se tivermos muitos números disponíveis, podemos gerar mais variações
        if len(numeros_disponiveis) > 15:
            # Escolher 6 números aleatórios do conjunto disponível
            palpite = sorted(random.sample(numeros_disponiveis, 6))
        else:
            # Para conjuntos menores, podemos precisar de uma abordagem mais criativa
            # Garantir que pelo menos 3 números sejam dos disponíveis
            n_fixos = min(3, len(numeros_disponiveis))
            numeros_fixos = random.sample(numeros_disponiveis, n_fixos)
            
            # Complementar com números aleatórios entre 1-60 que não estejam nos fixos
            numeros_adicionais = []
            while len(numeros_fixos) + len(numeros_adicionais) < 6:
                novo_num = random.randint(1, 60)
                if novo_num not in numeros_fixos and novo_num not in numeros_adicionais:
                    numeros_adicionais.append(novo_num)
            
            # Juntar e ordenar
            palpite = sorted(numeros_fixos + numeros_adicionais)
        
        # Verificar se esse palpite já existe
        palpite_str = ",".join(map(str, palpite))
        palpites_existentes = [",".join(map(str, p)) for p in palpites]
        
        if palpite_str not in palpites_existentes:
            palpites.append(palpite)
    
    # Se não conseguimos gerar palpites suficientes, retornar o que temos
    return palpites

def gerar_palpites_grande_quantidade(numeros_disponiveis, total_palpites):
    """
    Método otimizado para gerar grandes quantidades de palpites.
    Usa um conjunto para verificação rápida de duplicatas.
    """
    palpites_set = set()
    palpites = []
    
    alta_variabilidade = len(numeros_disponiveis) >= 15
    
    max_tentativas = total_palpites * 5
    tentativas = 0
    
    while len(palpites) < total_palpites and tentativas < max_tentativas:
        tentativas += 1
        
        if alta_variabilidade:
            if len(numeros_disponiveis) >= 6:
                palpite = tuple(sorted(random.sample(numeros_disponiveis, 6)))
            else:
                numeros_base = list(numeros_disponiveis)
                complementos_necessarios = 6 - len(numeros_base)
                complementos = []
                
                while len(complementos) < complementos_necessarios:
                    num = random.randint(1, 60)
                    if num not in numeros_base and num not in complementos:
                        complementos.append(num)
                
                palpite = tuple(sorted(numeros_base + complementos))
        else:
            n_disponiveis = min(4, len(numeros_disponiveis))
            
            if n_disponiveis > 0:
                numeros_base = random.sample(numeros_disponiveis, n_disponiveis)
            else:
                numeros_base = []
                
            complementos = []
            while len(numeros_base) + len(complementos) < 6:
                num = random.randint(1, 60)
                if num not in numeros_base and num not in complementos:
                    complementos.append(num)
            
            palpite = tuple(sorted(numeros_base + complementos))
        
        if palpite not in palpites_set:
            palpites_set.add(palpite)
            palpites.append(list(palpite))
            
            # A cada 100 palpites, fazer uma pausa para diminuir a carga na CPU
            if len(palpites) % 100 == 0 and len(palpites) < total_palpites:
                time.sleep(0.01)
    
    return palpites


@app.route("/gerar_palpites", methods=["POST"])
def gerar_palpites():
    try:
        dados = request.get_json()
        combinacoes_formatadas = dados.get("combinacoes", [])
        total_palpites = int(dados.get("quantidade", 10)) # Mudou "total_palpites" para "quantidade"
        
        app.logger.info(f'Gerando {total_palpites} palpites para a Mega Sena.')
        
        # Validação
        if not combinacoes_formatadas or total_palpites <= 0:
            app.logger.warning('Dados de entrada para geração de palpites inválidos')
            return jsonify({"erro": "Dados inválidos"}), 400
        
        palpites = gerar_palpites_mega_sena(combinacoes_formatadas, total_palpites)
        
        app.logger.info(f'Gerados {len(palpites)} palpites')
        
        return jsonify({"total": len(palpites), "palpites": palpites})# Mudou "total_palpites" para "total"
    
    except Exception as e:
        app.logger.error(f'Erro inesperado ao gerar palpites: {str(e)}')
        return jsonify({"erro": f"Erro inesperado: {str(e)}"}), 500


"""
if __name__ == "__main__":
    app.run(debug=True)
"""

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)