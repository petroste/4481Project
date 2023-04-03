#!/bin/bash
expect <(cat << EOF
spawn ory proxy https://helpdesk.sidharth.me --port 8080 --project zen-burnell-y0u0rxqerr --rewrite-host --allowed-cors-origins https://helpdesk.sidharth.me
expect "*"
send "n\r"
interact
EOF
)
