// ==========================================
// FASE 2: Configuración Inicial
// ==========================================
const CONTRACT_ADDRESS = "";
const CONTRACT_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function decimals() view returns (uint8)"
];

let provider;
let signer;
let contract;

// Referencias al DOM
const btnConnect = document.getElementById("btnConnect");
const walletAddress = document.getElementById("walletAddress");
const tokenBalance = document.getElementById("tokenBalance");
const btnRefresh = document.getElementById("btnRefresh");
const transferForm = document.getElementById("transferForm");
const toAddressInput = document.getElementById("toAddress");
const amountInput = document.getElementById("amount");
const btnTransfer = document.getElementById("btnTransfer");
const txStatus = document.getElementById("txStatus");
const nombreToken = document.getElementById('nombreToken');

// ==========================================
// FASE 3: Conexión a MetaMask
// ==========================================
async function connectWallet() {
    if (window.ethereum) {
        try {
            // Inicializar proveedor usando Ethers v6
            provider = new ethers.BrowserProvider(window.ethereum);

            // Solicitar permisos al usuario
            await provider.send("eth_requestAccounts", []);

            // Obtener el firmante (cuenta conectada)
            signer = await provider.getSigner();
            const address = await signer.getAddress();

            // Actualizar UI
            walletAddress.innerText = `Conectado: ${address.slice(0, 6)}...${address.slice(-4)}`;
            btnConnect.innerText = "Billetera Conectada";
            btnConnect.disabled = true;

            // Habilitar controles
            btnRefresh.disabled = false;
            toAddressInput.disabled = false;
            amountInput.disabled = false;
            btnTransfer.disabled = false;

            // Inicializar el contrato y leer balance automáticamente
            initContract();
        } catch (error) {
            console.error("Error conectando:", error);
            alert("Se rechazó la conexión a la billetera.");
        }
    } else {
        alert("Por favor instala MetaMask para usar esta dApp.");
    }
}

// ==========================================
// FASE 4: Lectura de Datos (Smart Contract)
// ==========================================
async function initContract() {
    // Instanciamos el contrato conectándolo al signer para lectura y escritura
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    await updateBalance();
}

async function updateBalance() {
    try {
        txStatus.innerText = "Cargando balance...";
        const address = await signer.getAddress();

        // Llamar a balanceOf
        const rawBalance = await contract.balanceOf(address);

        // Formatear considerando 18 decimales (estándar ERC20)
        const formattedBalance = ethers.formatUnits(rawBalance, 18);

        tokenBalance.innerText = formattedBalance;
        txStatus.innerText = "";

    } catch (error) {
        console.error("Error leyendo balance:", error);
        txStatus.innerText = "Error leyendo el balance.";
    }
}

// ==========================================
// FASE 5: Ejecución de Transacciones
// ==========================================
async function transferTokens(e) {
    e.preventDefault(); // Evita que recargue la página

    const to = toAddressInput.value;
    const amount = amountInput.value;

    try {
        txStatus.innerText = "Aprobando transacción en MetaMask...";
        txStatus.style.color = "#000";

        // Convertir el número a su formato en WEI (con 18 decimales)
        const parsedAmount = ethers.parseUnits(amount, 18);

        // Enviar la transacción a la blockchain
        const tx = await contract.transfer(to, parsedAmount);

        txStatus.innerText = `Transacción enviada. Esperando confirmación... (Hash: ${tx.hash.slice(0,10)}...)`;

        // Esperar a que se mine en un bloque
        await tx.wait();

        txStatus.innerText = "¡Transferencia exitosa!";
        txStatus.style.color = "green";

        // Limpiar formulario y actualizar balance
        transferForm.reset();
        await updateBalance();

    } catch (error) {
        console.error("Error en la transferencia:", error);
        txStatus.innerText = "Transacción fallida o rechazada.";
        txStatus.style.color = "red";
    }
}

// Asignar eventos a los botones
btnConnect.addEventListener("click", connectWallet);
btnRefresh.addEventListener("click", updateBalance);
transferForm.addEventListener("submit", transferTokens);
