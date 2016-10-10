mkdir \\storage1\repo$\%1
dirquota q a /p:e:\repo$\%1 /limit:100mb /remote:storage1
dsadd user "cn=%1,ou=cloudware ou,dc=cloudwarehub,dc=com" -disabled no -pwd p@ssw0rd -mustchpwd no -memberof "cn=cloudware users,cn=users,dc=cloudwarehub,dc=com" -acctexpires never -hmdir \\storage1\repo$\%1 -hmdrv Z:
icacls \\storage1\repo$\%1 /grant %1:(OI)(CI)F

cmdkey /generic:TERMSRV/COMPUTE1 /user:CLOUDWAREHUB\%1 /pass:p@ssw0rd
start /B mstsc /v:COMPUTE1 /w: 1440 /h: 900