

    // Dados da aplicação
    let plantas = [];
    let tarefas = [];

    // Mapeia os canteiros clicáveis
    document.querySelectorAll('.canteiro').forEach(canteiro => {
      canteiro.addEventListener('click', () => {
        const id = canteiro.dataset.id;
        const plantasNoCanteiro = plantas.filter(p => p.canteiro == id);
        
        if (plantasNoCanteiro.length > 0) {
          const dataFormatada = new Date(plantasNoCanteiro[0].data).toLocaleDateString('pt-BR');
          alert(`Canteiro ${id}:\n${plantasNoCanteiro.map(p => `- ${p.nome} (plantado em ${dataFormatada})`).join('\n')}`);
        } else {
          alert(`Canteiro ${id} está vazio! Que tal plantar algo?`);
        }
      });
    });

    // Cadastra nova planta
    document.getElementById('form-planta').addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('nome-planta').value;
      const data = document.getElementById('data-plantio').value;
      const canteiro = document.getElementById('canteiro-planta').value;

      if (!nome || !data || !canteiro) {
        alert('Preencha todos os campos!');
        return;
      }

      plantas.push({ 
        id: Date.now(), // ID único para a planta
        nome, 
        data, 
        canteiro 
      });
      atualizarPlantas();
      e.target.reset();
    });

    // Atualiza a lista de plantas
    function atualizarPlantas() {
      const listaPlantas = document.getElementById('lista-plantas');
      listaPlantas.innerHTML = '';
      
      if (plantas.length === 0) {
        listaPlantas.innerHTML = '<p class="sem-itens">Nenhuma planta cadastrada ainda.</p>';
        return;
      }

      // Agrupa plantas por canteiro
      const plantasPorCanteiro = {};
      plantas.forEach(planta => {
        if (!plantasPorCanteiro[planta.canteiro]) {
          plantasPorCanteiro[planta.canteiro] = [];
        }
        plantasPorCanteiro[planta.canteiro].push(planta);
      });

      // Cria seções para cada canteiro
      for (const canteiro in plantasPorCanteiro) {
        const grupo = document.createElement('div');
        grupo.className = 'grupo-canteiro';
        
        const cabecalho = document.createElement('div');
        cabecalho.className = 'cabecalho-canteiro';
        cabecalho.innerHTML = `Canteiro ${canteiro}`;
        
        const lista = document.createElement('div');
        lista.className = 'lista-plantas';
        
        plantasPorCanteiro[canteiro].forEach(planta => {
          const dataFormatada = new Date(planta.data).toLocaleDateString('pt-BR');
          const plantaElement = document.createElement('div');
          plantaElement.className = 'planta-item';
          plantaElement.innerHTML = `
            <div class="texto-planta">
              <strong>${planta.nome}</strong>
              <span class="data-planta">Plantado em: ${dataFormatada}</span>
            </div>
            <div class="acoes-planta">
              <button class="btn-remover" onclick="removerPlanta(${planta.id})">Remover</button>
            </div>
          `;
          lista.appendChild(plantaElement);
        });
        
        grupo.appendChild(cabecalho);
        grupo.appendChild(lista);
        listaPlantas.appendChild(grupo);
      }
    }

    // Remover planta
    function removerPlanta(id) {
      if (confirm('Tem certeza que deseja remover esta planta?')) {
        plantas = plantas.filter(p => p.id !== id);
        atualizarPlantas();
      }
    }

    // Mostrar/ocultar formulário de tarefa
    document.getElementById('nova-tarefa').addEventListener('click', () => {
      const form = document.getElementById('form-tarefa');
      form.style.display = form.style.display === 'none' ? 'flex' : 'none';
    });

    // Salvar nova tarefa
    document.getElementById('salvar-tarefa').addEventListener('click', () => {
      const texto = document.getElementById('texto-tarefa').value;
      const canteiro = document.getElementById('canteiro-tarefa').value;

      if (!texto || !canteiro) {
        alert('Preencha todos os campos!');
        return;
      }

      tarefas.push({ 
        id: Date.now(), // ID único para a tarefa
        texto, 
        canteiro,
        concluida: false
      });
      atualizarTarefas();
      // Limpa e esconde o formulário
      document.getElementById('texto-tarefa').value = '';
      document.getElementById('canteiro-tarefa').value = '';
      document.getElementById('form-tarefa').style.display = 'none';
    });

    // Atualiza a lista de tarefas agrupadas por canteiro
    function atualizarTarefas() {
      const divTarefas = document.getElementById('lista-tarefas');
      divTarefas.innerHTML = '';
      
      // Agrupa tarefas por canteiro
      const tarefasPorCanteiro = {};
      tarefas.forEach(tarefa => {
        if (!tarefasPorCanteiro[tarefa.canteiro]) {
          tarefasPorCanteiro[tarefa.canteiro] = [];
        }
        tarefasPorCanteiro[tarefa.canteiro].push(tarefa);
      });
      
      // Cria seções para cada canteiro
      for (const canteiro in tarefasPorCanteiro) {
        const grupo = document.createElement('div');
        grupo.className = 'grupo-canteiro';
        
        const cabecalho = document.createElement('div');
        cabecalho.className = 'cabecalho-canteiro';
        cabecalho.innerHTML = `Canteiro ${canteiro}`;
        
        const lista = document.createElement('div');
        lista.className = 'lista-tarefas';
        
        if (tarefasPorCanteiro[canteiro].length === 0) {
          lista.innerHTML = '<div class="sem-itens">Nenhuma tarefa para este canteiro</div>';
        } else {
          tarefasPorCanteiro[canteiro].forEach(tarefa => {
            const tarefaElement = document.createElement('div');
            tarefaElement.className = `tarefa ${tarefa.concluida ? 'tarefa-concluida' : ''}`;
            tarefaElement.innerHTML = `
              <input type="checkbox" class="checkbox-tarefa" ${tarefa.concluida ? 'checked' : ''} 
                onclick="alternarConclusaoTarefa(${tarefa.id})">
              <span class="texto-tarefa">${tarefa.texto}</span>
              <div class="acoes-tarefa">
                <button class="btn-remover" onclick="removerTarefa(${tarefa.id})">Remover</button>
              </div>
            `;
            lista.appendChild(tarefaElement);
          });
        }
        
        grupo.appendChild(cabecalho);
        grupo.appendChild(lista);
        divTarefas.appendChild(grupo);
      }
      
      // Mostra mensagem se não houver tarefas
      if (tarefas.length === 0) {
        divTarefas.innerHTML = '<div class="sem-itens">Nenhuma tarefa cadastrada ainda</div>';
      }
    }

    // Alternar conclusão da tarefa
    function alternarConclusaoTarefa(id) {
      const tarefa = tarefas.find(t => t.id === id);
      if (tarefa) {
        tarefa.concluida = !tarefa.concluida;
        atualizarTarefas();
      }
    }

    // Remover tarefa
    function removerTarefa(id) {
      if (confirm('Tem certeza que deseja remover esta tarefa?')) {
        tarefas = tarefas.filter(t => t.id !== id);
        atualizarTarefas();
      }
    }

    // Inicializa com alguns dados de exemplo
    plantas = [
      { id: 1, nome: "Tomate Cereja", data: "2024-05-01", canteiro: "1" },
      { id: 2, nome: "Alface Crespa", data: "2024-05-10", canteiro: "2" },
      { id: 3, nome: "Salsinha", data: "2024-05-05", canteiro: "3" }
    ];

    tarefas = [
      { id: 1, texto: "Regar plantas", canteiro: "1", concluida: false },
      { id: 2, texto: "Adubar solo", canteiro: "3", concluida: true },
      { id: 3, texto: "Colher alface", canteiro: "2", concluida: false }
    ];

    // Atualiza as listas na inicialização
    atualizarPlantas();
    atualizarTarefas();
