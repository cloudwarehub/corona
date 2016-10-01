mkdir \\storage1\data$\%1
dirquota q a /p:e:\data$\%1 /limit:100mb /remote:storage1
dsadd user "cn=%1,ou=cloudware ou,dc=cloudwarehub,dc=com" -disabled no -pwd p@ssw0rd -mustchpwd no -memberof "cn=cloudware users,cn=users,dc=cloudwarehub,dc=com" -acctexpires never -hmdir \\storage1\data$\%1 -hmdrv Z:
