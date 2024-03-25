document.addEventListener('DOMContentLoaded', function() {
    const btnObterDados = document.getElementById('btnObterDados');
    const progressBar = document.getElementById('progressBar');
  
    btnObterDados.addEventListener('click', function() {
        const checkboxPessoa = document.getElementById('checkboxPessoa');
        const checkboxEndereco = document.getElementById('checkboxEndereco');
        const quantidadeInput = document.getElementById('quantidade').value;
      
        if (quantidadeInput <= 0) {
            alert('A quantidade deve ser um número positivo.');
            return;
        }
      
        const apiUrl = 'https://fakerapi.it/api/v1/';
      
        let tiposDadosSelecionados = [];
      
        if (checkboxPessoa.checked) {
            tiposDadosSelecionados.push('persons');
        }
      
        if (checkboxEndereco.checked) {
            tiposDadosSelecionados.push('addresses');
        }
      
        if (tiposDadosSelecionados.length === 0) {
            alert('Selecione pelo menos um tipo de dado.');
            return;
        }
      
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
      
        buscarDados(apiUrl, tiposDadosSelecionados, quantidadeInput);
    });
  
    function buscarDados(apiUrl, tiposDados, quantidade) {
        tiposDados.forEach(tipo => {
            const requisicaoXMLHttp = new XMLHttpRequest();
            requisicaoXMLHttp.onreadystatechange = function() {
                if (requisicaoXMLHttp.readyState === 4) {
                    if (requisicaoXMLHttp.status === 200) {
                        const dados = JSON.parse(requisicaoXMLHttp.responseText);
                        exibirDados(dados.data, tipo);
                    }
                    // Atualiza a barra de progresso para 100% após a conclusão da solicitação
                    progressBar.style.width = '100%';
                    progressBar.textContent = '100%';
                } else {
                    // Atualiza a barra de progresso durante o progresso da solicitação
                    const progresso = (requisicaoXMLHttp.readyState / 4) * 100;
                    progressBar.style.width = `${progresso}%`;
                    progressBar.textContent = `${progresso.toFixed(0)}%`;
                }
            };
            requisicaoXMLHttp.open('GET', `${apiUrl}${tipo}?_quantity=${quantidade}`, true);
            requisicaoXMLHttp.send();
        });
    }

    function exibirDados(arrayDados, tipo) {
        const containerDados = document.getElementById(`${tipo}Container`);
        if (!containerDados) {
            console.error(`Contêiner de dados para ${tipo} não encontrado.`);
            return;
        }
        containerDados.innerHTML = '';
        
        arrayDados.forEach((dados, index) => {
            const divDados = document.createElement('div');
            divDados.classList.add('conjuntoDados');
            divDados.innerHTML = `<h3>Conjunto de Dados ${index + 1} - ${tipo}</h3>`;
            for (const chave in dados) {
                const paragrafo = document.createElement('p');
                paragrafo.textContent = `${chave}: ${dados[chave]}`;
                divDados.appendChild(paragrafo);
            }
            containerDados.appendChild(divDados);
        });
    }
});
