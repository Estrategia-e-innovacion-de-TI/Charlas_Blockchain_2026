// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ERC20 Básico
 * @dev Implementación mínima del estándar ERC-20
 */
contract ERC20 {
    // ── Estado ──────────────────────────────────────────────────────────────

    string public name;
    string public symbol;
    uint8  public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256)                     public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // ── Eventos (obligatorios por el estándar) ───────────────────────────────

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // ── Constructor ──────────────────────────────────────────────────────────

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply) {
        name        = _name;
        symbol      = _symbol;
        totalSupply = _initialSupply * 10 ** decimals;

        // Asigna todos los tokens al deployer
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    // ── Funciones del estándar ───────────────────────────────────────────────

    /**
     * @dev Transfiere `amount` tokens al destinatario `to`.
     */
    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    /**
     * @dev Aprueba que `spender` gaste hasta `amount` tokens en nombre del llamante.
     */
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    /**
     * @dev Transfiere `amount` tokens de `from` hacia `to`, usando la asignación previa.
     */
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        require(allowed >= amount, "ERC20: allowance insuficiente");

        // Si la aprobacion no es ilimitada, la reduce
        if (allowed != type(uint256).max) {
            allowance[from][msg.sender] = allowed - amount;
        }

        _transfer(from, to, amount);
        return true;
    }

    // ── Lógica interna ───────────────────────────────────────────────────────

    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "ERC20: origen es la direccion cero");
        require(to   != address(0), "ERC20: destino es la direccion cero");
        require(balanceOf[from] >= amount, "ERC20: saldo insuficiente");

        balanceOf[from] -= amount;
        balanceOf[to]   += amount;
        emit Transfer(from, to, amount);
    }
}
