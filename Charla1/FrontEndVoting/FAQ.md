# Preguntas frecuentes sobre el FrontEnd (main.js)

**Pregunta:** ¿Qué significan las líneas:
import {
  createPublicClient,
  createWalletClient,
  http,
  custom,
} from "https://esm.sh/viem@2.21.3";
**Respuesta:**
Estas líneas importan funciones y utilidades de la librería Viem, que permite interactuar con contratos inteligentes en Ethereum desde el navegador. Cada elemento tiene un propósito:
- `createPublicClient`: Crea un cliente para leer datos públicos de la blockchain (consultas, lecturas).
- `createWalletClient`: Crea un cliente para enviar transacciones usando una wallet (como MetaMask).
- `http`: Permite definir un transporte HTTP para conectar con nodos Ethereum.
- `custom`: Permite definir un transporte personalizado, por ejemplo, usando el proveedor inyectado por MetaMask.
La importación se realiza desde un CDN (esm.sh) para usar la librería directamente en el navegador, sin instalar paquetes.

**Pregunta:** ¿Qué significan las líneas:
// Cliente público para lecturas usando el RPC de la wallet
const publicClient = createPublicClient({
  chain: sepolia,
  transport: custom(provider),
});

**Respuesta:**
Estas líneas crean un cliente público (`publicClient`) usando la librería Viem, configurado para interactuar con la blockchain de Sepolia a través del proveedor de la wallet (por ejemplo, MetaMask). El cliente permite realizar lecturas (consultas) al contrato inteligente, como obtener candidatos o votos, sin necesidad de enviar transacciones. El parámetro `chain: sepolia` indica la red a usar, y `transport: custom(provider)` utiliza el proveedor inyectado por la wallet para conectarse al nodo de Ethereum.

**Pregunta:** ¿Cómo se hace una lectura de un contrato con Viem?

**Respuesta y ejemplo:**
Para leer datos de un contrato (por ejemplo, obtener candidatos), se usa el método `readContract` del cliente público:

```js
const candidates = await publicClient.readContract({
  address: votingContractAddress, // Dirección del contrato
  abi: votingAbi,                 // ABI del contrato
  functionName: "getCandidates", // Nombre de la función
  args: [],                       // Argumentos (vacío si no requiere)
});
console.log(candidates); // Muestra los candidatos
```

// Comentario: Esta operación no requiere gas ni firma, solo consulta datos públicos.

**Pregunta:** ¿Cómo se hace una escritura (transacción) en un contrato con Viem?

**Respuesta y ejemplo:**
Para escribir (modificar datos) en el contrato, se usa el método `writeContract` del cliente de wallet. Por ejemplo, para agregar un candidato:

```js
const hash = await walletClient.writeContract({
  address: votingContractAddress, // Dirección del contrato
  abi: votingAbi,                 // ABI del contrato
  functionName: "addCandidates", // Nombre de la función
  args: ["Nombre"],              // Argumentos (nombre del candidato)
});
console.log(hash); // Hash de la transacción enviada
```

// Comentario: Esta operación requiere que el usuario firme la transacción y consume gas.
// El hash permite rastrear el estado de la transacción en la blockchain.

**Pregunta:** ¿Cómo se usa el cliente de MetaMask en Viem?

**Respuesta y ejemplo:**
Para usar MetaMask como cliente en Viem, se utiliza el proveedor inyectado por la wallet (`window.ethereum`) junto con el método `custom` de Viem. Así se puede crear un cliente de wallet para enviar transacciones:

```js
const provider = window.ethereum; // Proveedor inyectado por MetaMask

const [account] = await provider.request({
  method: "eth_requestAccounts",
});

const walletClient = createWalletClient({
  account,                // Cuenta conectada
  chain: sepolia,         // Red a usar
  transport: custom(provider), // Usa MetaMask como transporte
});
```

// Comentario: Este cliente permite firmar y enviar transacciones usando la cuenta de MetaMask.
// Es necesario que el usuario autorice la conexión y la transacción.

**Pregunta:** ¿Qué es el ABI del contrato y por qué es necesario?

**Respuesta:**
El ABI (Application Binary Interface) es una descripción en formato JSON de las funciones, eventos y estructuras de un contrato inteligente. Define cómo interactuar con el contrato desde aplicaciones externas, especificando los nombres de funciones, tipos de parámetros y valores de retorno.

Es necesario porque las librerías como Viem, ethers.js o web3.js usan el ABI para saber cómo construir llamadas y transacciones hacia el contrato. Sin el ABI, no se puede invocar funciones ni leer datos del contrato desde el frontend, ya que no se conoce la estructura ni los métodos disponibles.
