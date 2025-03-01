// scripts.js
// Função para formatar número no padrão brasileiro
function formatarNumeroParaBR(numero) {
    return numero.toLocaleString('pt-BR');
  }


// Inicializar a validação quando o documento estiver carregado
document.addEventListener("DOMContentLoaded", function() {
    validarEntradaDigitos();
    
    // Também adicionar mensagem de instrução inicial
    const inputDigitos = document.getElementById("numeros");
    inputDigitos.setAttribute("placeholder", "ex: 0,1,2,3,4,5,6");
    
    // Exibir a div de erro (inicialmente escondida)
    const errorDiv = document.getElementById("numerosError");
    if (!errorDiv) {
        // Se não existir, criar a div
        const div = document.createElement("div");
        div.id = "numerosError";
        div.className = "error-message";
        inputDigitos.parentNode.insertBefore(div, inputDigitos.nextSibling);
    }
});

// Função para calcular o número total de combinações possíveis
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
// Função atualizada para calcular combinações
// async function calcularCombinacoes(event) {
//     event.preventDefault();
    
//     const numeros = document.getElementById("numeros").value;
//     const tamanho = document.getElementById("tamanho").value;
    
//     try {
//         const response = await fetch("/calcular", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ numeros, tamanho })
//         });
        
//         const data = await response.json();
        
//         if (response.ok) {
//             // Filtrar novamente para garantir que não exibimos números acima de 60
//             const combinacoesFiltradas = data.combinacoes.filter(comb => {
//                 const num = parseInt(comb);
//                 return num > 0 && num <= 60;
//             });
            
//             // Exibe o total após filtragem
//             document.getElementById("totalCombinacoes").style.display = "block";
//             document.getElementById("total").textContent = combinacoesFiltradas.length;
            
//             // Exibe as combinações no formato de tabela para Excel
//             const combinacoesDiv = document.getElementById("combinacoes");
//             combinacoesDiv.innerHTML = "";
            
//             // Usar a função para criar a tabela formatada para Excel
//             const tabela = criarTabelaCombinacoes(combinacoesFiltradas);
//             combinacoesDiv.appendChild(tabela);
            
//             document.getElementById("resultadoCard").style.display = "block";
            
//             // Armazenar as combinações filtradas para uso posterior
//             window.combinacoesGeradas = combinacoesFiltradas;
            
//             // Verificar se deve mostrar os controles de palpites
//             const digitosInput = document.getElementById("numeros").value;
//             const digitos = digitosInput.split(",").map(d => d.trim()).filter(d => d);
//             const quantidadeDigitos = digitos.length;
            
//             // Mostrar controles apenas se tivermos 4 ou mais dígitos
//             const palpitesControle = document.getElementById("palpitesControle");
//             if (quantidadeDigitos >= 4 && combinacoesFiltradas.length >= 12) {
//                 palpitesControle.style.display = "block";
                
//                 // Calcular o total teórico de palpites possíveis
//                 // Primeiro extrair os números únicos das combinações geradas
//                 const numerosUnicosArray = extrairNumerosUnicos(combinacoesFiltradas);
//                 console.log("Números únicos extraídos:", numerosUnicosArray);
                
//                 // Filtrar números maiores que 60 (limite da Mega Sena)
//                 const numerosFiltrados = numerosUnicosArray.filter(n => n <= 60);
                
//                 const totalTeorico = calcularTotalCombinacoesPossiveis(numerosFiltrados.length, 6);
//                 console.log("Total teórico calculado:", totalTeorico);
                
//                 // Mostrar o total teórico na interface
//                 document.getElementById("totalTeorico").textContent = totalTeorico.toLocaleString('pt-BR');
                
//                 // Ajustar o range para o total teórico (com limite prático de 1000 para não travar a interface)
                
// 				//	const limiteMaximo = Math.min(1000, Math.max(1, totalTeorico));
// 					const limiteMaximo = Math.max(1, totalTeorico);
//                 const rangeInput = document.getElementById("quantidadePalpites");
//                 rangeInput.max = limiteMaximo;
//                 rangeInput.value = Math.min(10, limiteMaximo);
//                 document.getElementById("valorQuantidadePalpites").textContent = rangeInput.value;
                
//                 // Atualizar o texto do máximo
//                 document.getElementById("valorMaximo").textContent = limiteMaximo.toLocaleString('pt-BR');
//             } else {
//                 palpitesControle.style.display = "none";
//                 // Esconder o container de palpites caso esteja visível
//                 document.getElementById("palpitesCard").style.display = "none";
//             }
//         } else {
//             alert(data.erro || "Erro ao calcular combinações");
//         }
//     } catch (error) {
//         alert("Erro ao comunicar com o servidor");
//         console.error(error);
//     }
// }


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
                
                // Mostrar o total teórico na interface formatado no padrão brasileiro
                document.getElementById("totalTeorico").textContent = formatarNumeroParaBR(totalTeorico);
                
                // ALTERAÇÃO AQUI: Usar totalTeorico como limite máximo sem restrição de 1000
                const limiteMaximo = Math.max(1, totalTeorico);
                const rangeInput = document.getElementById("quantidadePalpites");
                rangeInput.max = limiteMaximo;
                rangeInput.value = Math.min(10, limiteMaximo);
                document.getElementById("valorQuantidadePalpites").textContent = formatarNumeroParaBR(parseInt(rangeInput.value));
                
                // Atualizar o texto do máximo formatado no padrão brasileiro
                document.getElementById("valorMaximo").textContent = formatarNumeroParaBR(limiteMaximo);
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
    
    try {
        console.log("Iniciando requisição para gerar palpites...");
        console.log("Combinações:", window.combinacoesGeradas.length);
        console.log("Quantidade:", quantidadePalpites);
        
        // Mostrar indicador de carregamento
        document.getElementById("palpitesCard").style.display = "block";
        document.getElementById("palpites").innerHTML = 
            `<div class="alert alert-info">
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                Gerando ${quantidadePalpites} palpites. Isso pode levar alguns segundos...
            </div>`;
        
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
        
        console.log("Resposta recebida:", response.status);
        
        if (!response.ok) {
            console.error("Erro HTTP:", response.status, response.statusText);
            const errorText = await response.text();
            console.error("Texto do erro:", errorText);
            throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log("Dados recebidos:", data);
        
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
    } catch (error) {
        console.error("Erro completo:", error);
        alert("Erro ao comunicar com o servidor: " + error.message);
    }
}

// // Adicione este event listener para atualizar o valor exibido do slider
// document.addEventListener("DOMContentLoaded", function() {
//     const rangeInput = document.getElementById("quantidadePalpites");
//     const valorSpan = document.getElementById("valorQuantidadePalpites");
    
//     if (rangeInput && valorSpan) {
//         rangeInput.addEventListener("input", function() {
//             valorSpan.textContent = this.value;
//         });
//     }
// });

// Adicione este event listener para atualizar o valor exibido do slider
document.addEventListener("DOMContentLoaded", function() {
    const rangeInput = document.getElementById("quantidadePalpites");
    const valorSpan = document.getElementById("valorQuantidadePalpites");
    
    if (rangeInput && valorSpan) {
        rangeInput.addEventListener("input", function() {
            valorSpan.textContent = formatarNumeroParaBR(parseInt(this.value));
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



// Função para validar entrada de dígitos
function validarEntradaDigitos() {
    const inputDigitos = document.getElementById("numeros");
    const errorDiv = document.getElementById("numerosError");
    
    // Validar o padrão enquanto o usuário digita
    inputDigitos.addEventListener("input", function(e) {
        const valor = e.target.value;
        
        // Remover espaços em branco
        const valorSemEspacos = valor.replace(/\s/g, "");
        
        // Verificar se contém apenas dígitos (0-9) e vírgulas
        const regex = /^[0-9,]*$/;
        if (!regex.test(valorSemEspacos)) {
            errorDiv.textContent = "Por favor, insira apenas dígitos (0-9) separados por vírgulas.";
            errorDiv.style.display = "block";
            return;
        }
        
        // Verificar se tem números de dois dígitos (sem vírgula entre eles)
        const digitos = valorSemEspacos.split(",");
        for (const digito of digitos) {
            if (digito.length > 1) {
                errorDiv.textContent = "Cada dígito deve ser separado por vírgula. Insira apenas um dígito por vez (0-9).";
                errorDiv.style.display = "block";
                return;
            }
        }
        
        // Verificar dígitos duplicados e se estão no intervalo 0-9
        const digitosNumericos = digitos.filter(d => d !== "").map(d => parseInt(d, 10));
        const digitosUnicos = new Set(digitosNumericos);
        
        if (digitosNumericos.length > digitosUnicos.size) {
            errorDiv.textContent = "Não é permitido repetir dígitos. Use cada dígito apenas uma vez.";
            errorDiv.style.display = "block";
            return;
        }
        
        // Verificar se todos os dígitos estão no intervalo 0-9
        for (const digito of digitosNumericos) {
            if (digito < 0 || digito > 9) {
                errorDiv.textContent = "Apenas dígitos entre 0 e 9 são permitidos.";
                errorDiv.style.display = "block";
                return;
            }
        }
        
        // Se passou em todas as validações
        errorDiv.style.display = "none";
    });
    
    // Validar também no evento de submissão do formulário
    document.getElementById("formCombinacoes").addEventListener("submit", function(e) {
        const valor = inputDigitos.value;
        const valorSemEspacos = valor.replace(/\s/g, "");
        
        // Verificar se contém apenas dígitos (0-9) e vírgulas
        const regex = /^[0-9,]*$/;
        if (!regex.test(valorSemEspacos)) {
            e.preventDefault();
            errorDiv.textContent = "Por favor, insira apenas dígitos (0-9) separados por vírgulas.";
            errorDiv.style.display = "block";
            return false;
        }
        
        // Verificar se tem números de dois dígitos (sem vírgula entre eles)
        const digitos = valorSemEspacos.split(",");
        for (const digito of digitos) {
            if (digito.length > 1) {
                e.preventDefault();
                errorDiv.textContent = "Cada dígito deve ser separado por vírgula. Insira apenas um dígito por vez (0-9).";
                errorDiv.style.display = "block";
                return false;
            }
        }
        
        // Verificar dígitos duplicados e se estão no intervalo 0-9
        const digitosNumericos = digitos.filter(d => d !== "").map(d => parseInt(d, 10));
        const digitosUnicos = new Set(digitosNumericos);
        
        if (digitosNumericos.length > digitosUnicos.size) {
            e.preventDefault();
            errorDiv.textContent = "Não é permitido repetir dígitos. Use cada dígito apenas uma vez.";
            errorDiv.style.display = "block";
            return false;
        }
        
        // Verificar se todos os dígitos estão no intervalo 0-9
        for (const digito of digitosNumericos) {
            if (digito < 0 || digito > 9) {
                e.preventDefault();
                errorDiv.textContent = "Apenas dígitos entre 0 e 9 são permitidos.";
                errorDiv.style.display = "block";
                return false;
            }
        }
        
        // Se passou em todas as validações
        return true;
    });
}

// Função para criar tabela formatada para Excel
function criarTabelaCombinacoes(combinacoes) {
    // Filtrar para remover completamente números acima de 60
    const combinacoesFiltradas = combinacoes.filter(comb => {
        const num = parseInt(comb);
        return num > 0 && num <= 60; // Garantir que esteja no intervalo 1-60
    });
    
    // Ordenar numericamente (não alfabeticamente)
    combinacoesFiltradas.sort((a, b) => parseInt(a) - parseInt(b));
    
    // Configurar tabela com exatos 6 números por linha (padrão Mega Sena)
    const numeroColunas = 6;
    const numeroLinhas = Math.ceil(combinacoesFiltradas.length / numeroColunas);
    
    const tabela = document.createElement('table');
    tabela.className = 'table table-bordered tabela-excel';
    
    const tbody = document.createElement('tbody');
    let index = 0;
    
    for (let i = 0; i < numeroLinhas; i++) {
        const row = document.createElement('tr');
        
        for (let j = 0; j < numeroColunas; j++) {
            const cell = document.createElement('td');
            
            if (index < combinacoesFiltradas.length) {
                const num = parseInt(combinacoesFiltradas[index]);
                
                // Formatar com zero à esquerda para números < 10
                cell.textContent = num < 10 ? `0${num}` : num;
                cell.className = 'celula-excel';
            } else {
                // Célula vazia para completar a linha
                cell.innerHTML = '&nbsp;';
            }
            
            row.appendChild(cell);
            index++;
        }
        
        tbody.appendChild(row);
    }
    
    tabela.appendChild(tbody);
    return tabela;
}

document.addEventListener("DOMContentLoaded", function() {
    // Garantir que o tamanho do agrupamento seja fixo em 2
    const tamanhoInput = document.getElementById("tamanho");
    tamanhoInput.value = "2";
    tamanhoInput.setAttribute("readonly", "readonly");
    tamanhoInput.style.backgroundColor = "#f8f9fa"; // Fundo cinza para indicar que é somente leitura
    
    // Inicializar outras funções
    validarEntradaDigitos();
    
    // Também adicionar mensagem de instrução inicial
    const inputDigitos = document.getElementById("numeros");
    inputDigitos.setAttribute("placeholder", "ex: 0,1,2,3,4,5");
});


// Função para gerar palpites (modificada para suportar assíncrono)
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
        // Adicionar um timeout maior para a requisição
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos de timeout
        
        const response = await fetch("/gerar_palpites", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                combinacoes: window.combinacoesGeradas,
                quantidade: quantidadePalpites
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId); // Limpar o timeout se a requisição completar antes
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro na resposta:", response.status, errorText);
            throw new Error(`Erro do servidor: ${response.status}`);
        }
        
        const data = await response.json();
        
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
    } catch (error) {
        console.error("Erro completo:", error);
        
        // Mostrar uma mensagem de erro mais informativa
        const palpitesDiv = document.getElementById("palpites");
        palpitesDiv.innerHTML = `
            <div class="alert alert-danger">
                <strong>Erro ao gerar palpites:</strong> ${error.message || 'Erro de comunicação com o servidor'}
                <hr>
                <small>Tente reduzir o número de palpites solicitados ou tente novamente mais tarde.</small>
            </div>
        `;
        
        document.getElementById("palpitesCard").style.display = "block";
    }
}


// Função para polling (backup caso WebSockets não esteja disponível)
function iniciarPolling(taskId) {
    const intervalId = setInterval(async () => {
        try {
            const response = await fetch(`/verificar_tarefa/${taskId}`);
            const data = await response.json();
            
            // Simular atualização de WebSocket
            atualizarProgressoTarefa({
                status: data.status,
                progress: Math.floor((data.current / data.total) * 100),
                message: data.status,
                result: data.resultado
            });
            
            // Se concluído ou falhou, parar o polling
            if (data.status === 'concluído' || data.status === 'falha') {
                clearInterval(intervalId);
            }
        } catch (error) {
            console.error("Erro no polling:", error);
        }
    }, 2000); // Verificar a cada 2 segundos
}

// Função para exibir os palpites
function exibirPalpites(palpites) {
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
    palpites.forEach((palpite) => {
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
}

// Event handler para o botão de novo processamento
document.addEventListener("DOMContentLoaded", function() {
    const btnNovo = document.getElementById("btnNovoProcessamento");
    if (btnNovo) {
        btnNovo.addEventListener("click", function() {
            // Esconder o card de processamento
            document.getElementById("processamentoAssincrono").style.display = "none";
            // Limpar o task ID atual
            if (typeof currentTaskId !== 'undefined') {
                currentTaskId = null;
            }
        });
    }
});