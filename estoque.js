// estoque.js

// Inicializa o estoque no localStorage se não existir
if (!localStorage.getItem('estoque')) {
    localStorage.setItem('estoque', JSON.stringify({
        empresas: [],
        produtos: [],
        movimentacoes: [],
        usuarios: []
    }));
    console.log('LocalStorage inicializado com sucesso!');
}

// Função para adicionar uma empresa
function adicionarEmpresa(cnpj, nome, codigo) {
    const estoque = JSON.parse(localStorage.getItem('estoque'));
    const empresaExistente = estoque.empresas.find(e => e.codigo === codigo);
    if (empresaExistente) {
        console.log('Empresa já existe:', empresaExistente);
        return false;
    }
    estoque.empresas.push({ cnpj, nome, codigo });
    localStorage.setItem('estoque', JSON.stringify(estoque));
    console.log('Nova empresa adicionada:', { cnpj, nome, codigo });
    return true;
}

// Função para excluir uma empresa
function excluirEmpresa(codigo) {
    const estoque = JSON.parse(localStorage.getItem('estoque'));
    const index = estoque.empresas.findIndex(e => e.codigo === codigo);
    if (index !== -1) {
        estoque.empresas.splice(index, 1);
        localStorage.setItem('estoque', JSON.stringify(estoque));
        console.log('Empresa excluída com sucesso:', codigo);
        return true;
    }
    console.log('Empresa não encontrada:', codigo);
    return false;
}

// Função para adicionar um produto
function adicionarProduto(nome, tipo, empresaCodigo, endereco, quantidade, fabricacao, validade) {
    const estoque = JSON.parse(localStorage.getItem('estoque'));

    // Verifica se o produto já existe
    const produtoExistente = estoque.produtos.find(p => p.nome === nome && p.empresaCodigo === empresaCodigo);

    if (produtoExistente) {
        // Atualiza o produto existente
        produtoExistente.endereco = endereco;
        produtoExistente.quantidade += quantidade;
        produtoExistente.fabricacao = fabricacao;
        produtoExistente.validade = validade;
        console.log('Produto atualizado:', produtoExistente);
    } else {
        // Adiciona um novo produto
        estoque.produtos.push({ nome, tipo, empresaCodigo, endereco, quantidade, fabricacao, validade });
        console.log('Novo produto adicionado:', { nome, tipo, empresaCodigo, endereco, quantidade, fabricacao, validade });
    }

    localStorage.setItem('estoque', JSON.stringify(estoque));
}

// Função para excluir um produto
function excluirProduto(nome, empresaCodigo) {
    const estoque = JSON.parse(localStorage.getItem('estoque'));
    const index = estoque.produtos.findIndex(p => p.nome === nome && p.empresaCodigo === empresaCodigo);
    if (index !== -1) {
        estoque.produtos.splice(index, 1);
        localStorage.setItem('estoque', JSON.stringify(estoque));
        console.log('Produto excluído com sucesso:', { nome, empresaCodigo });
        return true;
    }
    console.log('Produto não encontrado:', { nome, empresaCodigo });
    return false;
}

// Função para buscar todas as empresas
function buscarTodasEmpresas() {
    const estoque = JSON.parse(localStorage.getItem('estoque'));
    console.log('Buscando todas as empresas:', estoque.empresas);
    return estoque.empresas;
}

// Função para buscar todos os produtos
function buscarTodosProdutos() {
    const estoque = JSON.parse(localStorage.getItem('estoque'));
    console.log('Buscando todos os produtos:', estoque.produtos);
    return estoque.produtos;
}

// Função para buscar produtos por empresa
function buscarProdutosPorEmpresa(empresaCodigo) {
    const estoque = JSON.parse(localStorage.getItem('estoque'));
    const produtos = estoque.produtos.filter(p => p.empresaCodigo === empresaCodigo);
    console.log('Buscando produtos por empresa:', produtos);
    return produtos;
}

// Função para registrar uma movimentação
function registrarMovimentacao(tipo, numeroNota, empresaCodigo, produtoNome, quantidade, motivo = '') {
    const estoque = JSON.parse(localStorage.getItem('estoque'));
    estoque.movimentacoes.push({
        tipo,
        numeroNota,
        empresaCodigo,
        produto: produtoNome,
        quantidade,
        motivo,
        data: new Date().toLocaleString("pt-BR")
    });
    localStorage.setItem('estoque', JSON.stringify(estoque));
    console.log('Movimentação registrada:', { tipo, numeroNota, empresaCodigo, produtoNome, quantidade, motivo });
}

// Função para buscar todas as movimentações
function buscarTodasMovimentacoes() {
    const estoque = JSON.parse(localStorage.getItem('estoque'));
    console.log('Buscando todas as movimentações:', estoque.movimentacoes);
    return estoque.movimentacoes;
}

// Função para buscar movimentações por empresa e tipo
function buscarMovimentacoes(empresaCodigo, produtoNome, tipo) {
    const estoque = JSON.parse(localStorage.getItem('estoque'));
    let movimentacoes = estoque.movimentacoes;

    // Filtra por empresa
    if (empresaCodigo) {
        movimentacoes = movimentacoes.filter(m => m.empresaCodigo === empresaCodigo);
    }

    // Filtra por produto
    if (produtoNome) {
        movimentacoes = movimentacoes.filter(m => m.produto === produtoNome);
    }

    // Filtra por tipo
    if (tipo !== 'todos') {
        movimentacoes = movimentacoes.filter(m => m.tipo === tipo);
    }

    console.log('Buscando movimentações:', movimentacoes);
    return movimentacoes;
}

// Função para buscar movimentações por número da nota e tipo
function buscarMovimentacoesPorNota(numeroNota, tipo) {
    const estoque = JSON.parse(localStorage.getItem('estoque'));
    let movimentacoes = estoque.movimentacoes;

    // Filtra por número da nota
    if (numeroNota) {
        movimentacoes = movimentacoes.filter(m => m.numeroNota === numeroNota);
    }

    // Filtra por tipo (entrada, saída ou devolução)
    if (tipo && tipo !== 'todos') {
        movimentacoes = movimentacoes.filter(m => m.tipo === tipo);
    }

    console.log('Movimentações encontradas:', movimentacoes);
    return movimentacoes;
}

// Função para remover uma movimentação
function removerMovimentacao(index) {
    const estoque = JSON.parse(localStorage.getItem('estoque'));
    if (index >= 0 && index < estoque.movimentacoes.length) {
        estoque.movimentacoes.splice(index, 1);
        localStorage.setItem('estoque', JSON.stringify(estoque));
        console.log('Movimentação removida com sucesso:', index);
        return true;
    }
    console.log('Índice inválido para remoção de movimentação:', index);
    return false;
}

// Função para calcular o estoque atual de um produto
function calcularEstoqueAtual(produtoNome) {
    const estoque = JSON.parse(localStorage.getItem('estoque'));
    const movimentacoes = estoque.movimentacoes.filter(m => m.produto === produtoNome);
    let estoqueAtual = 0;

    movimentacoes.forEach(movimentacao => {
        if (movimentacao.tipo === 'entrada' || movimentacao.tipo === 'devolucao') {
            estoqueAtual += parseInt(movimentacao.quantidade);
        } else if (movimentacao.tipo === 'saida') {
            estoqueAtual -= parseInt(movimentacao.quantidade);
        }
    });

    console.log('Estoque atual calculado para o produto:', produtoNome, estoqueAtual);
    return estoqueAtual;
}

// Função para atualizar o estoque de um produto
function atualizarEstoque(produtoNome, quantidade) {
    const estoque = JSON.parse(localStorage.getItem('estoque'));
    const produto = estoque.produtos.find(p => p.nome === produtoNome);
    if (produto) {
        produto.quantidade += quantidade;
        localStorage.setItem('estoque', JSON.stringify(estoque));
        console.log('Estoque atualizado para o produto:', produtoNome, produto.quantidade);
    }
}

// Função para buscar produtos por endereço
function buscarProdutosPorEndereco(endereco) {
    const estoque = JSON.parse(localStorage.getItem('estoque'));
    const produtos = estoque.produtos.filter(p => p.endereco === endereco);
    console.log('Buscando produtos por endereço:', produtos);
    return produtos;
}

// Função para adicionar um usuário
function adicionarUsuario(nome, email, numero, usuario, senha) {
    const estoque = JSON.parse(localStorage.getItem('estoque'));
    console.log('Estoque atual:', estoque);

    // Verifica se a lista de usuários existe e é um array
    if (!estoque.usuarios || !Array.isArray(estoque.usuarios)) {
        console.error('Erro: Lista de usuários não encontrada ou inválida. Inicializando lista de usuários...');
        estoque.usuarios = []; // Inicializa a lista de usuários como um array vazio
    }

    // Verifica se o usuário já existe
    const usuarioExistente = estoque.usuarios.find(u => u.usuario === usuario);
    if (usuarioExistente) {
        console.log('Usuário já existe:', usuarioExistente);
        return false;
    }

    // Adiciona o novo usuário
    estoque.usuarios.push({ nome, email, numero, usuario, senha });
    localStorage.setItem('estoque', JSON.stringify(estoque));
    console.log('Novo usuário adicionado:', { nome, email, numero, usuario, senha });
    return true;
}

// Função para verificar o login
function verificarLogin(usuario, senha) {
    const estoque = JSON.parse(localStorage.getItem('estoque'));
    console.log('Verificando login para:', usuario);

    // Verifica se a lista de usuários existe e é um array
    if (!estoque.usuarios || !Array.isArray(estoque.usuarios)) {
        console.error('Erro: Lista de usuários não encontrada ou inválida.');
        return false;
    }

    const usuarioEncontrado = estoque.usuarios.find(u => u.usuario === usuario && u.senha === senha);
    if (usuarioEncontrado) {
        console.log('Login bem-sucedido para:', usuario);
        return true;
    } else {
        console.log('Login falhou para:', usuario);
        return false;
    }
}

// Função para verificar se o usuário está autenticado
function estaAutenticado() {
    return localStorage.getItem('autenticado') === 'true';
}

// Função para definir o estado de autenticação
function definirAutenticado(autenticado) {
    localStorage.setItem('autenticado', autenticado);
    console.log('Estado de autenticação definido como:', autenticado);
}
