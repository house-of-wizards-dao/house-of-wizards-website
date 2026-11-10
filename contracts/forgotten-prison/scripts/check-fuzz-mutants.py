#!/usr/bin/env python3
"""Check that lifecycle properties reject three deliberately faulty copies of the auction.

Only temporary source copies are mutated. Logs and the result summary are written
under ignored .tools/. Installed dependencies are read through a shared symlink.
"""
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
MUTATIONS = [
    (
        "duplicate-vrf-overwrite",
        "draw.status != DrawStatus.Requested || draw.requestId != requestId",
        "(draw.status != DrawStatus.Requested && draw.status != DrawStatus.Ready) || draw.requestId != requestId",
        "testFuzz_FrozenDrawSurvivesLateGiftsReturnsAndDuplicateCallbacks",
    ),
    (
        "wrong-selection-index",
        "uint256 index = draw.randomWord % draw.inventorySize;",
        "uint256 index = (draw.randomWord ^ 1) % draw.inventorySize;",
        "testFuzz_FrozenDrawSurvivesLateGiftsReturnsAndDuplicateCallbacks",
    ),
    (
        "reopened-historical-claims",
        "pool.assets.push(Asset(collection, tokenId));",
        "_draws[1].claimed = false; _draws[1].bonusClaimed = false; pool.assets.push(Asset(collection, tokenId));",
        "testFuzz_RepeatedWinsKeepEveryHistoricalClaimConsumed",
    ),
]


def main():
    """Run each mutant independently and require a failing property, not a build/tool error."""
    output = ROOT / ".tools"
    output.mkdir(exist_ok=True)
    results = []
    with tempfile.TemporaryDirectory(prefix="forgotten-prison-fuzz-mutants-") as temporary:
        scratch = Path(temporary)
        for folder in ("src", "test"):
            shutil.copytree(ROOT / folder, scratch / folder)
        shutil.copy2(ROOT / "foundry.toml", scratch / "foundry.toml")
        (scratch / "lib").symlink_to(ROOT / "lib", target_is_directory=True)
        source = scratch / "src/ForgottenPrison.sol"
        original = source.read_text()
        for name, old, new, test in MUTATIONS:
            if original.count(old) != 1:
                raise SystemExit(f"Update the {name} mutation: its source anchor is no longer unique.")
            source.write_text(original.replace(old, new))
            shutil.rmtree(scratch / "cache/fuzz", ignore_errors=True)
            command = [
                "forge", "test", "--offline", "--match-contract", "LifecycleFuzzTest",
                "--match-test", test, "--fuzz-runs", "16", "--fuzz-seed", "0xf012", "-vv",
            ]
            run = subprocess.run(command, cwd=scratch, text=True, stdout=subprocess.PIPE,
                                 stderr=subprocess.STDOUT, timeout=300)
            (output / f"mutant-{name}.log").write_text(run.stdout)
            failures = [line for line in run.stdout.splitlines() if "[FAIL: assertion failed" in line]
            caught = run.returncode != 0 and bool(failures)
            results.append({"mutation": name, "caught": caught, "test": test, "failure": failures[:1]})
            (output / "fuzz-mutation-results.json").write_text(json.dumps(results, indent=2) + "\n")
            if not caught:
                raise SystemExit(f"{name}: no failing property; inspect .tools/mutant-{name}.log")
            print(f"{name}: caught by {test}", flush=True)
    print("All three mutants rejected; repository contract sources were not modified.")


if __name__ == "__main__":
    main()
