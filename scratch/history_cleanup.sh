# Clean history by squashing bursts and checkpoints
# Target: Squash all <= 3min intervals

# 1. Squash May 6th burst (17:36-17:41)
git reset --soft 145e03c
git commit -m "chore: initial cleanup and security hardening"
# This puts us at a new commit on top of 145e03c.
# But wait, this breaks the history of later commits.
# I need to do a full rebase or re-apply.

# Strategy: 
# git checkout -b cleanup-branch
# git reset --soft [ORIGIN_BASE]
# Then re-commit in logical chunks.

git checkout -b cleanup-branch fd8dc1c

# Chunk 1: Initial Setup
git cherry-pick fd8dc1c..331a46f
# (Actually, I'll just do logical checkpoints)

git reset --soft fd8dc1c
git commit -m "feat: initial icon architecture and Tonal Slider concept"

# Chunk 2: V1.0 Polish (May 6)
# Covering up to f2fd6c5
git cherry-pick 331a46f..f2fd6c5
git reset --soft HEAD~4
git commit -m "feat: v1.0 engine hardening and security cleanup"

# Chunk 3: V2.0 Preparation (Early May 8)
# Covering up to 5d7dcb3
git cherry-pick f2fd6c5..5d7dcb3
git reset --soft HEAD~2
git commit -m "chore: v2.0 architectural checkpoints"

# Chunk 4: V2.0 UI & Docs (17:39-18:58)
# Covering up to 7911e30
git cherry-pick 5d7dcb3..7911e30
git reset --soft HEAD~5
git commit -m "feat: finalize Tonal v2.0 UI and motion system"

# Chunk 5: Engine Updates (19:02-19:21)
# Covering up to 861b078
git cherry-pick 7911e30..861b078
git reset --soft HEAD~8
git commit -m "feat: core engine optimization and system updates"

# Chunk 6: Final Hardening (19:31-20:33)
# Covering up to da7ac52
git cherry-pick 861b078..da7ac52
git reset --soft HEAD~8
git commit -m "feat: structural integrity and anti-hallucination hardening"

# Chunk 7: The Final Audit Fixes
git cherry-pick 62beb4b
# (Already squashed)

# Final step: Force push main
git checkout main
git reset --hard cleanup-branch
git push --force
