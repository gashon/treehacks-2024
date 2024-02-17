pragma solidity >=0.7.3;

  contract AudioContract {
    string public userId;
    string public songId;
    string public createdAt;

    constructor(string memory initUserId, string memory initSongId, string memory initCreatedAt) {

        userId = initUserId;
        songId = initSongId;
        createdAt = initCreatedAt;
    }

    function updateUserId(string memory newUserId) public {
        string memory oldUserId = userId;
        userId = newUserId;
    }

    function updateSongId(string memory newSongId) public {
        string memory oldSongId = songId;
        songId = newSongId;
    }

    function updateCreatedAt(string memory newCreatedAt) public {
        string memory oldCreatedAt = createdAt;
        createdAt = newCreatedAt;
    }

    function get() public view returns (string memory, string memory, string memory) {
      return (userId, songId, createdAt);
    }
  }