// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    mapping(string => uint) public votes;
    mapping(address => bool) public hasVoted;
    string[] public candidates;
    address public owner;
    bool public votingStarted;


    constructor() {
        owner = msg.sender;
    }


    function addCandidates(string memory _candidate) public {
        require(msg.sender == owner , "No tiene permisos");
        require(!votingStarted, "La votacion ya inicio");
        candidates.push(_candidate);
    }

     function startVoting() public {
        require(msg.sender == owner, "No tiene permisos");
        require(candidates.length > 0, "No hay candidatos");
        votingStarted = true;
    }

    function candidateExists(string memory _candidate) internal view returns (bool) {
        for (uint i = 0; i < candidates.length; i++) {
            if (keccak256(bytes(candidates[i])) == keccak256(bytes(_candidate))) {
                return true;
            }
        }
        return false;
    }

    function vote(string memory candidate) public {
        require(votingStarted, "La votacion no ha iniciado");
        require(!hasVoted[msg.sender], "Ya votaste");
        require(candidateExists(candidate), "Candidato no existe");
        votes[candidate]++;
        hasVoted[msg.sender] = true;
    }

    function getVotes(string memory candidate) public view returns (uint) {
        return votes[candidate];
    }

    function getCandidates() public view returns (string[] memory) {
        return candidates;
    }
}