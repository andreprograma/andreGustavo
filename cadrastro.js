// Variáveis de acesso aos elementos HTML
const gerenciarProdutosBtn = document.getElementById("gerenciar-produtos-btn");
const modalGerenciarProdutos = document.getElementById("modal-gerenciar-produtos");
const modalEditarProduto = document.getElementById("modal-editar-produto");
const fecharModalGerenciarProdutosBtn = document.getElementById("fechar-modal-gerenciar-produtos");
const fecharEditarModalBtn = document.getElementById("fechar-editar-modal");
const closeModalButton = document.querySelector("#close-modal");
const salvarProdutoEditadoBtn = document.getElementById("salvar-produto-editado");
const imagensProduto = document.querySelectorAll(".imagem-produto");
const listaProdutosModal = document.getElementById("lista-produtos-modal");
const editarNomeInput = document.getElementById("editar-nome");
const editarDescricaoInput = document.getElementById("editar-descricao");
const editarCategoriaInput = document.getElementById("editar-categoria");
const codigoProdutoInput = document.getElementById("codigo-produto");
const listaProdutosTabela = document.getElementById("lista-produtos");
const editarImagemInput = document.getElementById("editar-imagem");


let produtosSelecionados = [];
let indiceEdicao = -1;

// Função para abrir o modal de gerenciamento de produtos
gerenciarProdutosBtn.addEventListener("click", () => {
    modalGerenciarProdutos.style.display = "flex"; // Exibe o modal
    exibirProdutosModal(); // Exibe a lista de produtos no modal
    closeModalButton.addEventListener('click', closeModal);

});

// Função para fechar o modal de gerenciamento de produtos
fecharModalGerenciarProdutosBtn.addEventListener("click", () => {
    modalGerenciarProdutos.style.display = "none"; // Fecha o modal
});

// Função para abrir o modal de edição de produto
imagensProduto.forEach((imagem, index) => {
    imagem.addEventListener("click", () => {
        // Preenche os campos com as informações do produto ao clicar na imagem
        editarNomeInput.value = imagem.getAttribute("data-nome");
        editarDescricaoInput.value = imagem.getAttribute("data-descricao");
        editarCategoriaInput.value = imagem.getAttribute("data-categoria");
        codigoProdutoInput.value = `cod-${(Math.floor(Math.random() * 1000))}`; // Gerando um código automaticamente

        modalEditarProduto.style.display = "flex"; // Exibe o modal de edição
    });
});

// Função para salvar a edição ou novo produto
salvarProdutoEditadoBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário

    const nome = editarNomeInput.value;
    const descricao = editarDescricaoInput.value;
    const categoria = editarCategoriaInput.value;
    const codigo = codigoProdutoInput.value;

    if (indiceEdicao === -1) {
        // Adicionando novo produto
        const produto = {
            codigo,
            nome,
            descricao,
            categoria
        };
        produtosSelecionados.push(produto);
    } else {
        // Editando produto existente
        produtosSelecionados[indiceEdicao] = {
            codigo,
            nome,
            descricao,
            categoria
        };
    }
  // Lógica para obter a imagem
  const imagemFile = editarImagemInput.files[0];
  const imagemURL = imagemFile ? URL.createObjectURL(imagemFile) : "./";

  const produto = {
      codigo,
      nome,
      descricao,
      categoria,
      imagem: imagemURL

    }

    exibirProdutosTabela(); // Atualiza a lista na tabela
    exibirProdutosModal(); // Atualiza a lista no modal
    modalEditarProduto.style.display = "none"; // Fecha o modal de edição
});

// Função para exibir a lista de produtos na tabela da página principal
function exibirProdutosTabela() {
    listaProdutosTabela.innerHTML = ""; // Limpa a lista de produtos

    produtosSelecionados.forEach((produto, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${produto.codigo}</td>
            <td>${produto.nome}</td>
            <td>${produto.descricao}</td>
            <td>${produto.categoria}</td>
            <button onclick="editarProduto(${index})">Editar</button>
            <button onclick="excluirProduto(${index})">Excluir</button>
            <td>
            <img src="${produto.imagem}" alt="${produto.nome}" width="50"></td>
            </td>
        `;
        listaProdutosTabela.appendChild(tr);
    });
}

// Função para exibir os produtos no modal
function exibirProdutosModal() {
    listaProdutosModal.innerHTML = ""; // Limpa a lista de produtos no modal
    produtosSelecionados.forEach((produto, index) => {
        const li = document.createElement("li");
        li.textContent = `${produto.nome} (${produto.codigo})`;
        li.innerHTML += `<button onclick="editarProduto(${index})">Editar</button>
                         <button onclick="excluirProduto(${index})">Excluir</button>`;
        listaProdutosModal.appendChild(li);
    });
}

// Função para editar um produto
function editarProduto(index) {
    const produto = produtosSelecionados[index];
    editarNomeInput.value = produto.nome;
    editarDescricaoInput.value = produto.descricao;
    editarCategoriaInput.value = produto.categoria;
    codigoProdutoInput.value = produto.codigo;

    modalEditarProduto.style.display = "flex"; // Exibe o modal de edição
    indiceEdicao = index; // Define o índice do produto a ser editado
}

// Função para excluir um produto
function excluirProduto(index) {
    produtosSelecionados.splice(index, 1); // Remove o produto da lista
    exibirProdutosTabela(); // Atualiza a lista na tabela
    exibirProdutosModal(); // Atualiza a lista no modal
}
// Função para gerar o PDF
document.getElementById('gerar-pdf-btn').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Tabela de Produtos', 20, 10);
    const table = produtosSelecionados.map((produto, index) => [
        produto.codigo,
        produto.nome,
        produto.descricao,
        produto.categoria,
    ]);
    doc.autoTable({
        head: [['Código', 'Nome', 'Descrição', 'Categoria']],
        body: table
    });
    doc.save('produtos.pdf');
});

// Função para gerar o Excel
document.getElementById('gerar-excel-btn').addEventListener('click', () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
        ['Código', 'Nome', 'Descrição', 'Categoria'],
        ...produtosSelecionados.map(p => [p.codigo, p.nome, p.descricao, p.categoria]),
    ]);
    XLSX.utils.book_append_sheet(wb, ws, 'Produtos');
    XLSX.writeFile(wb, 'produtos.xlsx');
});