import {
  createPublicClient,
  createWalletClient,
  parseUnits,
  custom,
} from "https://esm.sh/viem@2.21.3";
import { sepolia } from "https://esm.sh/viem@2.21.3/chains";
import ERC20_ABI from "../abi/ERC20.js";

const contractAddress = "0xcA5E413F40946E22F507E38eED4adCa07cb0d3Ad"; // Dirección del contrato ERC20
let walletClient;
let publicClient;
let selectedAccount;
let tokenDecimals;

function showMessage(msg, isError) {
  if (typeof isError === "undefined") isError = false;
  var el = document.getElementById("messages");
  el.innerText = msg;
  el.style.color = isError ? "red" : "black";
}

// Conecta la billetera del usuario usando MetaMask
export async function connectWallet() {
  // Verificamos que exista un proveedor inyectado (MetaMask u otra wallet)
  if (window.ethereum) {
    try {
      // 1. Pedir permiso a la wallet para acceder a las cuentas
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // 2. Guardar la primera cuenta seleccionada por el usuario
      selectedAccount = accounts[0];

      // 3. Crear los clientes de viem para lectura y escritura
      walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      });

      publicClient = createPublicClient({
        chain: sepolia,
        // Usar el mismo proveedor de la wallet (MetaMask) para lecturas
        transport: custom(window.ethereum),
      });

      // 4. Mostrar la dirección conectada en el HTML
      document.getElementById("walletAddress").innerText =
        "Conectado: " + selectedAccount;
      showMessage("Billetera conectada");
    } catch (err) {
      // Error al aceptar/realizar la conexión
      showMessage("Error al conectar billetera", true);
    }
  } else {
    // No hay MetaMask u otra wallet inyectada en el navegador
    showMessage("MetaMask no detectado", true);
  }
}

export async function getTokenName() {
  if (!publicClient) {
    showMessage("Conecta la billetera primero", true);
    return;
  }
  try {
    console.log("Leyendo nombre del token...");
    var name = await publicClient.readContract({
      address: contractAddress,
      abi: ERC20_ABI,
      functionName: "name",
    });
    console.log("Nombre del token: " + name);
    document.getElementById("tokenName").innerText = "Nombre: " + name;
    showMessage("Nombre del token leído");
  } catch (err) {
    console.error(err);
    showMessage("Error al leer nombre", true);
  }
}

export async function transferToken() {
  if (!walletClient || !publicClient || !selectedAccount) {
    showMessage("Conecta la billetera primero", true);
    return;
  }
  var to = document.getElementById("toAddress").value;
  var amount = document.getElementById("amount").value.trim();
  if (!to || !amount || Number(amount) <= 0) {
    showMessage("Datos inválidos", true);
    return;
  }
  try {
    if (typeof tokenDecimals === "undefined") {
      tokenDecimals = await publicClient.readContract({
        address: contractAddress,
        abi: ERC20_ABI,
        functionName: "decimals",
      });
    }

    var amountInBaseUnits = parseUnits(amount, tokenDecimals);

    var hash = await walletClient.writeContract({
      address: contractAddress,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [to, amountInBaseUnits],
      account: selectedAccount,
    });
    showMessage("Transferencia enviada. Hash: " + hash);
  } catch (err) {
    showMessage("Error en la transferencia", true);
  }
}

// Exponer funciones al objeto global para poder usarlas con onclick en el HTML
window.connectWallet = connectWallet;
window.getTokenName = getTokenName;
window.transferToken = transferToken;

