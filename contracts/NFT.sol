//Contract based on [https://docs.openzeppelin.com/contracts/4.x/erc721](https://docs.openzeppelin.com/contracts/4.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

/**
 * @author  0x3pehemeralsoul
 * @title   DAO Soulbound NFT contract
 * @dev     Soubound token. Only burner and owner can burn token. Only 1 token allowed per address. Uri role can update tokenURI. Only minter can mint.
 */

contract NFT is 
    ERC721Enumerable,
    ERC721Burnable, 
    AccessControlEnumerable
{

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string baseTokenURI;
    

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant URI_ROLE = keccak256("URI_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");    

    constructor(address minter, address burner, address uri, address admin, string memory _baseTokenURI) ERC721("TEST1PCC DAO Membership", "T1PCC") {
        _setupRole(MINTER_ROLE, minter);
        _setupRole(BURNER_ROLE, burner);
        _setupRole(URI_ROLE, uri);
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        baseTokenURI = _baseTokenURI;


    }

    /**
     * @notice  Mints only 1 token to recipient. 
     * @dev     Reverts if receipient owns already 1 token
     * @param   recipient  token holder
     * @return  uint256  tokenId assigned to holder
     */
    function mintNFT(address recipient)
        public onlyRole(MINTER_ROLE)
        returns (uint256)
        
    {
        
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _safeMint(recipient, newItemId);

        return newItemId;
    }

    /**
     * @dev     Here is where we enforce the soulbound. The 2 require stataments allow for burning by owner or by BURNER_ROLE
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId, /* firstTokenId */
        uint256 batchSize
    ) internal virtual override(ERC721, ERC721Enumerable)  {
        require(from == address(0) || to == address(0), "Err: token transfer is BLOCKED");  
        require(to == address(0) || balanceOf(to) == 0, "Err: you already own a token"); 
        super._beforeTokenTransfer(from, to, tokenId, batchSize);  
    }

    /**
     * @notice  Owner can burn token in order to enforce the right to be forgotten. Also BURNER_ROLE can burn in order to kick out a member from a DAO.
     * @dev     Override to include BURNER_ROLE, the _beforeTokenTransfer function is overriden to comply also with BURNER_ROLE. These 2 functions go hand in hand.
     * @param   tokenId  tokenID to be burned
     */
    function burn(uint256 tokenId) public virtual override {
        require(hasRole(BURNER_ROLE, _msgSender()) || _isApprovedOrOwner(_msgSender(), tokenId), "Caller cannot burn");
        super._burn(tokenId);
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}. the baseTokenURI is the same for all tokens.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        return baseTokenURI;
    }

    /**
     * @dev setter for the NFT token URI.
     */
    function _setTokenURI(string memory _baseTokenUri) external onlyRole(URI_ROLE) {
        baseTokenURI = _baseTokenUri;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
    */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlEnumerable, ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
