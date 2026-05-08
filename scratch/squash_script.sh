# Squash commits with <= 3 min intervals
# Start from oldest to newest

# Group 1: 17:36 to 17:41 (May 6)
# 331a46f, 4843069, 977a946
git reset --soft 145e03c
git commit -m "chore: initial project cleanup and security hardening"

# Group 2: 17:39 to 17:42 (May 8)
# e3a77f0, 3cb045d, 04ba861
git reset --soft 5d7dcb3 # Wait, 5d7dcb3 is 12:06
# Let's check the log again to be sure of the parent.
# 5098caf is 18:03? No.
# I'll re-list the log with more detail.
