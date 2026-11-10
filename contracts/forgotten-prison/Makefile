BULLOAK ?= $(if $(wildcard .tools/bin/bulloak),.tools/bin/bulloak,bulloak)
FUZZ_SEED ?= 0x000000000000000000000000000000000000000000000000000000000000f012
FUZZ_PATHS = test/{Fuzz.t.sol,LifecycleFuzz.t.sol,invariant/*.t.sol}

.PHONY: deps check trees test fork coverage gas gas-check fuzz fuzz-deep fuzz-mutants
deps:
	python3 scripts/install-deps.py

trees:
	$(BULLOAK) check -m 'test/unit/*.tree'

test:
	forge test --no-match-path 'test/fork/*'

check: trees
	forge fmt --check
	forge test --no-match-path 'test/fork/*' --gas-snapshot-check true

gas:
	forge test --match-contract GasTest --gas-snapshot-check false --gas-snapshot-emit true

gas-check:
	forge test --match-contract GasTest --gas-snapshot-check true --gas-snapshot-emit false

fuzz:
	forge test --match-path '$(FUZZ_PATHS)' --fuzz-seed $(FUZZ_SEED) -vv

fuzz-deep:
	FOUNDRY_PROFILE=deep forge test --match-path '$(FUZZ_PATHS)' --fuzz-seed $(FUZZ_SEED) -vv

fuzz-mutants:
	python3 scripts/check-fuzz-mutants.py

fork:
	forge test --match-path 'test/fork/*' -vvv

coverage:
	forge coverage --no-match-path 'test/fork/*' --report summary
