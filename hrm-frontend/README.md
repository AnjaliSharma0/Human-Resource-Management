Feature	Endpoint	Token Needed
Apply leave	POST /leave	Employee
View own leave history	GET /leave/employee/:id	Employee
View all leave requests	GET /leave	Admin / Manager
Approve / reject leave	PUT /leave/:id/status	Admin / Manager
Create holiday	POST /holiday	Admin / Manager
View all holidays	GET /holiday	Any authenticated
Leave calendar	GET /leave/calendar	Any authenticated
View leave balance	GET /leave/balance/:id	Employee / Admin