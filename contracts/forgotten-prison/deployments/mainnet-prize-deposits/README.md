# Forgotten Prison — Safe prize deposits

Import the ten `batch-XX-of-10.json` files into Safe Transaction Builder, one at a
time, in numeric order. These are **Ethereum mainnet** transactions. Generating
and testing these files does not submit them to Safe or move assets on mainnet.

| Setting | Value |
| --- | --- |
| Source Safe | `0x6EAb2d42FEf9aad0036Bc145b5F451799e3FB3F7` |
| Recipient prison | `0x7a258A7ed776d88Ec7E19a03019a632c4F097EF8` |
| Chain | Ethereum mainnet, chain ID `1` |
| Safe approvals | 5 of 9 owners, for each batch |
| Ownership snapshot | Mainnet block `26432013` |
| Total | 352 Warriors + 3 Wizards + 114 Imp Boxes = **469 NFTs** |
| ETH sent with each NFT call | `0`; the executor still pays transaction gas |

## Import and execute

1. Open this Safe on Ethereum mainnet in [Safe Wallet](https://app.safe.global/).
2. Open **New transaction → Transaction Builder** and upload
   `batch-01-of-10.json`.
3. Check the recipient, the `safeTransferFrom` arguments, and the number of NFT
   transfers. The transaction targets are the NFT collection contracts; the
   prison is the `to` function argument.
4. Simulate the batch against current mainnet state in Safe, then propose it for
   the Safe's five required owner approvals and execute it.
5. Confirm success before proceeding to the next numbered file. Execute each
   file exactly once. Do not combine all ten files into a single transaction.

Only the numbered `batch-*.json` files are Safe imports. `manifest.json` and
`simulation.json` are supporting reports; `inventory.csv` lists every token ID.
The files contain no Safe nonce, signatures, token approvals, or helper-contract
deployments. Safe assigns its transaction nonce when a proposal is created;
account for any other pending Safe transactions.

## Batch contents

| Batch | Imp Boxes | Wizards | Warriors | Total |
| --- | ---: | ---: | ---: | ---: |
| 01 | 50 | 0 | 0 | 50 |
| 02 | 50 | 0 | 0 | 50 |
| 03 | 14 | 3 | 33 | 50 |
| 04 | 0 | 0 | 50 | 50 |
| 05 | 0 | 0 | 50 | 50 |
| 06 | 0 | 0 | 50 | 50 |
| 07 | 0 | 0 | 50 | 50 |
| 08 | 0 | 0 | 50 | 50 |
| 09 | 0 | 0 | 50 | 50 |
| 10 | 0 | 0 | 19 | 19 |
| **Total** | **114** | **3** | **352** | **469** |

Imp Boxes come first so the bonus pool is present before the main prizes arrive.
Every entry calls `safeTransferFrom(SAFE, PRISON, tokenId)` on its collection:

- Warriors: `0x9690b63Eb85467BE5267A3603f770589Ab12Dc95`
- Wizards: `0x521f9C7505005CFA19A8E5786a9c3c9c9F5e6f42`
- Imp Boxes: `0x59775fD5F266C216D7566eB216153aB8863C9c84`

The prison's `onERC721Received()` automatically registers each deposit. No
`approve`, `setApprovalForAll`, or `syncReceivedNFT` call is needed. Each Safe
batch is atomic: a failed NFT call reverts all transfers in that batch.

## Timing and checks

The prison accepts these deposits while `closed()` is false. Prizes enter its
live inventory immediately; there is no separate activation step. Registration
before `nextDrawAt()` qualifies for the upcoming round; registration at or after
the cutoff queues the asset for a later round. The cutoff observed when these
files were prepared was **November 17, 2026, 08:44:35 America/Costa_Rica**. Read
`nextDrawAt()` again when scheduling execution.

If another transaction transfers any listed NFT before these batches execute,
the affected batch will revert and needs to be regenerated. Re-simulating in Safe
before execution checks current ownership and contract state.

After all ten succeed, with no intervening draws or additional deposits, expect
`availableTokenCount() == 355` and `availableBoxCount() == 114`. The source Safe
should hold zero NFTs from these three collections.

## Validation records

All ten batches passed on a separate mainnet fork at block **26,432,013**.
The final checks confirmed the prison owns all **469 NFTs**, every NFT has
`tokenStatus == Available`, and the Safe has zero remaining NFTs from the three
collections. Batch execution used **57,093,702 gas in total**; the largest batch
used **7,251,206 gas**, below the per-transaction cap of 16,777,216.

The final import files use explicit function arguments so Safe can display
readable calls. Their encoded calldata was independently checked with ethers
and matches the calldata executed in the fork simulations byte for byte.

`manifest.json` records ownership, per-file SHA-256 hashes, Safe-format checksums,
and the simulation status. `simulation.json` records per-batch gas and outcomes.
The fork uses the deployed Safe and prison with Safe's canonical v1.3.0
`MultiSendCallOnly` at `0x40A2aCCbd92BCA938b02010E17A5b8929b49130D`.
Signer impersonation and `approveHash` are used only on the isolated local fork;
they are not part of the import files or a mainnet signing procedure. Actual
execution gas can differ with signatures and intervening mainnet state.

Format references:
[Safe Transaction Builder](https://help.safe.global/articles/4180673514-transaction-builder),
[batch schema](https://github.com/safe-global/safe-wallet-monorepo/blob/main/apps/tx-builder/src/typings/models.ts),
[checksum algorithm](https://github.com/safe-global/safe-wallet-monorepo/blob/main/apps/tx-builder/src/lib/checksum.ts).
