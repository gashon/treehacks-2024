pragma solidity >=0.7.3;

  contract AudioContract {
    string public userId;
    string public createdAt;

    constructor(string memory initUserId, string memory initCreatedAt) {
        userId = initUserId;
        createdAt = initCreatedAt;
    }

    function updateUserId(string memory newUserId) public {
        userId = newUserId;
    }

    function updateCreatedAt(string memory newCreatedAt) public {
        createdAt = newCreatedAt;
    }

    function get() public view returns (string memory, string memory) {
      return (userId, createdAt);
    }
  }