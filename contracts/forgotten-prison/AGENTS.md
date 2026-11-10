# Forgotten Prison contracts

Before writing Solidity or shipping anything onchain, read https://ethskills.com/SKILL.md
and the applicable linked guidance. Keep this as a standalone Forge project.

- Unit tests use Bulloak: maintain `.tree` specifications alongside `.t.sol` implementations.
- Use `require(condition, CustomError())` for validation rather than `if` / `revert` guards.
- Reuse pinned Solady `RedBlackTreeLib` for bid price ordering; keep tie handling in the bid-book adapter.
- Run `make check` (Bulloak structure, formatting, unit/fuzz/invariant tests).
- Run the pinned mainnet fork test with `MAINNET_RPC_URL` before deployment.
- Never deploy, fund a subscription, or broadcast a transaction without user authorization.
- Keep bidder escrow, pending payments, owner proceeds, and refunds separately accounted.
- Never add an admin-selected winner, seed, NFT, reroll, or mutable coordinator.

- Anyone may donate or sync supported NFTs, including previously claimed prizes. Never register an unclaimed assignment twice.
- Keep cutoff eligibility and both pending-draw snapshots stable while accepting later arrivals.
- Main and bonus claims are independent; stale draw claims must stay consumed after an asset returns.
