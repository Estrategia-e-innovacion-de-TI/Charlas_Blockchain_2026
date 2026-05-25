// main.js
import {
  createPublicClient,
  createWalletClient,
  http,
  custom,
} from "https://esm.sh/viem@2.21.3";
import { sepolia } from "https://esm.sh/viem@2.21.3/chains";

// Dirección del contrato (reemplaza por la real)
const votingContractAddress = "0xA1A9Bd8CE61A3662B31A724f20C23F1E77D0Dd9a";

// Proveedor inyectado por MetaMask u otra wallet
const provider = window.ethereum;

// Cliente público para lecturas usando el RPC de la wallet
const publicClient = createPublicClient({
  chain: sepolia,
  transport: custom(provider),
});

// Cargar ABI del contrato desde el JSON compilado
async function getVotingAbi() {
  const res = await fetch("../Blockchain/abi/voting.json");
  const json = await res.json();
  return json.output.abi;
}

// Función para agregar mensajes al HTML
function appendLog(message) {
  const container = document.getElementById("viem-output");
  if (!container) return;
  const p = document.createElement("p");
  p.textContent = message;
  container.appendChild(p);
}

// Función para conectar la wallet
export async function connectWallet() {
  if (!provider) {
    alert("Instala MetaMask para continuar");
    return;
  }

  try {
    appendLog("Conectando wallet...");

    const [account] = await provider.request({
      method: "eth_requestAccounts",
    });

    appendLog(`Cuenta conectada: ${account}`);

    // Crear cliente de escritura usando MetaMask
    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: custom(window.ethereum),
    });

    console.log("Cuenta conectada:", account, walletClient);
  } catch (error) {
    console.error(error);
    appendLog(`Error al conectar: ${error?.message ?? error}`);
  }
}

// Función para agregar candidatos llamando al contrato
async function addCandidate() {
  if (!provider) {
    alert("Instala MetaMask para continuar");
    return;
  }

  const input = document.getElementById("candidate-name");
  if (!input) {
    appendLog("No se encontró el campo de nombre de candidato.");
    return;
  }

  const name = input.value.trim();
  if (!name) {
    appendLog("Ingresa un nombre de candidato antes de enviar.");
    return;
  }

  if (
    !votingContractAddress ||
    votingContractAddress === "0x1234567890123456789012345678901234567890"
  ) {
    appendLog("Configura la dirección real del contrato en main.js.");
    return;
  }

  try {
    appendLog(`Enviando transacción addCandidates("${name}")...`);

    const [account] = await provider.request({
      method: "eth_requestAccounts",
    });

    const votingAbi = await getVotingAbi();

    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: custom(window.ethereum),
    });

    const hash = await walletClient.writeContract({
      address: votingContractAddress,
      abi: votingAbi,
      functionName: "addCandidates",
      args: [name],
    });

    appendLog(`Transacción enviada. Hash: ${hash}`);
  } catch (error) {
    console.error(error);
    appendLog(`Error al agregar candidato: ${error?.message ?? error}`);
  }
}

// Función para iniciar la votación llamando al contrato
async function startVoting() {
  if (!provider) {
    alert("Instala MetaMask para continuar");
    return;
  }

  if (
    !votingContractAddress ||
    votingContractAddress === "0x1234567890123456789012345678901234567890"
  ) {
    appendLog("Configura la dirección real del contrato en main.js.");
    return;
  }

  try {
    appendLog("Enviando transacción startVoting()...");

    const [account] = await provider.request({
      method: "eth_requestAccounts",
    });

    const votingAbi = await getVotingAbi();

    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: custom(window.ethereum),
    });

    const hash = await walletClient.writeContract({
      address: votingContractAddress,
      abi: votingAbi,
      functionName: "startVoting",
      args: [],
    });

    appendLog(`Transacción startVoting enviada. Hash: ${hash}`);
  } catch (error) {
    console.error(error);
    appendLog(`Error al iniciar votación: ${error?.message ?? error}`);
  }
}

// ===== Funciones adicionales según ABI =====

// getCandidates(): string[]
async function loadCandidates() {
  if (
    !votingContractAddress ||
    votingContractAddress === "0x1234567890123456789012345678901234567890"
  ) {
    appendLog("Configura la dirección real del contrato en main.js.");
    return;
  }

  try {
    appendLog("Leyendo candidatos registrados...");

    const votingAbi = await getVotingAbi();

    const candidates = await publicClient.readContract({
      address: votingContractAddress,
      abi: votingAbi,
      functionName: "getCandidates",
      args: [],
    });

    if (!candidates || candidates.length === 0) {
      appendLog("No hay candidatos registrados.");
    } else {
      appendLog(`Candidatos: ${candidates.join(", ")}`);
    }

    return candidates;
  } catch (error) {
    console.error(error);
    appendLog(`Error al leer candidatos: ${error?.message ?? error}`);
  }
}

// vote(string candidate)
async function voteForCandidate(name) {
  if (!provider) {
    alert("Instala MetaMask para continuar");
    return;
  }

  let candidateName = name;
  if (!candidateName) {
    candidateName = prompt("Nombre del candidato a votar:");
  }
  if (!candidateName) {
    appendLog("Debes indicar un nombre de candidato para votar.");
    return;
  }

  if (
    !votingContractAddress ||
    votingContractAddress === "0x1234567890123456789012345678901234567890"
  ) {
    appendLog("Configura la dirección real del contrato en main.js.");
    return;
  }

  try {
    appendLog(`Enviando voto para "${candidateName}"...`);

    const [account] = await provider.request({
      method: "eth_requestAccounts",
    });

    const votingAbi = await getVotingAbi();

    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: custom(window.ethereum),
    });

    const hash = await walletClient.writeContract({
      address: votingContractAddress,
      abi: votingAbi,
      functionName: "vote",
      args: [candidateName],
    });

    appendLog(`Voto enviado. Hash: ${hash}`);
  } catch (error) {
    console.error(error);
    appendLog(`Error al votar: ${error?.message ?? error}`);
  }
}

// getVotes(string candidate): uint256
async function getVotesForCandidate(name) {
  let candidateName = name;
  if (!candidateName) {
    candidateName = prompt("Nombre del candidato para ver sus votos:");
  }
  if (!candidateName) {
    appendLog("Debes indicar un nombre de candidato.");
    return;
  }

  if (
    !votingContractAddress ||
    votingContractAddress === "0x1234567890123456789012345678901234567890"
  ) {
    appendLog("Configura la dirección real del contrato en main.js.");
    return;
  }

  try {
    appendLog(`Leyendo votos para "${candidateName}"...`);

    const votingAbi = await getVotingAbi();

    const votes = await publicClient.readContract({
      address: votingContractAddress,
      abi: votingAbi,
      functionName: "getVotes",
      args: [candidateName],
    });

    appendLog(`"${candidateName}" tiene ${votes.toString()} voto(s).`);
    return votes;
  } catch (error) {
    console.error(error);
    appendLog(`Error al leer votos: ${error?.message ?? error}`);
  }
}

// votingStarted(): bool
async function checkVotingStarted() {
  if (
    !votingContractAddress ||
    votingContractAddress === "0x1234567890123456789012345678901234567890"
  ) {
    appendLog("Configura la dirección real del contrato en main.js.");
    return;
  }

  try {
    const votingAbi = await getVotingAbi();

    const started = await publicClient.readContract({
      address: votingContractAddress,
      abi: votingAbi,
      functionName: "votingStarted",
      args: [],
    });

    appendLog(`¿Votación iniciada?: ${started ? "sí" : "no"}`);
    return started;
  } catch (error) {
    console.error(error);
    appendLog(`Error al leer estado de votación: ${error?.message ?? error}`);
  }
}

// hasVoted(address): bool  (por defecto, consulta la cuenta conectada)
async function checkHasVoted(addressToCheck) {
  if (
    !votingContractAddress ||
    votingContractAddress === "0x1234567890123456789012345678901234567890"
  ) {
    appendLog("Configura la dirección real del contrato en main.js.");
    return;
  }

  try {
    let addr = addressToCheck;
    if (!addr) {
      const [account] = await provider.request({
        method: "eth_requestAccounts",
      });
      addr = account;
    }

    const votingAbi = await getVotingAbi();

    const has = await publicClient.readContract({
      address: votingContractAddress,
      abi: votingAbi,
      functionName: "hasVoted",
      args: [addr],
    });

    appendLog(`La dirección ${addr} ${has ? "ya ha votado" : "no ha votado"}.`);
    return has;
  } catch (error) {
    console.error(error);
    appendLog(`Error al consultar hasVoted: ${error?.message ?? error}`);
  }
}

// owner(): address
async function getOwner() {
  if (
    !votingContractAddress ||
    votingContractAddress === "0x1234567890123456789012345678901234567890"
  ) {
    appendLog("Configura la dirección real del contrato en main.js.");
    return;
  }

  try {
    const votingAbi = await getVotingAbi();

    const owner = await publicClient.readContract({
      address: votingContractAddress,
      abi: votingAbi,
      functionName: "owner",
      args: [],
    });

    appendLog(`Owner del contrato: ${owner}`);
    return owner;
  } catch (error) {
    console.error(error);
    appendLog(`Error al leer owner: ${error?.message ?? error}`);
  }
}

// Hacer funciones accesibles al HTML / consola
window.connectWallet = connectWallet;
window.addCandidate = addCandidate;
window.startVoting = startVoting;
window.loadCandidates = loadCandidates;
window.voteForCandidate = voteForCandidate;
window.getVotesForCandidate = getVotesForCandidate;
window.checkVotingStarted = checkVotingStarted;
window.checkHasVoted = checkHasVoted;
window.getOwner = getOwner;