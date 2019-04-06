# PART A

# Centralized Database Server

### Pros

1. Easily customizable - DBA can change the data depending on the business requirements i.e. customizing the sales agreement
2. Stability - processes transations at one location. Faster as less writes via authroized nodes, quick disaster recovery
3. Speed and Volume - Designed for high volume txn processing and data analytics
4. Data privacy - hides financial data completely and allows access to only authorized nodes

### Cons

1. Single point of failure - Once hacked hard or even impossible to recover valueable data unless there is a backup. DB server failure can bring down the entire system.
2. Requires Admin - Requires DBA to allow for sensitive and mission ciritical writes and for maintainance
3. Vulnerable to security exploits - if the administrator forgets to apply patches and updates, the system can be vulnerable to security exploits by hackers. This makes databases prone to breaches

## Blockchain

## Pros

1. High fault tolerancy/Robustness - single node crash does not bring the entire system down. With built-in redundancy every node processes every txn, so no individual node is crucial to the database as a whole
2. Security - information stored on a node must be copied to all nodes in the network - making it hard to do fraudulent txns
3. Full transparency - makes data sharing easier as it adds more trust and value to the system i.e. enabling collaboration among different real estate agents
4. Zero administartion - Txns can be verified and processed independently by multiple nodes, with the blockchain acting as a consensus mechanism to ensure those nodes stay in sync
5. Immutability - information cannot be changed once a block has been validated. This also makes it resistant to tampering and manipulation because the information is recorded on a digital public ledger stored on many nodes. To compromise it means to change that information in all the nodes on the network

## Cons

1. Higher demand of compute resources - as every node validates txns therefore more computing power is required to run a blockchain
2. Data privacy - in our financial application, the full transparency enjoyed by every node in a blockchain is not preferred
3. Scalability - blockchains do not scale well when it comes to high volume txns. Due to the fixed block size, there are problems with increasing txn volume. The delays also affect txn velocity, where most blockchains cannot process more than 15 txns per second
4. Size - larger nodes require more space and it is not just the storage issue for nodes, but a network as well. With larger blockchain sizes, it takes much longer to copy them to new nodes on the network
5. Interoperability - unlike traditional databases, each blockchain is very much its own ecosystem. It is difficult to make dissimilar blockchains interoperable to make the transfer of value much simpler

---

# PART B

## DEFAULT Algorithm (PoET)

Yes, PoET offers a solution to the Byzantine Generals Problem that utilizes a “trusted execution environment” to improve on the efficiency of present solutions such as Proof-of-Work., At a high-level, PoET stochastically elects individual peers to execute requests at a given target rate. Individual peers sample an exponentially distributed random variable and wait for an amount of time dictated by the sample. The peer with the smallest sample wins the election. Cheating is prevented through the use of a trusted execution environment, identity verification and blacklisting based on asymmetric key cryptography, and an additional set of election policies.

For the purpose of achieving distributed consensus efficiently, a good lottery function has several characteristics:

    1. Fairness: The function should distribute leader election across the broadest possible population of participants
    2. Investment: The cost of controlling the leader election process should be proportional to the value gained from it
    3. Verification: It should be relatively simple for all participants to verify that the leader was legitimately selected

## RAFT Algorithm

No, Raft's initial description is not byzantine fault-tolerant.

A node that votes twice in a given term, or votes for another node that has a log which is not up-to-date like its own and that node becomes leader. This behaviour can cause split-brains (case where to two nodes believing themselves to be leader) or inconsistencies in the log.

Many other scenarios like sending fake but valid heartbeat messages are also examples that show Raft is not byzantine fault-tolerant.

However there are several papers where a byzantine fault-tolerant version of Raft is [presented](https://scholar.google.de/scholar?hl=de&as_sdt=0%2C5&q=byzantine%20fault%20tolerance%20Raft&btnG=).

### Reference(s):

1. https://hackernoon.com/databases-and-blockchains-the-difference-is-in-their-purpose-and-design-56ba6335778b
2. https://www.multichain.com/blog/2016/03/blockchains-vs-centralized-databases/
3. https://sawtooth.hyperledger.org/docs/core/releases/1.0/architecture/poet.html#introduction
4. https://stackoverflow.com/questions/49687177/is-the-raft-consensus-algorithm-a-byzantine-fault-tolerant-bft-algorithm
