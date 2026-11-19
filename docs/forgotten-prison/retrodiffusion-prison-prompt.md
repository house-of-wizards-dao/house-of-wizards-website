# Forgotten Prison — RetroDiffusion art brief

## Output settings

- One **192 × 192 px native pixel-art PNG**, transparent background. Generate on this grid from the start; do not generate a large illustration and shrink it.
- Front-facing **side-view adventure scene**, matching the supplied burn UX assets. This is intentionally not a top-down/isometric Runiverse building.
- Ground baseline: **y = 191**. Building centered at **x = 96**. The game places this canvas at **(422, 22)** in its 608 × 240 scene, with the floor at y = 214.
- Door opening: **48 px wide × 72 px high**, x = 72…119, y = 120…191. Keep it empty and transparent. The game overlays its own portcullis, raises it, then walks the prisoner out.
- No characters, lettering, UI, ground, sky, or baked-in animation. The guard and prisoners use the official character sprites.

## Reference images to attach

1. `burn_ux_scene_01_ground.png` and `burn_ux_scene_01_stones1.png`: native pixel size, purple-gray stone ramps, surface detail, side-view ground plane.
2. `burn_ux_scene_02_bg.png`: dark dungeon masonry, restrained ornament, warm/cool contrast.
3. `Full page1.png`: **architectural motifs only** — the Dread Tower’s eye emblem, blue-gray stone, uneven turrets, and muted rust-red roof peaks. Do not copy the print texture or illustration rendering.
4. An official Wizard/Warrior spritesheet: scale reference only. Frames are 50 × 50 px for Wizards/Souls and 60 × 60 px for Warriors. Do not bake a character into the building.

## Main prompt — paste into RetroDiffusion

Create the Forgotten Prison of the Dread Tower as a single game-ready pixel-art building on a transparent 192 × 192 pixel canvas. Match the attached Forgotten Runes burn-scene assets: a side-view fantasy adventure set, crisp native pixels, compact readable clusters, shadowy violet-gray stone with sparse lavender edge highlights, near-black cool recesses, and small warm ochre accents. Every file pixel must be an intentional art pixel; no simulated pixelation.

A squat, ominous medieval prison with a tall central tower and two smaller uneven turrets. Thick battered masonry, chipped battlements, a few narrow barred windows, restrained muted rust-red roof peaks, and one small ancient eye emblem above the entrance. A little moss and a few cracks suggest age; keep detail sparse enough to read at native resolution. The silhouette should be memorable, slightly crooked, and sinister with the playful hand-crafted character of Forgotten Runes. Keep the environment darker and less saturated than the characters that will walk in front of it. Use subtle warm highlights on upper stone edges and cool purple shadows. Straight-on front elevation with only slight visible upper surfaces, matching the side-view references; no isometric diamond base, no vanishing-point perspective.

Center the building horizontally. Its base rests on the bottom row of the 192 × 192 canvas. Keep the main stone mass between x=12 and x=179. Reserve a completely empty transparent entrance exactly 48 pixels wide and 72 pixels high, from x=72 to x=119 and y=120 to y=191. Build the stone arch and jambs around that opening without obstructing it. The entrance must remain large enough for a 50–60-pixel character animation frame. Do not draw a door, gate, bars, character, or darkness inside this opening: the game will add those separately. Preserve transparency outside the building and inside the entrance. Deliver the building alone, no scenery, text, labels, border, interface, or watermark.

## Negative prompt

Photorealism, 3D render, vector illustration, smooth gradients, blurry edges, anti-aliased resizing, mixed pixel sizes, painted texture, film grain, stippled noise, oversized illustration, high-saturation environment, bright white highlights, isometric view, top-down view, converging perspective, tiny doorway, blocked doorway, gate baked into the building, closed door, people, goblins, wizards, warriors, captions, letters, UI, ground platform, sky, mountains, watermark.

## Optional gate asset

After choosing a prison, generate a separate **48 × 72 px transparent PNG**: “A straight-on iron portcullis for this exact doorway. Seven narrow vertical iron bars, two horizontal crossbars, weathered cool gray metal, a tiny muted brass lock, crisp native pixel clusters. Front view, no perspective, no wall or surrounding stone, no background. Bars occupy a 48 × 72 px canvas and align to its bottom edge.” Keep the same canvas for all variants; the game moves this layer vertically.

## Integration and review

The current playable scene uses a deliberately simple gate drawn in Phaser while this art is being prepared. Save the chosen building as `public/img/forgotten-prison/game/prison.png`; replace the provisional masonry in `prison-scene.ts` with an image at (422,22), origin (0,0), depth 2. Preserve the separate gate and prisoner layers. The file is not loaded automatically until integrated and inspected.

Inspect at native size and 3× nearest-neighbor enlargement, next to the supplied stone assets and Stank’s official Warrior #9662 sprite. Check doorway alignment, clear silhouettes, character contrast, transparency, and consistent pixel scale. Reject any output that only looks pixelated at a large resolution. No generated art has been commissioned or paid for as part of this prompt-only request.

Official sprite format reference: https://www.forgottenrunes.com/blog/walkcycles
