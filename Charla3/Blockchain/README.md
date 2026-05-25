## Contratos desplegados — Sepolia

| Contrato | Dirección |
|---|---|
| MockERC20 | [0x387D2b86415fb38a1290Ae58Cf75fa46E07C93aC](https://sepolia.etherscan.io/address/0x387D2b86415fb38a1290Ae58Cf75fa46E07C93aC) |
| Marketplace | [0x627aDaC5b38f52D92C3CcE6b25e9257B9B973A44](https://sepolia.etherscan.io/address/0x627aDaC5b38f52D92C3CcE6b25e9257B9B973A44) |
| MyNFT (demo) | [0xD1ebb3142Ec74FC00A2A36d659F4B78d76c34949](https://sepolia.etherscan.io/address/0xD1ebb3142Ec74FC00A2A36d659F4B78d76c34949) |

---

## Cómo subir la imagen del NFT con Pinata

### Opción A — Un solo NFT (token #0)

1. Sube la imagen en Pinata → **"Upload → File"** → copia el CID de la imagen.
2. Crea un archivo sin extensión llamado `0` con este contenido:
   ```json
   {
     "name": "Mi NFT",
     "description": "Descripción",
     "image": "https://gateway.pinata.cloud/ipfs/CID_IMAGEN"
   }
   ```
3. Sube **una carpeta** que contenga solo ese archivo `0` → **"Upload → Folder"** → copia el CID de la carpeta.
4. Llama a `setBaseURI("https://gateway.pinata.cloud/ipfs/CID_CARPETA/")`.
5. Llama a `mint(tuDireccion)`.
6. `tokenURI(0)` devolverá `https://gateway.pinata.cloud/ipfs/CID_CARPETA/0` ✓

---

### Opción B — Colección dinámica (múltiples NFTs)

La estructura de carpetas debe ser:

```
imagenes/
  0.png
  1.png
  2.png
  ...

metadata/
  0
  1
  2
  ...
```

#### Paso 1 — Subir carpeta de imágenes
1. Crea una carpeta local `imagenes/` con las imágenes nombradas `0.png`, `1.png`, `2.png`, etc.
2. En Pinata → **"Upload → Folder"** → sube `imagenes/`.
3. Copia el **CID de la carpeta de imágenes** (ej: `QmImgFolder...`).

#### Paso 2 — Crear carpeta de metadata
Crea una carpeta local `metadata/` con archivos sin extensión `0`, `1`, `2`, etc.:

```json
// archivo: metadata/0
{
  "name": "NFT #0",
  "description": "Descripción del NFT cero",
  "image": "https://gateway.pinata.cloud/ipfs/QmImgFolder/0.png"
}
```

```json
// archivo: metadata/1
{
  "name": "NFT #1",
  "description": "Descripción del NFT uno",
  "image": "https://gateway.pinata.cloud/ipfs/QmImgFolder/1.png"
}
```

> Repite para cada NFT, incrementando el número.

#### Paso 3 — Subir carpeta de metadata
1. En Pinata → **"Upload → Folder"** → sube `metadata/`.
2. Copia el **CID de la carpeta de metadata** (ej: `QmMetaFolder...`).

#### Paso 4 — Configurar el contrato
```
setBaseURI("https://gateway.pinata.cloud/ipfs/QmMetaFolder/")
```

> ⚠️ La `/` al final es obligatoria.

#### Resultado
| Llamada | URL resultante |
|---|---|
| `tokenURI(0)` | `https://gateway.pinata.cloud/ipfs/QmMetaFolder/0` |
| `tokenURI(1)` | `https://gateway.pinata.cloud/ipfs/QmMetaFolder/1` |
| `tokenURI(2)` | `https://gateway.pinata.cloud/ipfs/QmMetaFolder/2` |

#### Paso 5 — Mintear
```
mint(direccionParticipante1)  → token #0
mint(direccionParticipante2)  → token #1
mint(direccionParticipante3)  → token #2
```

---

## Flujo completo en el marketplace

```
1. make deploy-nft               → despliega tu MyNFT
2. Subir imágenes y metadata a Pinata (Opción A o B)
3. setBaseURI(urlCarpetaMetadata/)
4. mint(tuDireccion)             → mintea token(s)
5. Abrir el front                → conectar wallet
6. "Mis NFTs" → pegar tu contrato NFT → cargar
7. Clic en "Listar en venta"     → ingresar precio en MOCK → confirmar
8. Otra wallet → "Faucet"        → obtener MOCK → comprar tu NFT
```

---

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
