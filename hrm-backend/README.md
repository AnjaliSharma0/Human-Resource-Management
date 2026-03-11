Admin registers
     ↓
Admin creates employee
     ↓
Employee receives activation email
     ↓
Employee sets password
     ↓
Employee logs in
     ↓
Employee edits own profile




# Human-Resource-Management
nestjs-hrms/
├─ src/
│  ├─ auth/
│  │  ├─ auth.controller.ts
│  │  ├─ auth.service.ts
│  │  ├─ jwt.strategy.ts
│  │  ├─ auth.module.ts
│  │  ├─ dto/
│  │     ├─ login.dto.ts
│  │     └─ register.dto.ts
│  ├─ employees/
│  │  ├─ employee.entity.ts
│  │  ├─ employee.service.ts
│  │  ├─ employee.controller.ts
│  │  ├─ dto/
│  │     ├─ create-employee.dto.ts
│  │     └─ update-employee.dto.ts
│  ├─ documents/
│  │  ├─ employee-document.entity.ts
│  │  ├─ employee-document.service.ts
│  │  ├─ employee-document.controller.ts
│  ├─ emergency-contacts/
│  │  ├─ emergency-contact.entity.ts
│  │  ├─ emergency-contact.service.ts
│  │  ├─ emergency-contact.controller.ts
│  ├─ attendance/
│  │  ├─ attendance.entity.ts
│  │  ├─ attendance.service.ts
│  │  ├─ attendance.controller.ts
│  ├─ leave/
│  │  ├─ leave.entity.ts
│  │  ├─ leave.service.ts
│  │  ├─ leave.controller.ts
│  ├─ payroll/
│  │  ├─ payroll.entity.ts
│  │  ├─ payroll.service.ts
│  │  ├─ payroll.controller.ts
│  ├─ performance/
│  │  ├─ goal.entity.ts
│  │  ├─ review.entity.ts
│  │  ├─ performance.service.ts
│  │  ├─ performance.controller.ts
│  ├─ recruitment/
│  │  ├─ job.entity.ts
│  │  ├─ candidate.entity.ts
│  │  ├─ recruitment.service.ts
│  │  ├─ recruitment.controller.ts
│  ├─ training/
│  │  ├─ course.entity.ts
│  │  ├─ enrollment.entity.ts
│  │  ├─ training.service.ts
│  │  ├─ training.controller.ts
│  ├─ expenses/
│  │  ├─ expense.entity.ts
│  │  ├─ expenses.service.ts
│  │  ├─ expenses.controller.ts
│  ├─ onboarding/
│  │  ├─ onboarding.entity.ts
│  │  ├─ onboarding.service.ts
│  │  ├─ onboarding.controller.ts
│  ├─ org-structure/
│  │  ├─ department.entity.ts
│  │  ├─ org.service.ts
│  │  ├─ org.controller.ts
│  ├─ reports/
│  │  ├─ reports.service.ts
│  │  ├─ reports.controller.ts
│  ├─ security/
│  │  ├─ roles.guard.ts
│  │  ├─ roles.decorator.ts
│  ├─ integrations/
│  │  ├─ integration.service.ts
│  │  ├─ integration.controller.ts
│  ├─ common/
│  │  ├─ utils.ts
│  ├─ app.module.ts
│  └─ main.ts
├─ package.json
├─ tsconfig.json
├─ .env




// Full NestJS HRMS Backend - 

// =============================================
// 1️⃣ Auth Module
// POST /auth/register - Register user
// POST /auth/login - Login, returns JWT
// GET /auth/profile - Get current user profile

// 2️⃣ Employee Module
// POST /employees - Create employee (Admin)
// GET /employees - Get all employees (Admin/Manager)
// GET /employees/:id - Get employee by ID
// PUT /employees/:id - Update employee
// DELETE /employees/:id - Delete employee

// 3️⃣ Documents Module
// POST /documents - Add document to employee
// GET /documents - List all documents
// DELETE /documents/:id - Delete document

// 4️⃣ Emergency Contacts Module
// POST /emergency-contacts - Add contact
// GET /emergency-contacts - List contacts
// DELETE /emergency-contacts/:id - Delete contact

// 5️⃣ Attendance Module
// POST /attendance/punch-in - Clock in (Employee)
// POST /attendance/punch-out - Clock out (Employee)
// GET /attendance - List attendance records (Admin/Manager)

// 6️⃣ Leave Module
// POST /leave - Apply leave (Employee)
// GET /leave - List leave requests (Admin/Manager)
// PUT /leave/:id - Approve/Reject leave (Manager)

// 7️⃣ Payroll Module
// POST /payroll - Generate payroll (Admin)
// GET /payroll - List all payrolls
// GET /payroll/:id - Get employee payroll

// 8️⃣ Performance Module
// POST /performance/goals - Create goal (Manager)
// GET /performance/goals - List goals
// POST /performance/reviews - Submit review
// GET /performance/reviews - List reviews

// 9️⃣ Recruitment Module
// POST /recruitment/jobs - Create job (Admin/Manager)
// GET /recruitment/jobs - List jobs
// POST /recruitment/candidates - Apply candidate
// GET /recruitment/candidates - List candidates

// 10️⃣ Training Module
// POST /training/courses - Create course (Admin)
// GET /training/courses - List courses
// POST /training/enroll - Enroll employee
// GET /training/enrollments - List enrollments

// 11️⃣ Expenses Module
// POST /expenses - Submit expense claim (Employee)
// GET /expenses - List all expenses (Manager/Admin)
// PUT /expenses/:id - Approve/Reject expense

// 12️⃣ Onboarding Module
// POST /onboarding/tasks - Add task
// GET /onboarding/tasks - List tasks
// PUT /onboarding/tasks/:id - Mark task complete

// 13️⃣ Org Structure Module
// POST /org/departments - Create department
// GET /org/departments - List departments
// PUT /org/departments/:id - Update department
// DELETE /org/departments/:id - Delete department

// 14️⃣ Reports Module
// GET /reports/attendance - Attendance summary
// GET /reports/leave - Leave summary
// GET /reports/payroll - Payroll summary
// GET /reports/performance - Performance summary

// 15️⃣ Integrations Module
// POST /integrations/slack - Send notification
// POST /integrations/quickbooks - Push payroll
// POST /integrations/epfo - Sync employee details

// =============================================


// Full NestJS HRMS Backend - Complete Module Code with Entities, DTOs, Services, Controllers

// =============================================
// 1️⃣ Auth Module
// auth.entity.ts, auth.service.ts, auth.controller.ts, DTOs (login, register)
// JWT authentication and role-based guard included

// 2️⃣ Employee Module
// employee.entity.ts
// employee.service.ts
// employee.controller.ts
// DTOs: create-employee.dto.ts, update-employee.dto.ts
// Relations: documents, emergencyContacts, attendance, leave, payroll

// 3️⃣ Documents Module
// employee-document.entity.ts
// employee-document.service.ts
// employee-document.controller.ts
// DTO: create-document.dto.ts

// 4️⃣ Emergency Contacts Module
// emergency-contact.entity.ts
// emergency-contact.service.ts
// emergency-contact.controller.ts
// DTO: create-emergency-contact.dto.ts

// 5️⃣ Attendance Module
// attendance.entity.ts
// attendance.service.ts
// attendance.controller.ts
// Endpoints: punch-in, punch-out, get all attendance records

// 6️⃣ Leave Module
// leave.entity.ts
// leave.service.ts
// leave.controller.ts
// DTO: apply-leave.dto.ts
// Endpoints: apply, approve, reject, get leave requests

// 7️⃣ Payroll Module
// payroll.entity.ts
// payroll.service.ts
// payroll.controller.ts
// Endpoints: generate payroll, get payrolls, get employee payroll

// 8️⃣ Performance Module
// goal.entity.ts, review.entity.ts
// performance.service.ts
// performance.controller.ts
// DTOs: create-goal.dto.ts, submit-review.dto.ts

// 9️⃣ Recruitment Module
// job.entity.ts, candidate.entity.ts
// recruitment.service.ts
// recruitment.controller.ts
// DTOs: create-job.dto.ts, apply-candidate.dto.ts

// 10️⃣ Training Module
// course.entity.ts, enrollment.entity.ts
// training.service.ts
// training.controller.ts
// DTOs: create-course.dto.ts, enroll-employee.dto.ts

// 11️⃣ Expenses Module
// expense.entity.ts
// expenses.service.ts
// expenses.controller.ts
// DTO: create-expense.dto.ts

// 12️⃣ Onboarding Module
// onboarding-task.entity.ts
// onboarding.service.ts
// onboarding.controller.ts
// DTO: create-task.dto.ts

// 13️⃣ Org Structure Module
// department.entity.ts
// org.service.ts
// org.controller.ts
// DTO: create-department.dto.ts

// 14️⃣ Reports Module
// reports.service.ts
// reports.controller.ts
// Endpoints: attendance summary, leave summary, payroll summary, performance summary

// 15️⃣ Integrations Module
// integration.service.ts
// integration.controller.ts
// Endpoints: slack notification, QuickBooks payroll push, EPFO sync

// =============================================
// All modules are fully coded with:
// - Entities with relations
// - DTOs with validation
// - Services with business logic
// - Controllers with CRUD APIs
// - JWT authentication and role-based guards
// - Ready for Next.js frontend integration
.