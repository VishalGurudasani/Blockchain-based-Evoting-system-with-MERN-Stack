// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

contract EVoting {
    struct Candidate {
        string name;
        string party;
        uint256 voteCount;
    }

    struct Ballot {
        string city;
        address admin;
        bool isOpen;
        uint256 candidateCount;
        mapping(uint256 => Candidate) candidates;
        mapping(string => bool) hasVotedByVoterID; 
        
    }



    mapping(string => Ballot) public cityToBallot; 
    mapping(string => string) public voterToCity; 
   

    constructor() {}

    function createBallot(string memory _city) public {
        require(
            cityToBallot[_city].admin == address(0),
            "Ballot for this city already exists"
        );
        Ballot storage newBallot = cityToBallot[_city];
        newBallot.city = _city;
        newBallot.admin = msg.sender;
        newBallot.isOpen = true;
        newBallot.candidateCount = 0;
    }

    function addCandidate(
        string memory _city,
        string memory _name,
        string memory _party
    ) public {
        Ballot storage ballot = cityToBallot[_city];
        require(ballot.isOpen, "Ballot is closed");

        ballot.candidates[ballot.candidateCount] = Candidate({
            name: _name,
            party: _party,
            voteCount: 0
        });
        ballot.candidateCount++;
    }

     function vote(string memory _voterId, string memory _city, uint256 _candidateIndex) public {
        Ballot storage ballot = cityToBallot[_city];
        require(_candidateIndex < ballot.candidateCount, "Invalid candidate index");
        require(ballot.isOpen, "Ballot is closed");
        require(!ballot.hasVotedByVoterID[_voterId], "You have already voted with this voter ID");
        require(bytes(voterToCity[_voterId]).length == 0 || keccak256(bytes(voterToCity[_voterId])) == keccak256(bytes(_city)), "You have already voted in a different city");

        ballot.candidates[_candidateIndex].voteCount++;
        ballot.hasVotedByVoterID[_voterId] = true;
        voterToCity[_voterId] = _city; 
        
    }

    function getResult(string memory _city)
        public
        view
        returns (string memory winnerName, string memory winnerParty)
    {
        Ballot storage ballot = cityToBallot[_city];
        require(!ballot.isOpen, "Election is still open, no winner yet");

        uint256 maxVotes = 0;
        uint256 winnerIndex = 0;

        for (uint256 i = 0; i < ballot.candidateCount; i++) {
            if (ballot.candidates[i].voteCount > maxVotes) {
                maxVotes = ballot.candidates[i].voteCount;
                winnerIndex = i;
            }
        }

        return (
            ballot.candidates[winnerIndex].name,
            ballot.candidates[winnerIndex].party
        );
    }

    function getCandidatesInCity(string memory _city)
        public
        view
        returns (
            string[] memory candidateNames,
            string[] memory candidateParties
        )
    {
        Ballot storage ballot = cityToBallot[_city];
        uint256 candidateCount = ballot.candidateCount;
        string[] memory names = new string[](candidateCount);
        string[] memory parties = new string[](candidateCount);

        for (uint256 i = 0; i < candidateCount; i++) {
            names[i] = ballot.candidates[i].name;
            parties[i] = ballot.candidates[i].party;
        }

        return (names, parties);
    }

    function getBallotDetails(string memory _city)
        public
        view
        returns (
            string memory city,
            address admin,
            bool isOpen,
            uint256 candidateCount
        )
    {
        Ballot storage ballot = cityToBallot[_city];
        return (
            ballot.city,
            ballot.admin,
            ballot.isOpen,
            ballot.candidateCount
        );
    }

    function getCandidateDetails(string memory _city, uint256 _candidateIndex)
        public
        view
        returns (
            string memory name,
            string memory party,
            uint256 voteCount
        )
    {
        Ballot storage ballot = cityToBallot[_city];
        require(
            _candidateIndex < ballot.candidateCount,
            "Invalid candidate index"
        );

        Candidate storage candidate = ballot.candidates[_candidateIndex];
        return (candidate.name, candidate.party, candidate.voteCount);
    }

    function deleteCandidate(string memory _city, uint256 _candidateIndex)
        public
    {
        Ballot storage ballot = cityToBallot[_city];
        require(
            _candidateIndex < ballot.candidateCount,
            "Invalid candidate index"
        );
        require(ballot.isOpen, "Ballot is closed");

        
        if (_candidateIndex < ballot.candidateCount - 1) {
            ballot.candidates[_candidateIndex] = ballot.candidates[
                ballot.candidateCount - 1
            ];
        }
        delete ballot.candidates[ballot.candidateCount - 1];
        ballot.candidateCount--;
    }

    function closeBallot(string memory _city) public {
        Ballot storage ballot = cityToBallot[_city];
        require(ballot.isOpen, "Ballot is already closed");
        ballot.isOpen = false;
    }

    function getVoteCounts(string memory _city)
        public
        view
        returns (uint256[] memory voteCounts)
    {
        Ballot storage ballot = cityToBallot[_city];
        uint256 candidateCount = ballot.candidateCount;
        uint256[] memory counts = new uint256[](candidateCount);

        for (uint256 i = 0; i < candidateCount; i++) {
            counts[i] = ballot.candidates[i].voteCount;
        }

        return counts;
    }
}
