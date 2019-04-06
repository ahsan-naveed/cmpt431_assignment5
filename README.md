## BLOCKCHAIN DESIGN:

Within our transaction processor state we have two methods i.e. `getValue` and `setValue` both of these functions use house address as a txn address. `setValue` stores new sales agreements and `getValue` retrieves sales agreements. An event subscription is submitted to the validator which reports back any state change that occcurs on the blockchain.
