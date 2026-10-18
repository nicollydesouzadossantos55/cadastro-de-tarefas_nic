
const formulario = document.getElementById("formulario-tarefas");
const campoTarefas = document.getElementById("campo-tarefas");
const listaTarefas = document.getElementById("lista-tarefas");
const mensagemVazia = document.getElementById("mensagem-vazia");

const contadorTotal = document.getElementById("contador-total");
const contadorPendentes = document.getElementById("contador-pendentes");
const contadorConcluidas = document.getElementById("contador-tarefas");

const botaoTema = document.getElementById("botao-alterar-tema");
const botaoInformacoes = document.getElementById("botao-informacoes");
const modalInformacoes = document.getElementById("modal-informacoes");
const botaoFecharModal = document.getElementById("botao-fechar-modal");

let tarefas = JSON.parse(localStorage.getItem("minhasTarefas")) || [];
let filtroAtual = "todas";

function salvarTarefas() {
    localStorage.setItem("minhasTarefas", JSON.stringify(tarefas));
}

function atualizarContadores() {
    contadorTotal.textContent = tarefas.length;

    contadorPendentes.textContent =
        tarefas.filter(tarefa => !tarefa.concluida).length;

    contadorConcluidas.textContent =
        tarefas.filter(tarefa => tarefa.concluida).length;
}

function mostrarTarefas() {
    listaTarefas.innerHTML = "";

    const tarefasFiltradas = tarefas.filter(tarefa => {
        if (filtroAtual === "pendentes") {
            return !tarefa.concluida;
        }

        if (filtroAtual === "concluidas") {
            return tarefa.concluida;
        }

        return true;
    });

    mensagemVazia.style.display =
        tarefasFiltradas.length === 0 ? "block" : "none";

    if (tarefas.length === 0) {
        mensagemVazia.textContent =
            "Você ainda não tem tarefas por aqui. ✨";
    } else if (tarefasFiltradas.length === 0) {
        mensagemVazia.textContent =
            "Não há tarefas nessa categoria.";
    }

    tarefasFiltradas.forEach(tarefa => {
        const item = document.createElement("li");
        item.className = "item-tarefa";

        if (tarefa.concluida) {
            item.classList.add("concluida");
        }

        const texto = document.createElement("span");
        texto.className = "texto-tarefa";
        texto.textContent = tarefa.texto;

        if (tarefa.concluida) {
            texto.classList.add("concluido");
        }

        const botoes = document.createElement("div");
        botoes.className = "botoes-tarefa";

        const botaoConcluir = document.createElement("button");
        botaoConcluir.className = "botao-acao riscar";
        botaoConcluir.title = tarefa.concluida
            ? "Desmarcar tarefa"
            : "Concluir tarefa";

        botaoConcluir.innerHTML = tarefa.concluida
            ? '<i class="fas fa-rotate-left"></i>'
            : '<i class="fas fa-check"></i>';

        botaoConcluir.addEventListener("click", () => {
            tarefa.concluida = !tarefa.concluida;
            salvarTarefas();
            mostrarTarefas();
        });

        const botaoEditar = document.createElement("button");
        botaoEditar.className = "botao-acao editar";
        botaoEditar.title = "Editar tarefa";
        botaoEditar.innerHTML = '<i class="fas fa-pen"></i>';

        botaoEditar.addEventListener("click", () => {
            const novoTexto = prompt("Digite o novo texto da tarefa:", tarefa.texto);

            if (novoTexto !== null && novoTexto.trim() !== "") {
                tarefa.texto = novoTexto.trim().slice(0, 40);
                salvarTarefas();
                mostrarTarefas();
            }
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.className = "botao-acao excluir";
        botaoExcluir.title = "Excluir tarefa";
        botaoExcluir.innerHTML = '<i class="fas fa-trash"></i>';

        botaoExcluir.addEventListener("click", () => {
            tarefas = tarefas.filter(item => item.id !== tarefa.id);
            salvarTarefas();
            mostrarTarefas();
        });

        botoes.appendChild(botaoConcluir);
        botoes.appendChild(botaoEditar);
        botoes.appendChild(botaoExcluir);

        item.appendChild(texto);
        item.appendChild(botoes);

        listaTarefas.appendChild(item);
    });

    atualizarContadores();
}

formulario.addEventListener("submit", evento => {
    evento.preventDefault();

    const texto = campoTarefas.value.trim();

    if (texto === "") {
        alert("Digite uma tarefa antes de adicionar!");
        return;
    }

    tarefas.push({
        id: Date.now(),
        texto: texto,
        concluida: false
    });

    salvarTarefas();
    mostrarTarefas();

    campoTarefas.value = "";
    campoTarefas.focus();
});

document.querySelectorAll(".botao-filtro").forEach(botao => {
    botao.addEventListener("click", () => {
        filtroAtual = botao.dataset.filtro;

        document.querySelectorAll(".botao-filtro").forEach(item => {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");
        mostrarTarefas();
    });
});

function aplicarTema(escuro) {
    document.body.classList.toggle("tema-escuro", escuro);

    botaoTema.innerHTML = escuro
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';

    localStorage.setItem("temaTarefas", escuro ? "escuro" : "claro");
}

botaoTema.addEventListener("click", () => {
    const escuro = !document.body.classList.contains("tema-escuro");
    aplicarTema(escuro);
});

aplicarTema(localStorage.getItem("temaTarefas") === "escuro");

botaoInformacoes.addEventListener("click", () => {
    modalInformacoes.showModal();
});

botaoFecharModal.addEventListener("click", () => {
    modalInformacoes.close();
});

modalInformacoes.addEventListener("click", evento => {
    if (evento.target === modalInformacoes) {
        modalInformacoes.close();
    }
});

mostrarTarefas();
