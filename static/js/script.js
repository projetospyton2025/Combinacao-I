﻿// Função para calcular o número total de combinações possíveis
function calcularTotalCombinacoesPossiveis(n, r) {
  // Função para calcular fatorial (limita a números menores para evitar overflow)
  function fatorial(num) {
    if (num <= 1) return 1;
    let resultado = 1;
    for (let i = 2; i <= num; i++) {
      resultado *= i;
    }
    return resultado;
  }
  
  // Para números grandes, usamos uma abordagem mais eficiente
  function calcularCombinacaoGrande(n, r) {
    let resultado = 1;
    // Calcular n! / (n-r)! diretamente
    for (let i = n - r + 1; i <= n; i++) {
      resultado *= i;
    }
    // Dividir por r!
    resultado /= fatorial(r);
    return Math.floor(resultado);
  }
  
  if (n < r) return 0;
  
  // Usar método apropriado baseado no tamanho dos números
  if (n > 20) {
    return calcularCombinacaoGrande(n, r);
  } else {
    return Math.floor(fatorial(n) / (fatorial(r) * fatorial(n - r)));
  }
}

// Função auxiliar para extrair números da lista de combinações formatadas
function extrairNumerosUnicos(combinacoes) {
  const numerosUnicos = new Set();
  
  for (const combinacao of combinacoes) {
    // Tentar extrair números de 2 dígitos da combinação
    let i = 0;
    while (i < combinacao.length) {
      if (i + 1 < combinacao.length) {
        try {
          const numStr = combinacao.substring(i, i+2);
          const numero = parseInt(numStr);
          if (numero >= 1 && numero <= 60) {
            numerosUnicos.add(numero);
          }
        } catch (e) {}
      }
      i += 2;
    }
  }
  
  return [...numerosUnicos];
}

// Função para calcular combinações
async function calcularCombinacoes(event) {
    event.preventDefault();
    
    const numeros = document.getElementById("numeros").value;
    const tamanho = document.getElementById("tamanho").value;
    
    try {
        const response = await fetch("/calcular", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ numeros, tamanho })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Exibe o total
            document.getElementById("totalCombinacoes").style.display = "block";
            document.getElementById("total").textContent = data.total;
            
            // Exibe as combinações
            const combinacoesDiv = document.getElementById("combinacoes");
            combinacoesDiv.innerHTML = data.combinacoes.join(" ");
            document.getElementById("resultadoCard").style.display = "block";
            
            // Armazenar as combinações para uso posterior
            window.combinacoesGeradas = data.combinacoes;
            
            // Verificar se deve mostrar os controles de palpites
            const digitosInput = document.getElementById("numeros").value;
            const digitos = digitosInput.split(",").map(d => d.trim()).filter(d => d);
            const quantidadeDigitos = digitos.length;
            
            // Mostrar controles apenas se tivermos 4 ou mais dígitos
            const palpitesControle = document.getElementById("palpitesControle");
            if (quantidadeDigitos >= 4 && data.total >= 12) {
                palpitesControle.style.display = "block";
                
                // Calcular o total teórico de palpites possíveis
                // Primeiro extrair os números únicos das combinações geradas
                const numerosUnicosArray = extrairNumerosUnicos(data.combinacoes);
                console.log("Números únicos extraídos:", numerosUnicosArray);
                
                const totalTeorico = calcularTotalCombinacoesPossiveis(numerosUnicosArray.length, 6);
                console.log("Total teórico calculado:", totalTeorico);
                
                // Mostrar o total teórico na interface
                document.getElementById("totalTeorico").textContent = totalTeorico;
                
                // Ajustar o range para o total teórico (com limite prático de 1000 para não travar a interface)
                const limiteMaximo = Math.min(1000, Math.max(1, totalTeorico));
                const rangeInput = document.getElementById("quantidadePalpites");
                rangeInput.max = limiteMaximo;
                rangeInput.value = Math.min(10, limiteMaximo);
                document.getElementById("valorQuantidadePalpites").textContent = rangeInput.value;
                
                // Atualizar o texto do máximo
                document.getElementById("valorMaximo").textContent = limiteMaximo;
            } else {
                palpitesControle.style.display = "none";
                // Esconder o container de palpites caso esteja visível
                document.getElementById("palpitesCard").style.display = "none";
            }
        } else {
            alert(data.erro || "Erro ao calcular combinações");
        }
    } catch (error) {
        alert("Erro ao comunicar com o servidor");
        console.error(error);
    }
}

async function gerarPalpitesMegaSena() {
    // Verificar se temos combinações geradas
    if (!window.combinacoesGeradas || window.combinacoesGeradas.length === 0) {
        alert("Por favor, gere as combinações primeiro.");
        return;
    }
    
    // Obter a quantidade desejada de palpites
    const quantidadePalpites = parseInt(document.getElementById("quantidadePalpites").value);
    
    // Mostrar um indicador de carregamento para grandes quantidades
    if (quantidadePalpites > 50) {
        document.getElementById("palpitesCard").style.display = "block";
        document.getElementById("palpites").innerHTML = 
            `<div class="alert alert-info">
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                Gerando ${quantidadePalpites} palpites. Isso pode levar alguns segundos...
            </div>`;
    }
    
    try {
        const response = await fetch("/gerar_palpites", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                combinacoes: window.combinacoesGeradas,
                quantidade: quantidadePalpites
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Exibe o total de palpites
            document.getElementById("totalPalpites").textContent = data.total;
            
            // Exibe os palpites
            const palpitesDiv = document.getElementById("palpites");
            palpitesDiv.innerHTML = "";
            
            // Criando tabela de palpites
            const table = document.createElement("table");
            table.className = "table table-striped";
            
            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");
            
            // Cabeçalho numerado de 1 a 6
            for (let i = 1; i <= 6; i++) {
                const th = document.createElement("th");
                th.textContent = `Nº ${i}`;
                headerRow.appendChild(th);
            }
            
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            const tbody = document.createElement("tbody");
            
            // Adicionar cada palpite como uma linha
            data.palpites.forEach((palpite, index) => {
                const row = document.createElement("tr");
                
                // Cada número do palpite em uma célula
                palpite.forEach(numero => {
                    const cell = document.createElement("td");
                    cell.textContent = numero;
                    row.appendChild(cell);
                });
                
                tbody.appendChild(row);
            });
            
            table.appendChild(tbody);
            palpitesDiv.appendChild(table);
            
            // Exibe o card de palpites
            document.getElementById("palpitesCard").style.display = "block";
        } else {
            alert(data.erro || "Erro ao gerar palpites");
        }
    } catch (error) {
        alert("Erro ao comunicar com o servidor");
        console.error(error);
    }
}

// Adicione este event listener para atualizar o valor exibido do slider
document.addEventListener("DOMContentLoaded", function() {
    const rangeInput = document.getElementById("quantidadePalpites");
    const valorSpan = document.getElementById("valorQuantidadePalpites");
    
    if (rangeInput && valorSpan) {
        rangeInput.addEventListener("input", function() {
            valorSpan.textContent = this.value;
        });
    }
});

// Funções para o modal da tabela completa
function formatarNumero(numero) {
  return numero.toLocaleString('pt-BR');
}

function abrirModal() {
  const modal = document.getElementById('modalTabelaCompleta');
  const tbody = document.getElementById('tabelaCompletaBody');
  
  // Limpar conteúdo anterior
  tbody.innerHTML = '';
  
  // Preencher com dados de 2 a 60
  for (let digitos = 2; digitos <= 60; digitos++) {
    // Calcular agrupamentos de 2
    const agrupamentos = digitos * (digitos - 1);
    
    // Calcular palpites para Mega Sena
    let palpites;
    if (digitos < 6) {
      // Valores especiais para menos de 6 dígitos
      palpites = digitos === 2 ? "-" : digitos === 3 ? "1" : digitos === 4 ? "2" : "3";
    } else {
      // Para 6 ou mais dígitos, usamos C(n,6)
      const valor = calcularTotalCombinacoesPossiveis(digitos, 6);
      palpites = valor > 999 ? formatarNumero(valor) : valor;
    }
    
    // Criar a linha da tabela
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${digitos}</td>
      <td>${formatarNumero(agrupamentos)}</td>
      <td>${palpites}</td>
    `;
    
    tbody.appendChild(tr);
  }
  
  // Exibir o modal
  modal.style.display = 'block';
}

function fecharModal() {
  document.getElementById('modalTabelaCompleta').style.display = 'none';
}

// Fechar o modal quando o usuário clicar fora dele
window.onclick = function(event) {
  const modal = document.getElementById('modalTabelaCompleta');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}

// Fechar o modal quando pressionar ESC
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    document.getElementById('modalTabelaCompleta').style.display = 'none';
  }
});

// Certifique-se de que esta variável global é inicializada
window.combinacoesGeradas = [];