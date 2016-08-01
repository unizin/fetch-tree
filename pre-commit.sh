#!/bin/bash

set -e

npm run lint
npm test

# Only do this check when run from the root of the project.
if [ -d .git ] && [ ! -f .git/hooks/pre-commit ]; then
    echo "Installing pre-commit hook"
    ln -s ../../pre-commit.sh .git/hooks/pre-commit
fi
