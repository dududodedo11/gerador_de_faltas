let selectedOrders = [];
let products = {};
let pedidos = [];
let pagina = 1;
let idLoja = "not_found";
let idSituacao = "not_found";

async function getOrders(pagina = 1, idLoja = "not_found", idSituacao = "not_found") {
    let appApi = APP_URL + `api-bling/getOrders?pagina=${pagina}&idLoja=${idLoja}&idSituacao=${idSituacao}`;

    try {
        const response = await fetch(appApi, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Erro na resposta da requisição');
        }

        const data = await response.json();

        return data;
    } catch (error) {
        alert("Erro ao buscar os pedidos.");
        console.log(error);
    }
}

function insertOrders(pedidos) {
    document.getElementById("t-body-orders").innerHTML = "";

    pedidos.forEach(pedido => {
        let tableRow = document.createElement("tr");

        let checkboxTd = document.createElement("td");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("form-check-input");
        checkbox.value = pedido.id;

        checkboxTd.appendChild(checkbox);
        tableRow.appendChild(checkboxTd);

        if (selectedOrders.includes(checkbox.value)) {
            checkbox.checked = true;
        }

        let numero = document.createElement("td");
        numero.innerHTML = pedido.numero;

        dataArray = pedido.data.split("-");

        let data = document.createElement("td");
        data.innerHTML = dataArray[2] + "/" + dataArray[1] + "/" + dataArray[0];

        let cliente = document.createElement("td");
        cliente.innerHTML = pedido.cliente;

        let valor = document.createElement("td");
        valor.innerHTML = pedido.valor;

        let situacoes = {
            "6": "Em aberto",
            "9": "Atendido",
            "12": "Cancelado",
        }

        let situacao = document.createElement("td");
        situacao.innerHTML = situacoes[pedido.situacao] ?? pedido.situacao;

        tableRow.appendChild(numero);
        tableRow.appendChild(data);
        tableRow.appendChild(cliente);
        tableRow.appendChild(valor);
        tableRow.appendChild(situacao);

        document.getElementById("t-body-orders").appendChild(tableRow);
    });
}

function saveOrdersSelected() {
    const selectedCheckboxes = document.querySelectorAll("#t-body-orders input[type='checkbox']");

    selectedCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            if (!selectedOrders.includes(checkbox.value)) {
                selectedOrders.push(checkbox.value);
            }
        } else {
            selectedOrders = selectedOrders.filter(order => order !== checkbox.value);
        }
    });
};

async function getOrder(idOrder = "not_found") {
    let appApi = APP_URL + `api-bling/getProducts?idOrder=${idOrder}`;

    try {
        const response = await fetch(appApi, {
            method: 'GET'
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro na resposta da requisição');
        }

        const data = await response.json();

        return data;
    } catch (error) {
        alert("Erro ao buscar os pedidos.");
        console.log(error);
        // Garante que o carregamento seja ocultado mesmo em erro
        document.getElementById("loading-content-orders").style.display = "none";
    }
}

const progressBar = document.getElementById("progressBar");

async function fetchOrdersWithProgress(selectedOrders) {
    let completed = 0;
    const total = selectedOrders.length;


    const updateProgress = () => {
        completed++;
        progressBar.value = (completed / total) * 100;
    };

    const promises = selectedOrders.map(async (order) => {
        const result = await getOrder(order);
        updateProgress();
        return result;
    });

    const results = await Promise.allSettled(promises);

    return results;
}

const loadingText = document.getElementById("loadingText");

function removeAllContents() {
    document.getElementById("loading-content-orders").style.display = "none";
    document.getElementById("loading-progress-bar").style.display = "none";
    document.getElementById("orders-content").style.display = "none";
    document.getElementById("orders-2-content").style.display = "none";
    document.getElementById("orders-3-content").style.display = "none";
    document.getElementById("btn-create-list").style.display = "none";
}

function callLoading() {
    document.getElementById("loading-content-orders").style.display = "block";
}

async function completeFornecedor(idProduct = "not_found") {

    let appApi = APP_URL + `api-bling/completeFornecedor?idProduct=${idProduct}`;

    try {
        const response = await fetch(appApi, {
            method: 'GET'
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro na resposta da requisição');
        }

        const data = await response.json();

        return data;
    } catch (error) {
        alert("Erro ao buscar os pedidos.");
        console.log(error);
        // Garante que o carregamento seja ocultado mesmo em erro
        document.getElementById("loading-content-orders").style.display = "none";
    }
}

function atualizarSelecaoPedidos() {
    let selectedOrdersTemporario = [];

    document.querySelectorAll("#t-body-orders input[type='checkbox']").forEach(checkbox => {
        if (checkbox.checked) {
            if (!selectedOrders.includes(checkbox.value)) {
                selectedOrdersTemporario.push(1);
            }
        } else {
            if (selectedOrders.includes(checkbox.value)) {
                selectedOrdersTemporario.push(-1);
            }
        }
    });

    let somaTemporaria = 0;

    selectedOrdersTemporario.forEach(item => {
        somaTemporaria += item;
    });


    document.getElementById("pedidos-selecionados").innerHTML = selectedOrders.length + somaTemporaria;
    document.getElementById("btn-return-content-2").disabled = true;
}

document.getElementById("btn-return-options").addEventListener("click", function () {
    removeAllContents();
    callLoading();
    window.location.href = APP_URL + "gerador-de-faltas";
});


document.getElementById("option-1").addEventListener("click", async function () {
    pedidos.length = 0;

    document.getElementById("content-0").style.display = "none";
    document.getElementById("content-1").style.display = "block";

    removeAllContents();
    callLoading();

    pedidos = await getOrders(pagina, idLoja, idSituacao);
    insertOrders(pedidos);

    document.getElementById("current-page").innerHTML = pagina;

    document.getElementById("loading-content-orders").style.display = "none";
    document.getElementById("orders-content").style.display = "block";

    document.getElementById("page-previous-orders").classList.add("disabled");
    document.getElementById("btn-return-content-2").style.display = "none";

    document.querySelectorAll("#t-body-orders input[type='checkbox']").forEach(checkbox => {
        checkbox.addEventListener("change", atualizarSelecaoPedidos);
    });

    document.getElementById("form-check-all").addEventListener("click", function () {
        const checkboxes = document.querySelectorAll("#t-body-orders input[type='checkbox']");
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    document.getElementById("button-orders-bling").addEventListener("click", async function () {
        if (!this.classList.contains("active")) {
            idLoja = 0;
            pedidos = [];
            document.getElementById("loading-content-orders").style.display = "block";
            document.getElementById("orders-content").style.display = "none";

            saveOrdersSelected();

            document.getElementById("t-body-orders").innerHTML = "";
            pedidos = await getOrders(pagina, idLoja, idSituacao);
            insertOrders(pedidos);

            this.classList.add("active");

            document.querySelectorAll("#t-body-orders input[type='checkbox']").forEach(checkbox => {
                checkbox.addEventListener("change", atualizarSelecaoPedidos);
            });

            document.getElementById("loading-content-orders").style.display = "none";
            document.getElementById("orders-content").style.display = "block";
        } else {
            idLoja = "not_found";
            pedidos = [];
            document.getElementById("loading-content-orders").style.display = "block";
            document.getElementById("orders-content").style.display = "none";

            saveOrdersSelected();

            document.getElementById("t-body-orders").innerHTML = "";
            pedidos = await getOrders(pagina, idLoja, idSituacao);
            insertOrders(pedidos);

            this.classList.remove("active");

            document.querySelectorAll("#t-body-orders input[type='checkbox']").forEach(checkbox => {
                checkbox.addEventListener("change", atualizarSelecaoPedidos);
            });

            document.getElementById("loading-content-orders").style.display = "none";
            document.getElementById("orders-content").style.display = "block";
        }
    });

    document.getElementById("situacao-order").addEventListener("change", async function () {
        idSituacao = this.value;
        pedidos = [];

        document.getElementById("loading-content-orders").style.display = "block";
        document.getElementById("orders-content").style.display = "none";

        saveOrdersSelected();

        document.getElementById("t-body-orders").innerHTML = "";
        pedidos = await getOrders(pagina, idLoja, idSituacao);
        insertOrders(pedidos);

        document.querySelectorAll("#t-body-orders input[type='checkbox']").forEach(checkbox => {
            checkbox.addEventListener("change", atualizarSelecaoPedidos);
        });

        document.getElementById("loading-content-orders").style.display = "none";
        document.getElementById("orders-content").style.display = "block";
    });

    document.querySelector("#page-previous-orders a").addEventListener("click", async function () {
        if (pagina == 2) {
            document.getElementById("page-previous-orders").classList.add("disabled");
        }

        if (pagina > 1) {
            pagina--;
            pedidos = [];

            document.getElementById("loading-content-orders").style.display = "block";
            document.getElementById("orders-content").style.display = "none";

            saveOrdersSelected();

            document.getElementById("t-body-orders").innerHTML = "";
            pedidos = await getOrders(pagina, idLoja, idSituacao);
            insertOrders(pedidos);


            document.getElementById("current-page").innerHTML = pagina;

            document.querySelectorAll("#t-body-orders input[type='checkbox']").forEach(checkbox => {
                checkbox.addEventListener("change", atualizarSelecaoPedidos);
            });

            document.getElementById("loading-content-orders").style.display = "none";
            document.getElementById("orders-content").style.display = "block";
        }
    });

    document.querySelector("#page-next-orders a").addEventListener("click", async function () {
        pagina++;
        pedidos = [];

        document.getElementById("loading-content-orders").style.display = "block";
        document.getElementById("orders-content").style.display = "none";

        saveOrdersSelected();

        document.getElementById("t-body-orders").innerHTML = "";
        pedidos = await getOrders(pagina, idLoja, idSituacao);
        insertOrders(pedidos);


        document.getElementById("current-page").innerHTML = pagina;

        document.getElementById("page-previous-orders").classList.remove("disabled");

        document.querySelectorAll("#t-body-orders input[type='checkbox']").forEach(checkbox => {
            checkbox.addEventListener("change", atualizarSelecaoPedidos);
        });

        document.getElementById("loading-content-orders").style.display = "none";
        document.getElementById("orders-content").style.display = "block";
    });
});

document.getElementById("btn-return-content-2").addEventListener("click", async function () {
    document.getElementById("orders-2-content").style.display = "block";
    document.getElementById("btn-create-list").style.display = "block";
    document.getElementById("orders-content").style.display = "none";
});

document.getElementById("btn-return-selected-orders").addEventListener("click", async function () {
    document.getElementById("btn-return-content-2").style.display = "block";
    document.getElementById("btn-return-content-2").disabled = false;
    document.getElementById("orders-content").style.display = "block";
    document.getElementById("orders-2-content").style.display = "none";
    document.getElementById("btn-create-list").style.display = "none";
});

document.getElementById("btn-submit-orders").addEventListener("click", async function () {

    document.getElementById("loading-progress-bar").style.display = "block";
    document.getElementById("orders-content").style.display = "none";

    let dots = 3;

    const interval = setInterval(() => {
        if (dots > 6) {
            dots = 2;
        } else {
            dots++;
        }

        loadingText.innerHTML = "Carregando" + ".".repeat(dots);
    }, 500);

    saveOrdersSelected();

    document.querySelectorAll(".div-order").forEach((divOrder) => {
        divOrder.remove();
    });

    document.querySelectorAll("#orders-2-content hr").forEach((hr) => {
        hr.remove();
    });

    const ordersToSearch = (await fetchOrdersWithProgress(selectedOrders))
        .filter(order => order.status === "fulfilled")
        .map(order => order.value);

    let divOrderModel = document.querySelector(".div-order-model");
    let divPaiProductsModel = document.querySelector(".div-pai-products-model");

    let dataRow = 0;

    ordersToSearch.forEach((order) => {
        let divOrder = divOrderModel.cloneNode(true);
        divOrder.classList.remove("div-order-model");
        divOrder.classList.add("div-order");

        divOrder.querySelector(".title-order").innerHTML = order.cliente;

        order.produtos.forEach((product, index) => {
            if (product.idProduct == 0) {
                return;
            }

            let divProduct = divPaiProductsModel.cloneNode(true);
            divProduct.classList.remove("div-pai-products-model");
            divProduct.classList.add("div-pai-products");

            divProduct.querySelector(".index-product").innerHTML = index + 1;

            divProduct.querySelector(".input-nome").value = product.nome;

            divProduct.querySelector(".input-codigo").value = product.codigo;

            divProduct.querySelector(".input-unidade").value = product.unidade;

            divProduct.querySelector(".input-quantidade").value = product.quantidade;

            divProduct.querySelector(".input-id").value = "#" + product.idProduct;

            dataRow++;
            divProduct.querySelector(".icon-trash").dataset.row = dataRow;
            divProduct.dataset.row = dataRow;

            products[dataRow] = {
                idProduct: product.idProduct,
                nome: product.nome,
                codigo: product.codigo,
                unidade: product.unidade,
                quantidade: product.quantidade,
                idOrder: order.id,
                idFornecedor: null,
                fornecedor: null,
            };

            divProduct.style.display = "block";
            divOrder.appendChild(divProduct);
        });

        divOrder.style.display = "block";
        let hr = document.createElement("hr");
        hr.classList.add("my-5");

        document.getElementById("orders-2-content").appendChild(divOrder);
        document.getElementById("orders-2-content").appendChild(hr);
    });

    document.querySelectorAll(".input-nome").forEach(input => {
        input.addEventListener("input", function (event) {
            let row = event.target.closest(".div-pai-products").dataset.row;
            products[row].nome = event.target.value;
            document.getElementById("btn-return-content-3").disabled = true;
        });
    });

    document.querySelectorAll(".input-codigo").forEach(input => {
        input.addEventListener("input", function (event) {
            let row = event.target.closest(".div-pai-products").dataset.row;
            products[row].codigo = event.target.value;
            document.getElementById("btn-return-content-3").disabled = true;
        });
    });

    document.querySelectorAll(".input-unidade").forEach(input => {
        input.addEventListener("input", function (event) {
            let row = event.target.closest(".div-pai-products").dataset.row;
            products[row].unidade = event.target.value;
            document.getElementById("btn-return-content-3").disabled = true;
        });
    });

    document.querySelectorAll(".input-quantidade").forEach(input => {
        input.addEventListener("input", function (event) {
            let row = event.target.closest(".div-pai-products").dataset.row;
            products[row].quantidade = event.target.value;
            document.getElementById("btn-return-content-3").disabled = true;
        });
    });

    document.querySelectorAll(".icon-trash").forEach(icon => {
        icon.addEventListener("click", function (event) {
            let row = event.target.dataset.row;
            delete products[row];
            document.querySelector(".div-order [data-row='" + row + "']").remove();
            document.getElementById("btn-return-content-3").disabled = true;
        });
    });

    document.getElementById("btn-return-content-3").style.display = "none";
    document.getElementById("loading-progress-bar").style.display = "none";
    document.getElementById("orders-2-content").style.display = "block";
    document.getElementById("btn-create-list").style.display = "block";

    clearInterval(interval);
    loadingText.innerHTML = "Carregando...";
    progressBar.value = 0;
});

document.getElementById("btn-return-content-3").addEventListener("click", async function () {
    document.getElementById("orders-2-content").style.display = "none";
    document.getElementById("btn-create-list").style.display = "none";
    document.getElementById("orders-3-content").style.display = "block";
});

document.getElementById("btn-return-modify-orders").addEventListener("click", async function () {
    document.getElementById("btn-return-content-3").style.display = "block";
    document.getElementById("btn-return-content-3").disabled = false;

    document.getElementById("orders-2-content").style.display = "block";
    document.getElementById("btn-create-list").style.display = "block";

    document.getElementById("orders-3-content").style.display = "none";
});

document.getElementById("btn-create-list").addEventListener("click", async function () {
    removeAllContents();
    document.getElementById("loading-progress-bar").style.display = "block";

    document.querySelectorAll("#orders-3-content div").forEach(div => {
        div.remove();
    });

    document.querySelectorAll("#orders-3-content hr").forEach(hr => {
        hr.remove();
    });

    let uniqueFornecedores = new Set();

    let dots = 3;

    const interval = setInterval(() => {
        if (dots > 6) {
            dots = 3;
        } else {
            dots++;
        }

        loadingText.innerHTML = "Carregando" + ".".repeat(dots);
    }, 500);

    const total = Object.keys(products).length;
    let completed = 0;

    await Promise.all(Object.entries(products).map(async (chave) => {
        let idProduct = products[chave[0]].idProduct;
        let fornecedorResponse = await completeFornecedor(idProduct);

        products[chave[0]].fornecedor = fornecedorResponse.nomeFornecedor;
        products[chave[0]].idFornecedor = fornecedorResponse.idFornecedor;

        uniqueFornecedores.add(fornecedorResponse.idFornecedor);

        // Atualiza a barra de progresso
        completed++;
        progressBar.value = (completed / total) * 100;
    }));

    let ContentThree = document.getElementById("orders-3-content");

    uniqueFornecedores.forEach(async (idFornecedor) => {
        let filteredProducts = Object.entries(products)
            .filter(([key, product]) => product.idFornecedor === idFornecedor)
            .reduce((obj, [key, product]) => {
                obj[key] = product;
                return obj;
            }, {});

        let productMap = {};

        // Itera sobre os produtos e agrupa pelo código
        Object.values(filteredProducts).forEach(product => {
            const codigo = product.codigo;
    
            // Se o código já existir no map, soma a quantidade
            if (productMap[codigo]) {
                productMap[codigo].quantidade += product.quantidade;
            } else {
                // Se não existir, adiciona o produto
                productMap[codigo] = { ...product };
            }
        });

        console.log(productMap);

        let message = "";

        for (let product in productMap) {
            message += productMap[product].nome + " = " + productMap[product].quantidade + " " + productMap[product].unidade + "\n";
        }

        let divFornecedor = document.createElement("div");
        divFornecedor.classList.add("mb-3", "border", "border-primary", "rounded", "p-3", "w-100");

        let title = document.createElement("p");
        title.classList.add("h2", "mb-3");
        title.innerHTML = productMap[Object.keys(productMap)[0]].fornecedor;

        divFornecedor.appendChild(title);

        let textArea = document.createElement("textarea");
        textArea.classList.add("form-control");
        textArea.rows = Object.keys(productMap).length + 1;
        textArea.value = message;

        divFornecedor.appendChild(textArea);

        ContentThree.appendChild(divFornecedor);
        ContentThree.appendChild(document.createElement("hr"));
    });

    let lastHr = ContentThree.lastChild;
    lastHr.remove();

    document.getElementById("loading-progress-bar").style.display = "none";
    document.getElementById("orders-3-content").style.display = "block";

    clearInterval(interval);
    loadingText.innerHTML = "Carregando...";
    progressBar.value = 0;
});