# Guía Paso a Paso para Replicar la DApp de Votación

Esta guía te ayudará a replicar la implementación del DApp de votación, cubriendo tanto la parte de HTML como la de JavaScript.

---

## 1. Requisitos previos
- Tener instalado [MetaMask](https://metamask.io/) en tu navegador.
- Acceso a una red de pruebas compatible (por ejemplo, Sepolia).
- Node.js y npm instalados (opcional, si deseas servir archivos localmente).
- Contrato inteligente desplegado y su ABI disponible.

---

## 2. Estructura de Archivos
Asegúrate de tener la siguiente estructura:

```
FrontEnd/
  index.html
  js/
    main.js
Blockchain/
  abi/
    voting.json
```

---

## 3. Configuración del HTML

Crea un archivo `index.html` con los siguientes elementos básicos:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Voting DApp</title>
</head>
<body>
  <h1>DApp de Votación</h1>
  <button onclick="connectWallet()">Conectar Wallet</button>
  <input id="candidate-name" placeholder="Nombre del candidato" />
  <button onclick="addCandidate()">Agregar Candidato</button>
  <button onclick="startVoting()">Iniciar Votación</button>
  <button onclick="loadCandidates()">Ver Candidatos</button>
  <button onclick="voteForCandidate()">Votar</button>
  <button onclick="getVotesForCandidate()">Ver Votos de Candidato</button>
  <button onclick="checkVotingStarted()">¿Votación Iniciada?</button>
  <button onclick="checkHasVoted()">¿Ya Voté?</button>
  <button onclick="getOwner()">Ver Owner</button>
  <div id="viem-output"></div>
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

---

## 4. Configuración del JavaScript

- El archivo principal es `js/main.js`.
- Asegúrate de que la dirección del contrato (`votingContractAddress`) y la ruta del ABI sean correctas.
- El archivo `main.js` expone funciones globales para ser usadas desde el HTML.
- Las funciones usan MetaMask para interactuar con el contrato.

---

## 5. ABI del Contrato

- El ABI debe estar en `Blockchain/abi/voting.json`.
- El archivo debe contener la salida de la compilación del contrato, especialmente la propiedad `output.abi`.

---

## 6. Pasos para Probar la DApp

1. Abre `index.html` en tu navegador (preferiblemente usando un servidor local).
2. Haz clic en "Conectar Wallet" y autoriza MetaMask.
3. Usa los botones para agregar candidatos, iniciar la votación, votar, consultar votos, etc.
4. Observa los mensajes y resultados en el área de salida (`viem-output`).

---

## 7. Notas Adicionales

- Si cambias la red o el contrato, actualiza la dirección y el ABI en el frontend.
- Usa la consola del navegador para depuración avanzada (los mensajes de `console.log` solo se ven ahí).
- Si tienes errores de CORS, usa un servidor local para servir los archivos (por ejemplo, con `npx serve`).

---

¡Listo! Ahora puedes replicar y adaptar la DApp de votación según tus necesidades.
