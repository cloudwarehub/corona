net user guodong p@ssw0rd /add
net localgroup "Remote Desktop Users" guodong /add
reg load HKU\guodong C:\users\guodong\NTUSER.DAT
cmdkey /generic:TERMSRV/localhost /user:guodong /pass:p@ssw0rd
start /B mstsc /v:localhost