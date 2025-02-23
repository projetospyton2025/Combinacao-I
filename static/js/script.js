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
//             // Exibe o total
//             document.getElementById("totalCombinacoes").style.display = "block";
//             document.getElementById("total").textContent = data.total;
            
//             // Exibe as combinaÃ§Ãµes
//             const combinacoesDiv = document.getElementById("combinacoes");
//             combinacoesDiv.innerHTML = data.combinacoes.join("<br>");
//             document.getElementById("resultadoCard").style.display = "block";
//         } else {
//             alert(data.erro || "Erro ao calcular combinaÃ§Ãµes");
//         }
//     } catch (error) {
//         alert("Erro ao comunicar com o servidor");
//         console.error(error);
//     }
// }

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
            // Agora juntamos os números com espaço entre eles
            combinacoesDiv.innerHTML = data.combinacoes.join(" ");
            document.getElementById("resultadoCard").style.display = "block";
        } else {
            alert(data.erro || "Erro ao calcular combinações");
        }
    } catch (error) {
        alert("Erro ao comunicar com o servidor");
        console.error(error);
    }
}