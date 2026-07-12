#!/bin/bash

repo="svk-vasanthkumar/AssetFlow-Enterprise-Management"
branch=$(git branch --show-current)

cd /e/projects/server/client || exit 1

git status --porcelain src | while read -r status file
do
    echo "Processing $file"
    git add "$file"
    git commit -m "Update $file"
    git push origin "$branch"
done