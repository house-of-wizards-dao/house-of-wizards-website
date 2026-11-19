import * as Phaser from "phaser";
import {
  characterKey,
  spriteSource,
  type EscapeCharacter,
} from "@/lib/forgotten-prison/escape";

const ASSET = "/img/forgotten-prison/game/";
const FLOOR = 214;
const GUARD = 408;
export type PrisonGameBridge = {
  talk: () => void;
  release: (character: EscapeCharacter, bonus: boolean) => void;
  destroy: () => void;
};

export const createPrisonGame = (
  parent: HTMLDivElement,
  character: EscapeCharacter,
  callbacks: {
    arrive: () => void;
    proximity: (near: boolean) => void;
    revealed: () => void;
    warning: (message: string) => void;
  },
): PrisonGameBridge => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let talkRequested = false;
  let releaseRequested: { character: EscapeCharacter; bonus: boolean } | null =
    null;

  class PrisonScene extends Phaser.Scene {
    private player?: Phaser.GameObjects.Sprite;
    private gate?: Phaser.GameObjects.Container;
    private guard?: Phaser.GameObjects.Sprite;
    private destination = 60;
    private nearGuard = false;
    private guardLabel?: Phaser.GameObjects.Text;
    private freeing = false;
    private cursors?: {
      left: Phaser.Input.Keyboard.Key;
      right: Phaser.Input.Keyboard.Key;
    };
    private keys?: {
      left: Phaser.Input.Keyboard.Key;
      right: Phaser.Input.Keyboard.Key;
      interact: Phaser.Input.Keyboard.Key;
    };
    private playerKey = `player-${characterKey(character)}`;

    preload() {
      this.load.setCORS("anonymous");
      for (const name of ["sky", "mountains", "ground", "stones1"])
        this.load.image(name, `${ASSET}exterior-${name}.png`);
      for (let i = 1; i <= 8; i++)
        this.load.image(`bat-${i}`, `${ASSET}exterior-bat_frame${i}.png`);
      this.load.atlas("stank", `${ASSET}stank.png`, `${ASSET}stank.json`);
      this.load.atlas("visitor", `${ASSET}visitor.png`, `${ASSET}visitor.json`);
      this.load.atlas(
        this.playerKey,
        spriteSource(character, "png"),
        spriteSource(character, "json"),
      );
      this.load.on("loaderror", () =>
        callbacks.warning(
          "Some artwork could not load. You can still talk to Stank and claim your winnings below.",
        ),
      );
    }

    private animate(key: string) {
      for (const [direction, start] of [
        ["front", 0],
        ["left", 4],
        ["right", 12],
      ] as const) {
        if (!this.anims.exists(`${key}-${direction}`))
          this.anims.create({
            key: `${key}-${direction}`,
            frames: Array.from({ length: 4 }, (_, i) => ({
              key,
              frame: String(start + i),
            })),
            frameRate: 5,
            repeat: -1,
          });
      }
    }

    private actor(x: number, key: string) {
      this.animate(key);
      // The official walkcycle frames include five rows beneath the feet.
      return this.add
        .sprite(x, FLOOR + 5, key, "0")
        .setOrigin(0.5, 1)
        .setDepth(5);
    }

    create() {
      // TileSprite resamples this 300×150 image to a power-of-two texture,
      // baking blur into the pixels. Plain images preserve the native artwork.
      for (const x of [0, 600])
        this.add.image(x, 0, "sky").setOrigin(0).setScale(2);
      for (const x of [0, 497]) {
        this.add.image(x, 65, "mountains").setOrigin(0).setAlpha(0.7);
        this.add.image(x, 91, "ground").setOrigin(0).setDepth(2);
        this.add.image(x, 91, "stones1").setOrigin(0).setDepth(3);
      }
      // A deliberately simple pixel-built gate until the requested prison
      // art is supplied. Coordinates match the brief in docs/forgotten-prison.
      const stone = this.add.graphics().setDepth(2);
      stone.fillStyle(0x151423).fillRect(446, 66, 148, 148);
      stone.fillStyle(0x333146).fillRect(440, 76, 156, 138);
      stone.fillStyle(0x464257).fillRect(436, 72, 164, 7);
      stone.fillStyle(0x272638);
      for (let row = 0; row < 8; row++) {
        stone.fillRect(440, 87 + row * 16, 156, 2);
        for (let col = 0; col < 6; col++)
          stone.fillRect(
            440 + col * 30 + (row % 2 ? 15 : 0),
            79 + row * 16,
            2,
            8,
          );
      }
      stone.fillStyle(0x484357);
      for (let x = 438; x < 599; x += 24) stone.fillRect(x, 58, 16, 14);
      stone.fillStyle(0x211c2d).fillRect(494, 140, 48, 74);
      stone.fillStyle(0x756b7f).fillRect(490, 134, 56, 8);
      stone
        .fillStyle(0x595368)
        .fillRect(488, 142, 6, 72)
        .fillRect(542, 142, 6, 72);
      // An eye-shaped rune above the entrance; no pre-reveal prisoner sprite.
      stone
        .fillStyle(0xb3a17a)
        .fillTriangle(504, 108, 518, 99, 532, 108)
        .fillTriangle(504, 108, 518, 117, 532, 108);
      stone.fillStyle(0x1c1926).fillRect(516, 102, 4, 12);
      const bars = this.add.graphics();
      bars.fillStyle(0x79758a);
      for (let x = 0; x <= 42; x += 7) bars.fillRect(x, 0, 2, 72);
      bars.fillRect(0, 24, 44, 3).fillRect(0, 52, 44, 3);
      this.gate = this.add.container(496, 142, [bars]).setDepth(6);
      const flame = this.add.graphics().setDepth(4);
      flame
        .fillStyle(0x3b2930)
        .fillRect(463, 157, 3, 16)
        .fillRect(566, 157, 3, 16);
      flame
        .fillStyle(0xbf643b)
        .fillRect(460, 149, 9, 10)
        .fillRect(563, 149, 9, 10);
      flame
        .fillStyle(0xe9bd76)
        .fillRect(463, 145, 3, 12)
        .fillRect(566, 145, 3, 12);
      if (!reduced)
        this.tweens.add({
          targets: flame,
          alpha: 0.65,
          duration: 240,
          yoyo: true,
          repeat: -1,
        });
      if (!reduced && this.textures.exists("bat-1")) {
        this.anims.create({
          key: "bat",
          frames: Array.from({ length: 8 }, (_, i) => ({
            key: `bat-${i + 1}`,
          })),
          frameRate: 10,
          repeat: -1,
        });
        const bat = this.add.sprite(245, 57, "bat-1").play("bat");
        this.tweens.add({
          targets: bat,
          x: 345,
          y: 38,
          duration: 6000,
          yoyo: true,
          repeat: -1,
          onYoyo: () => bat.setFlipX(true),
          onRepeat: () => bat.setFlipX(false),
        });
      }
      if (!this.textures.exists(this.playerKey)) {
        this.playerKey = "visitor";
        callbacks.warning(
          "Your character’s sprite is unavailable. A guest sprite stands in for this visit; your claim still goes to your connected wallet.",
        );
      }
      if (this.textures.exists(this.playerKey))
        this.player = this.actor(60, this.playerKey);
      if (this.textures.exists("stank"))
        this.guard = this.actor(GUARD, "stank");
      this.guardLabel = this.add
        .text(GUARD, 153, "STANK", {
          fontFamily: "monospace",
          fontSize: "8px",
          color: "#c7ba9f",
          backgroundColor: "#171322",
        })
        .setOrigin(0.5)
        .setDepth(8);
      if (this.input.keyboard) {
        const keyboard = this.input.keyboard;
        // Capture movement keys only while playing, leaving page controls alone.
        this.cursors = {
          left: this.input.keyboard.addKey("LEFT", false),
          right: this.input.keyboard.addKey("RIGHT", false),
        };
        this.keys = {
          left: this.input.keyboard.addKey("A", false),
          right: this.input.keyboard.addKey("D", false),
          interact: this.input.keyboard.addKey("E", false),
        };
        // Latch the down event: a short tap can begin and end between frames.
        // Key emits this once per press, so holding E outside range won't talk
        // automatically when the visitor later reaches Stank.
        this.keys.interact.on("down", () => {
          if (document.activeElement === this.game.canvas && this.nearGuard)
            talkRequested = true;
        });
        this.input.keyboard.enabled = false;
        const enable = () => {
          keyboard.enabled = true;
          keyboard.addCapture("LEFT,RIGHT,A,D,E");
        };
        const disable = () => {
          keyboard.enabled = false;
          keyboard.removeCapture("LEFT,RIGHT,A,D,E");
          keyboard.resetKeys();
          this.destination = this.player?.x ?? 60;
        };
        this.game.canvas.tabIndex = 0;
        this.game.canvas.setAttribute(
          "aria-label",
          "Walk to the prison with left and right arrows or A and D. Press E by Stank, or use the Talk to Stank button below.",
        );
        this.game.canvas.addEventListener("focus", enable);
        this.game.canvas.addEventListener("blur", disable);
        this.events.once("shutdown", () => {
          disable();
          this.game.canvas.removeEventListener("focus", enable);
          this.game.canvas.removeEventListener("blur", disable);
        });
      }
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
        this.game.canvas.focus({ preventScroll: true });
        if (!this.freeing)
          this.destination = Phaser.Math.Clamp(pointer.x, 24, GUARD - 34);
      });
      // Selecting a visitor removes the focused selector button. Hand focus to
      // the game once it loads, unless the user has already focused something else.
      if (document.activeElement === document.body)
        this.game.canvas.focus({ preventScroll: true });
    }

    private freePrisoner(prisoner: EscapeCharacter, bonus: boolean) {
      this.freeing = true;
      this.player?.anims.stop();
      this.guard?.setFrame("12");
      const coin = this.add
        .rectangle(GUARD - 35, FLOOR - 24, 4, 4, 0xe0bd72)
        .setDepth(9);
      this.tweens.add({
        targets: coin,
        x: GUARD,
        duration: reduced ? 1 : 500,
        onComplete: () => coin.destroy(),
      });
      this.tweens.add({
        targets: this.gate,
        y: 70,
        alpha: 0,
        duration: reduced ? 1 : 1000,
      });
      const key = `rescued-${characterKey(prisoner)}`;
      const reveal = () => {
        if (!this.scene.isActive()) return;
        if (this.textures.exists(key)) {
          const rescued = this.actor(519, key).setDepth(7);
          rescued.play(`${key}-left`);
          this.tweens.add({
            targets: rescued,
            x: GUARD + 42,
            duration: reduced ? 1 : 1800,
            onComplete: () => {
              rescued.anims.stop();
              rescued.setFrame("0");
              callbacks.revealed();
            },
          });
        } else {
          callbacks.warning(
            "The rescue is confirmed. The character sprite is unavailable, but the prize details are shown below.",
          );
          callbacks.revealed();
        }
        if (bonus) {
          const box = this.add.graphics().setDepth(8);
          box.fillStyle(0x84623e).fillRect(548, FLOOR - 17, 17, 16);
          box
            .fillStyle(0xd3b16b)
            .fillRect(548, FLOOR - 17, 17, 3)
            .fillRect(555, FLOOR - 17, 3, 16);
          this.tweens.add({
            targets: box,
            x: -35,
            duration: reduced ? 1 : 1600,
          });
        }
      };
      this.load.atlas(
        key,
        spriteSource(prisoner, "png"),
        spriteSource(prisoner, "json"),
      );
      this.load.once("complete", reveal);
      this.load.start();
    }

    update(_time: number, delta: number) {
      if (releaseRequested && !this.freeing) {
        this.freePrisoner(releaseRequested.character, releaseRequested.bonus);
        releaseRequested = null;
      }
      if (this.freeing) return;
      const speed = Math.min(delta, 50) * 0.065;
      const focus = document.activeElement === this.game.canvas;
      if (focus && (this.cursors?.left.isDown || this.keys?.left.isDown))
        this.destination = Math.max(24, (this.player?.x ?? 60) - speed);
      if (focus && (this.cursors?.right.isDown || this.keys?.right.isDown))
        this.destination = Math.min(GUARD - 34, (this.player?.x ?? 60) + speed);
      if (this.player) {
        const difference = this.destination - this.player.x;
        if (Math.abs(difference) > 0.5) {
          this.player.x +=
            Math.sign(difference) * Math.min(speed, Math.abs(difference));
          if (!reduced)
            this.player.play(
              `${this.playerKey}-${difference > 0 ? "right" : "left"}`,
              true,
            );
        } else this.player.anims.stop();
      }
      const near = !this.player || this.player.x >= GUARD - 56;
      if (near !== this.nearGuard) {
        this.nearGuard = near;
        this.guardLabel?.setText(near ? "[E] TALK" : "STANK");
        callbacks.proximity(near);
      }
      if (near && talkRequested) {
        this.destination = this.player?.x ?? 60;
        this.player?.anims.stop();
        this.player?.setFrame("12");
        this.guard?.setFrame("4");
        this.guardLabel?.setVisible(false);
        callbacks.arrive();
      }
      talkRequested = false;
    }
  }
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 608,
    height: 240,
    backgroundColor: "#141020",
    pixelArt: true,
    roundPixels: true,
    render: { antialias: false },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    input: { mouse: { preventDefaultWheel: false } },
    scene: PrisonScene,
    audio: { noAudio: true },
  });
  return {
    talk: () => {
      talkRequested = true;
    },
    release: (rescued, bonus) => {
      releaseRequested = { character: rescued, bonus };
    },
    destroy: () => game.destroy(true),
  };
};
