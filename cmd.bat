net user %1 p@ssw0rd /add
net localgroup "Remote Desktop Users" %1 /add
reg load HKU\%1 C:\users\%1\NTUSER.DAT
cmdkey /generic:TERMSRV/localhost /user:%1 /pass:p@ssw0rd
start /B mstsc /v:localhost