function mostrarLista() {
  var textarea = document.getElementById("lista");
  var listaItens = document.getElementById("listaItens");
  listaItens.innerHTML = ''; // Limpa a lista antes de adicionar novos itens

  var linhas = textarea.value.split('\n');
  linhas.forEach(function(item) {
      if (item.trim() !== '') { // Ignora linhas em branco
          var li = document.createElement("li");
          li.textContent = item;
          listaItens.appendChild(li);
      }
  });
}

function toggleSidebar() {
  var sidebar = document.getElementById('sidebar');
  var content = document.getElementById('content');
  var toggleBtn = document.getElementById('toggleBtn');
  
  if (sidebar.style.width === '0px' || sidebar.style.width === '') {
      sidebar.style.width = '250px';
      content.style.marginLeft = '250px';
      toggleBtn.style.left = '250px'; // Ajusta a posição do botão
  } else {
      sidebar.style.width = '0px';
      content.style.marginLeft = '0px';
      toggleBtn.style.left = '20px'; // Ajusta a posição do botão
  }
}

function exportToExcel() {
  const requisitante = document.querySelector("textarea[placeholder='Nome do requisitante']").value;
  const matricula = document.querySelector("textarea[placeholder='Matricula do requisitante']").value;
  const empresa = document.querySelector("input[name='empresa']:checked").value;
  const ferramentas = document.getElementById("lista").value.split('\n');
  const data_requisicao = document.getElementById("data_requisicao").value;
  const horario_requisicao = document.getElementById("horario_requisicao").value;
  const data_devolucao = document.getElementById("data_devolucao").value;
  const horario_devolucao = document.getElementById("horario_devolucao").value;

  const data = {
      requisitante: requisitante,
      matricula: matricula,
      empresa: empresa,
      ferramentas: ferramentas.filter(f => f.trim() !== ""),
      data_requisicao: data_requisicao,
      horario_requisicao: horario_requisicao,
      data_devolucao: data_devolucao,
      horario_devolucao: horario_devolucao
  };

  fetch('/export', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  })
  .then(response => response.blob())
  .then(blob => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'RequisicaoFerramentas.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
  })
  .catch(error => console.error('Error exporting to Excel:', error));
}
