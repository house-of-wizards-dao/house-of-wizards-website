# Forgotten Prison escape

Public route: `/magic/forgotten-prison/escape`, optionally `?draw=<round>`.

The auction's single **Claim winnings** link opens the character selector. It uses the existing wallet NFT API, filters to Wizards/Souls/Warriors, and offers a labelled guest avatar. Avatar selection grants no claim rights and never transfers or burns the avatar.

Phaser is imported only after selecting a visitor. The visitor walks to Stank Death (Warrior #9662); clicking the path, arrow keys, A/D, and the DOM “Talk to Stank” control are supported. Keyboard input is active only while the canvas has focus. Reduced-motion preferences disable ambient loops and shorten the reveal. Text and claim controls remain accessible outside the canvas, including if assets fail.

## Claim behavior

- Read the selected draw directly from the configured contract and require a finalized win for the current wallet.
- A single action orchestrates `claimNFT(drawId, connectedAddress)`, then `claimBonus(drawId, connectedAddress)` if a bonus was awarded. Both calls send **zero ETH**; the winning bid has already paid for the prisoner. The wallet pays gas.
- The deployed contract has no combined claim function. This UI does not use a forwarding contract or change the deployed contract. When both claims remain, the wallet needs two confirmations, explained before the first request.
- Re-read claim flags and verify wallet/chain before each write. Simulate before submitting. After a cancellation or partial success, only remaining claims are sent.
- Persist only a pending public transaction hash under a chain/contract/wallet/round-specific local-storage key. On retry, confirm that hash before submitting anything else. No keys or signatures are stored.
- Reveal the prisoner only after all awarded claims are confirmed. Refreshing a completed round offers a transaction-free replay. The on-chain result is public; concealment is presentation, not cryptographic secrecy.
- The auction and history withhold the identity of unclaimed main prizes. History shows the character once its transfer has been claimed.

## Art provenance and replacement

- Exterior sky, mountains, ground, rocks, and bat frames: user-supplied `burn_ux_scene_01`, copied without resampling.
- Guest: official Wizard #44. Guard: official Warrior #9662. Their original PNG/JSON atlases are bundled under `public/img/forgotten-prison/game`.
- Other characters: the official `https://www.forgottenrunes.com/api/art/{wizards|souls|warriors}/{id}/spritesheet.{png|json}` API, through a fixed-host, validated same-origin route with caching and timeouts.
- Official source and format: https://www.forgottenrunes.com/blog/walkcycles. Wizard/Soul frames are 50px; Warrior frames are 60px. Front/left/back/right cycles contain four frames each.
- Phaser 3.90 is pinned and loaded on demand. Official reference: https://docs.phaser.io/phaser/concepts/animations.
- The prison masonry and bonus-box symbol are provisional Phaser graphics. The main building's native-canvas replacement brief and RetroDiffusion prompt are in `retrodiffusion-prison-prompt.md`. No paid generation was run.

## Verification

Claim orchestration and the React claim flow test wrong winners, unsettled rounds, interrupted bonus claims, wallet changes, completed/no-bonus draws, and concealment until confirmed. Browser checks exercised guest approach/dialogue, a Soul walkcycle, both Wizard and Warrior rescue animations, the box reveal, and the mobile layout. Sprite proxy checks returned the official Wizard, Soul, and Warrior atlases. No mainnet claim was sent during implementation.
