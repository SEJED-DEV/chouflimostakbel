#!/bin/bash
# Starts the production server for this checkout.
#
#   pm2 start start.sh --name chouflimostakbel
#
# It is committed on purpose. `scripts/deploy.sh` runs `git clean -fd` to
# remove build leftovers, which deletes anything untracked - and this file is
# what pm2 runs. Keeping it in the repository means a deploy can never clean
# away the very thing it is about to restart.
#
# The port matches the one the reverse proxy in front of the site expects.
cd "$(dirname "$0")"
export PORT=3016
export HOSTNAME=0.0.0.0
exec npx next start -p 3016 -H 0.0.0.0
