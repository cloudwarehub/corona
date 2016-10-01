net user %1 p@ssw0rd /add
net localgroup "Remote Desktop Users" %1 /add
cmdkey /generic:TERMSRV/localhost /user:%1 /pass:p@ssw0rd
start /B mstsc /v:localhost /w: 1440 /h: 900