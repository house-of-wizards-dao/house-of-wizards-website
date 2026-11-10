BULLOAK ?= $(if $(wildcard .tools/bin/bulloak),.tools/bin/bulloak,bulloak)

.PHONY: deps check trees test fork coverage
deps:
	python3 scripts/install-deps.py

trees:
	$(BULLOAK) check -m 'test/unit/*.tree'

test:
	forge test --no-match-path 'test/fork/*'

check: trees
	forge fmt --check
	forge test --no-match-path 'test/fork/*'

fork:
	forge test --match-path 'test/fork/*' -vvv

coverage:
	forge coverage --no-match-path 'test/fork/*' --report summary
