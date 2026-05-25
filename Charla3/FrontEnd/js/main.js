import { createPublicClient, createWalletClient, custom, http, formatUnits, parseUnits } from 'https://esm.sh/viem@2.21.3';
import { sepolia } from 'https://esm.sh/viem@2.21.3/chains';
import { MockERC20ABI } from '../abi/MockERC20.js';
import { MarketplaceABI } from '../abi/Marketplace.js';
import { ERC721MinABI } from '../abi/ERC721min.js';

// ── Configura estas direcciones después de desplegar ─────────────────────────
const MOCK_ERC20_ADDRESS  = '0x387D2b86415fb38a1290Ae58Cf75fa46E07C93aC';
const MARKETPLACE_ADDRESS = '0x627aDaC5b38f52D92C3CcE6b25e9257B9B973A44';
const IPFS_GATEWAY        = 'https://gateway.pinata.cloud/ipfs/';
const RPC_URL             = 'https://sepolia.infura.io/v3/1da962ce16174f76bc75c5cca27dd019';

// ── Estado global ─────────────────────────────────────────────────────────────
let publicClient, walletClient, account;
let pendingListNft = null; // { nftContract, tokenId, name }

// ── Clientes Viem ─────────────────────────────────────────────────────────────
function buildPublicClient() {
  return createPublicClient({ chain: sepolia, transport: http(RPC_URL) });
}

function buildWalletClient() {
  return createWalletClient({ chain: sepolia, transport: custom(window.ethereum) });
}

// ── Wallet ─────────────────────────────────────────────────────────────────────
window.connectWallet = async function () {
  if (!window.ethereum) return setMsg('faucetMsg', 'Instala MetaMask', 'error');

  try {
    publicClient  = buildPublicClient();
    walletClient  = buildWalletClient();
    [account]     = await walletClient.requestAddresses();

    document.getElementById('walletAddress').textContent = shortAddr(account);
    document.getElementById('walletInfo').classList.remove('hidden');
    document.getElementById('btnConnect').textContent = 'Conectado';
    document.getElementById('btnConnect').disabled = true;

    await refreshMockBalance();
    await loadListings();
  } catch (e) {
    setMsg('faucetMsg', e.message, 'error');
  }
};

// ── Balance MOCK ───────────────────────────────────────────────────────────────
async function refreshMockBalance() {
  if (!account) return;
  const balance = await publicClient.readContract({
    address: MOCK_ERC20_ADDRESS,
    abi: MockERC20ABI,
    functionName: 'balanceOf',
    args: [account],
  });
  document.getElementById('mockBalance').textContent =
    `${parseFloat(formatUnits(balance, 18)).toFixed(2)} MOCK`;
}

// ── Faucet ─────────────────────────────────────────────────────────────────────
window.claimFaucet = async function () {
  if (!account) return setMsg('faucetMsg', 'Conecta tu wallet primero', 'error');
  setMsg('faucetMsg', 'Enviando transacción...', 'loading');
  try {
    const hash = await walletClient.writeContract({
      address: MOCK_ERC20_ADDRESS,
      abi: MockERC20ABI,
      functionName: 'faucet',
      account,
    });
    await publicClient.waitForTransactionReceipt({ hash });
    await refreshMockBalance();
    setMsg('faucetMsg', '✓ 1,000 MOCK recibidos', 'success');
  } catch (e) {
    setMsg('faucetMsg', e.shortMessage ?? e.message, 'error');
  }
};

// ── Mis NFTs ──────────────────────────────────────────────────────────────────
window.loadMyNFTs = async function () {
  if (!account) return setMsg('myNftsMsg', 'Conecta tu wallet primero', 'error');
  const contractAddr = document.getElementById('myNftContract').value.trim();
  if (!isAddress(contractAddr)) return setMsg('myNftsMsg', 'Dirección inválida', 'error');

  setMsg('myNftsMsg', 'Cargando...', 'loading');
  const grid = document.getElementById('myNftsGrid');
  grid.innerHTML = '';

  try {
    const balance = await publicClient.readContract({
      address: contractAddr, abi: ERC721MinABI, functionName: 'balanceOf', args: [account],
    });
    const total = Number(balance);
    if (total === 0) return setMsg('myNftsMsg', 'No tienes NFTs en este contrato', '');

    // Intentar leer totalSupply para iterar ownerOf
    let supply;
    try {
      supply = await publicClient.readContract({
        address: contractAddr, abi: ERC721MinABI, functionName: 'totalSupply',
      });
    } catch { supply = BigInt(total * 10); }

    let found = 0;
    for (let i = 0; i < Number(supply) && found < total; i++) {
      try {
        const owner = await publicClient.readContract({
          address: contractAddr, abi: ERC721MinABI, functionName: 'ownerOf', args: [BigInt(i)],
        });
        if (owner.toLowerCase() === account.toLowerCase()) {
          found++;
          const card = await buildNftCard(contractAddr, i, 'mine');
          grid.appendChild(card);
        }
      } catch {}
    }
    setMsg('myNftsMsg', `${found} NFT(s) encontrado(s)`, 'success');
  } catch (e) {
    setMsg('myNftsMsg', e.shortMessage ?? e.message, 'error');
  }
};

// ── Marketplace listings ──────────────────────────────────────────────────────
window.loadListings = async function () {
  if (!publicClient) publicClient = buildPublicClient();
  setMsg('marketMsg', 'Cargando...', 'loading');
  const grid = document.getElementById('listingsGrid');
  grid.innerHTML = '';

  try {
    const [listings, ids] = await publicClient.readContract({
      address: MARKETPLACE_ADDRESS,
      abi: MarketplaceABI,
      functionName: 'getActiveListings',
    });

    if (listings.length === 0) {
      setMsg('marketMsg', 'No hay NFTs en venta', '');
      return;
    }

    for (let i = 0; i < listings.length; i++) {
      const l = listings[i];
      const id = Number(ids[i]);
      const card = await buildListingCard(l, id);
      grid.appendChild(card);
    }
    setMsg('marketMsg', `${listings.length} listing(s) activo(s)`, 'success');
  } catch (e) {
    setMsg('marketMsg', e.shortMessage ?? e.message, 'error');
  }
};

// ── Mis listings ──────────────────────────────────────────────────────────────
window.loadMyListings = async function () {
  if (!account) return setMsg('myListingsMsg', 'Conecta tu wallet primero', 'error');
  setMsg('myListingsMsg', 'Cargando...', 'loading');
  const grid = document.getElementById('myListingsGrid');
  grid.innerHTML = '';

  try {
    const [listings, ids] = await publicClient.readContract({
      address: MARKETPLACE_ADDRESS,
      abi: MarketplaceABI,
      functionName: 'getActiveListings',
    });

    const mine = listings
      .map((l, i) => ({ l, id: Number(ids[i]) }))
      .filter(({ l }) => l.seller.toLowerCase() === account.toLowerCase());

    if (mine.length === 0) {
      setMsg('myListingsMsg', 'No tienes listings activos', '');
      return;
    }

    for (const { l, id } of mine) {
      const card = await buildListingCard(l, id, true);
      grid.appendChild(card);
    }
    setMsg('myListingsMsg', `${mine.length} listing(s) propios`, 'success');
  } catch (e) {
    setMsg('myListingsMsg', e.shortMessage ?? e.message, 'error');
  }
};

// ── Abrir modal para listar ───────────────────────────────────────────────────
window.openListModal = function (nftContract, tokenId, name) {
  pendingListNft = { nftContract, tokenId, name };
  document.getElementById('modalNftInfo').textContent = `${name} #${tokenId}`;
  document.getElementById('listPrice').value = '';
  setMsg('modalMsg', '', '');
  document.getElementById('modalList').classList.remove('hidden');
  document.getElementById('modalOverlay').classList.remove('hidden');
};

window.closeModal = function () {
  document.getElementById('modalList').classList.add('hidden');
  document.getElementById('modalOverlay').classList.add('hidden');
  pendingListNft = null;
};

window.confirmList = async function () {
  if (!pendingListNft) return;
  const priceInput = parseFloat(document.getElementById('listPrice').value);
  if (!priceInput || priceInput <= 0) return setMsg('modalMsg', 'Precio inválido', 'error');

  const price = parseUnits(priceInput.toString(), 18);
  const { nftContract, tokenId } = pendingListNft;

  setMsg('modalMsg', 'Aprobando NFT al marketplace...', 'loading');
  try {
    // Paso 1: approve del NFT al marketplace
    const approveHash = await walletClient.writeContract({
      address: nftContract,
      abi: ERC721MinABI,
      functionName: 'approve',
      args: [MARKETPLACE_ADDRESS, BigInt(tokenId)],
      account,
    });
    await publicClient.waitForTransactionReceipt({ hash: approveHash });

    // Paso 2: listItem
    setMsg('modalMsg', 'Listando NFT...', 'loading');
    const listHash = await walletClient.writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: MarketplaceABI,
      functionName: 'listItem',
      args: [nftContract, BigInt(tokenId), price],
      account,
    });
    await publicClient.waitForTransactionReceipt({ hash: listHash });

    setMsg('modalMsg', '✓ NFT listado exitosamente', 'success');
    await loadListings();
    setTimeout(closeModal, 1500);
  } catch (e) {
    setMsg('modalMsg', e.shortMessage ?? e.message, 'error');
  }
};

// ── Comprar NFT ───────────────────────────────────────────────────────────────
window.buyNft = async function (listingId, price) {
  if (!account) return alert('Conecta tu wallet primero');
  const btn = document.getElementById(`btn-buy-${listingId}`);
  if (btn) btn.disabled = true;

  setMsg('marketMsg', 'Aprobando tokens MOCK...', 'loading');
  try {
    // Paso 1: approve ERC20
    const approveHash = await walletClient.writeContract({
      address: MOCK_ERC20_ADDRESS,
      abi: MockERC20ABI,
      functionName: 'approve',
      args: [MARKETPLACE_ADDRESS, price],
      account,
    });
    await publicClient.waitForTransactionReceipt({ hash: approveHash });

    // Paso 2: buyItem
    setMsg('marketMsg', 'Comprando NFT...', 'loading');
    const buyHash = await walletClient.writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: MarketplaceABI,
      functionName: 'buyItem',
      args: [BigInt(listingId)],
      account,
    });
    await publicClient.waitForTransactionReceipt({ hash: buyHash });

    await refreshMockBalance();
    await loadListings();
    setMsg('marketMsg', '✓ NFT comprado exitosamente', 'success');
  } catch (e) {
    setMsg('marketMsg', e.shortMessage ?? e.message, 'error');
    if (btn) btn.disabled = false;
  }
};

// ── Cancelar listing ──────────────────────────────────────────────────────────
window.cancelListing = async function (listingId) {
  if (!account) return;
  const btn = document.getElementById(`btn-cancel-${listingId}`);
  if (btn) btn.disabled = true;

  setMsg('myListingsMsg', 'Cancelando...', 'loading');
  try {
    const hash = await walletClient.writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: MarketplaceABI,
      functionName: 'cancelListing',
      args: [BigInt(listingId)],
      account,
    });
    await publicClient.waitForTransactionReceipt({ hash });
    await loadMyListings();
    await loadListings();
    setMsg('myListingsMsg', '✓ Listing cancelado', 'success');
  } catch (e) {
    setMsg('myListingsMsg', e.shortMessage ?? e.message, 'error');
    if (btn) btn.disabled = false;
  }
};

// ── Helpers de UI ─────────────────────────────────────────────────────────────
async function buildNftCard(nftContract, tokenId, mode) {
  const card = document.createElement('div');
  card.className = 'nft-card';

  let imageUrl = null;
  let nftName  = `NFT #${tokenId}`;

  try {
    const uri = await publicClient.readContract({
      address: nftContract, abi: ERC721MinABI, functionName: 'tokenURI', args: [BigInt(tokenId)],
    });
    if (uri) {
      const metaUrl = resolveIpfs(uri);
      try {
        const resp = await fetch(metaUrl);
        const meta = await resp.json();
        if (meta.name)  nftName  = meta.name;
        if (meta.image) imageUrl = resolveIpfs(meta.image);
      } catch {
        // uri podría ser directamente una imagen
        imageUrl = metaUrl;
      }
    }
  } catch {}

  let collectionName = '';
  try {
    collectionName = await publicClient.readContract({
      address: nftContract, abi: ERC721MinABI, functionName: 'name',
    });
  } catch {}

  card.innerHTML = `
    ${imageUrl
      ? `<img src="${imageUrl}" alt="${nftName}" loading="lazy" />`
      : `<div class="nft-placeholder">🖼️</div>`}
    <div class="nft-info">
      <span class="nft-name">${nftName}</span>
      ${collectionName ? `<span class="nft-id">${collectionName}</span>` : ''}
      <span class="nft-id">Token ID: ${tokenId}</span>
    </div>
    <div class="nft-actions">
      <button onclick="openListModal('${nftContract}', ${tokenId}, '${nftName}')">
        Listar en venta
      </button>
    </div>
  `;
  return card;
}

async function buildListingCard(listing, listingId, isMine = false) {
  const card = document.createElement('div');
  card.className = 'nft-card';

  let imageUrl = null;
  let nftName  = `NFT #${listing.tokenId}`;

  try {
    const uri = await publicClient.readContract({
      address: listing.nftContract, abi: ERC721MinABI, functionName: 'tokenURI', args: [listing.tokenId],
    });
    if (uri) {
      const metaUrl = resolveIpfs(uri);
      try {
        const resp = await fetch(metaUrl);
        const meta = await resp.json();
        if (meta.name)  nftName  = meta.name;
        if (meta.image) imageUrl = resolveIpfs(meta.image);
      } catch { imageUrl = metaUrl; }
    }
  } catch {}

  const priceFormatted = parseFloat(formatUnits(listing.price, 18)).toFixed(2);
  const isOwn = account && listing.seller.toLowerCase() === account.toLowerCase();

  card.innerHTML = `
    ${imageUrl
      ? `<img src="${imageUrl}" alt="${nftName}" loading="lazy" />`
      : `<div class="nft-placeholder">🖼️</div>`}
    <div class="nft-info">
      <span class="nft-name">${nftName}</span>
      <span class="nft-id">Token ID: ${listing.tokenId}</span>
      <span class="nft-price">${priceFormatted} MOCK</span>
      <span class="nft-seller">Vendedor: ${shortAddr(listing.seller)}</span>
    </div>
    <div class="nft-actions">
      ${isMine || isOwn
        ? `<button id="btn-cancel-${listingId}" class="btn-danger" onclick="cancelListing(${listingId})">Cancelar</button>`
        : `<button id="btn-buy-${listingId}" onclick="buyNft(${listingId}, ${listing.price}n)">Comprar</button>`}
    </div>
  `;
  return card;
}

function resolveIpfs(uri) {
  if (!uri) return '';
  if (uri.startsWith('ipfs://')) return IPFS_GATEWAY + uri.slice(7);
  return uri;
}

function shortAddr(addr) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function isAddress(val) {
  return /^0x[0-9a-fA-F]{40}$/.test(val);
}

function setMsg(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = `msg ${type}`;
}
