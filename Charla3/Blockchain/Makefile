-include .env

build:
	forge build

clean:
	forge clean

test:
	forge test -v

anvil:
	anvil

# ── NFT ────────────────────────────────────────────────────────────────────────
deploy-nft-local:
	forge script script/DeployMyNFT.s.sol --rpc-url http://localhost:8545 --broadcast

deploy-nft:
	forge script script/DeployMyNFT.s.sol --rpc-url $(RPC_URL) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY)

# ── MockERC20 ─────────────────────────────────────────────────────────────────
deploy-erc20-local:
	forge script script/DeployMockERC20.s.sol --rpc-url http://localhost:8545 --broadcast

deploy-erc20:
	forge script script/DeployMockERC20.s.sol --rpc-url $(RPC_URL) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY)

# ── Marketplace ───────────────────────────────────────────────────────────────
deploy-marketplace-local:
	forge script script/DeployMarketplace.s.sol --rpc-url http://localhost:8545 --broadcast

deploy-marketplace:
	forge script script/DeployMarketplace.s.sol --rpc-url $(RPC_URL) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY)

.PHONY: build clean test anvil deploy-nft-local deploy-nft deploy-erc20-local deploy-erc20 deploy-marketplace-local deploy-marketplace
