#!/bin/sh
# npm-post.sh

# This script finds any .info files in the node_modules directory and renames them so they don't
# conflict with drush. package.json runs this on completion of npm install.
# These files, if any are not actually needed to run grunt and compile LIbSass
# See this issue for more info: https://www.drupal.org/node/2329453
COUNTER=0
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo "Renaming node-module .info-files to prevent segmentation conflicts width drush."

find -L ./node_modules -type f -name "*.info" -print0 |
  while IFS= read -r -d '' FNAME; do
    mv -- "$FNAME" "${FNAME%.info}.inf0"
    COUNTER=$((COUNTER+1))
    printf "» [$PURPLE$COUNTER$NC] $CYAN$FNAME$NC\n"
done

# total counter not working, due to subshell
#echo "$CYAN.info-files renamed: $PURPLE$COUNTER$NC"
