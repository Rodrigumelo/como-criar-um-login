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
  
  