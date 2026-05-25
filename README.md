# Despliegue de un Smart Contract en Sepolia usando Remix

## Dependencias necesarias antes de iniciar

- **Navegador moderno**: Chrome, Brave, Edge o Firefox actualizados.
- **MetaMask** (extensión de navegador) conectada a Sepolia  
  - Descarga: https://metamask.io
- **Cuenta en un proveedor RPC para Sepolia** (para que el FrontEnd pueda hablar con la red)  
  - Infura: https://www.infura.io  
  - Alchemy: https://www.alchemy.com
- **ETH de prueba en la red Sepolia**  
  - Faucet oficial de Sepolia (ejemplo): https://sepolia-faucet.pk910.de  
  - Faucet de Chainlink: https://faucets.chain.link/sepolia
- **Remix IDE** para compilar y desplegar el contrato  
  - Web: https://remix.ethereum.org
- **Librería viem en el FrontEnd (por CDN)**  
  - Documentación: https://viem.sh/docs/getting-started  
  - Ejemplo de import en el FrontEnd: `https://esm.sh/viem@2.21.3`

Con todo lo anterior listo (MetaMask instalada y con fondos de prueba, RPC configurado y contrato desplegado), puedes seguir los pasos siguientes.

## Pasos:

1. Abre [Remix IDE](https://remix.ethereum.org/) en tu navegador.

2. Crea un nuevo archivo para tu Smart Contract.

    ![](./Guia/video/createFile.gif)

3. Escribe o copia el código de tu Smart Contract en el archivo.
    
    ![](./Guia/Imagen/1.png)

4. Compila el contrato en Remix (Este paso la herramientas lo hace de manera autamatica al guardar los cambios, `ctrl + s`).

5. En la pestaña "Deploy & Run Transactions", selecciona "Injected Provider - MetaMask" en el menú desplegable de "Environment".


6. Conecta MetaMask a la red Sepolia.

    ![](./Guia/video/Conect.gif)

7. Asegúrate de tener ETH de prueba en tu cuenta de Sepolia.

8. Selecciona tu contrato en el menú desplegable de "Contract".

9.  Si tu contrato requiere parámetros en el constructor, introdúcelos.

10. Haz clic en "Deploy" y confirma la transacción en MetaMask.

    ![](./Guia/video/deploy.gif)

11. Espera a que la transacción se confirme en la red Sepolia.

12. Una vez desplegado, copia la dirección del contrato para futuras interacciones.

    ![](./Guia/Imagen/2.png)

    *   Con el contrato desplegado, podemos interactuar con él y sus funciones expuestas desde Remix.
  
    ![](./Guia/Imagen/3.png)

## Notas adicionales:

- Asegúrate de tener suficiente ETH de prueba en Sepolia para cubrir los gastos de despliegue.
- Verifica que estás conectado a la red Sepolia antes de desplegar.
- Guarda la dirección del contrato desplegado para interactuar con él posteriormente.

## Gateways públicos de IPFS

Si subes el frontend a IPFS como carpeta, puedes probar el contenido HTML desde gateways públicos distintos al de Pinata.

- `https://ipfs.io/ipfs/<CID>/`
- `https://dweb.link/ipfs/<CID>/`
- `https://w3s.link/ipfs/<CID>/`

Si quieres abrir un archivo específico dentro del CID, por ejemplo `index.html`, usa este formato:

- `https://ipfs.io/ipfs/<CID>/index.html`
- `https://dweb.link/ipfs/<CID>/index.html`
- `https://w3s.link/ipfs/<CID>/index.html`

Ejemplo con el CID actual del frontend ERC20:

- `https://ipfs.io/ipfs/bafybeiexkp6dgwwnt5qcvczldpdyh3tgsy254f7ee5c6ljxnn4seot2xsi/`
- `https://dweb.link/ipfs/bafybeiexkp6dgwwnt5qcvczldpdyh3tgsy254f7ee5c6ljxnn4seot2xsi/`
- `https://w3s.link/ipfs/bafybeiexkp6dgwwnt5qcvczldpdyh3tgsy254f7ee5c6ljxnn4seot2xsi/`

Nota:

- El gateway público de Pinata puede bloquear contenido HTML en planes gratuitos.
- Si una URL no responde de inmediato, puede deberse a propagación o caché del contenido en la red IPFS.