/**
 * SPDX-License-Identifier: MIT
 */
pragma solidity 0.8.30;
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title Test ERC721
 * @notice Mintable ERC721 fixture for auction custody and transfer tests.
 */
contract MockERC721 is ERC721 {
    /**
     * @notice Initialize the fixture collection name and symbol.
     */
    constructor() ERC721("Prison inventory", "CELL") {}

    /**
     * @notice Mint a fixture NFT without a receiver callback.
     * @dev Unrestricted minting exists only for test setup.
     * @param recipient Address receiving the new NFT.
     * @param tokenId Previously unused token ID to mint.
     */
    function mint(address recipient, uint256 tokenId) external {
        _mint(recipient, tokenId);
    }
}
