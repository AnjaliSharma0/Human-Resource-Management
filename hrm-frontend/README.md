
Feature	Endpoint	Token Needed
Apply leave	POST /leave	Employee
View own leave history	GET /leave/employee/:id	Employee
View all leave requests	GET /leave	Admin / Manager
Approve / reject leave	PUT /leave/:id/status	Admin / Manager
Create holiday	POST /holiday	Admin / Manager
View all holidays	GET /holiday	Any authenticated
Leave calendar	GET /leave/calendar	Any authenticated
View leave balance	GET /leave/balance/:id	Employee / Admin





1️⃣ Recruitment & Applicant Tracking (ATS)
Entities and Fields

JobRequisition

id (PK)

title

department

location

description

status (Draft / PendingApproval / Approved / Rejected)

createdBy (FK → Employee)

approvedBy (FK → Employee)

createdAt

updatedAt

JobPosting

id (PK)

jobRequisitionId (FK → JobRequisition)

isInternal (boolean)

isExternal (boolean)

postingStartDate

postingEndDate

createdAt

updatedAt

Candidate

id (PK)

firstName

lastName

email

phone

resumeUrl / resumeFile

appliedFor (FK → JobPosting)

status (Applied / InReview / Interview / Offered / Rejected)

appliedAt

Interview

id (PK)

candidateId (FK → Candidate)

interviewerId (FK → Employee)

dateTime

mode (Online / Offline)

feedback (nullable)

status (Scheduled / Completed / Cancelled)

OfferLetter

id (PK)

candidateId (FK → Candidate)

offerFileUrl

status (Sent / Accepted / Rejected)

sentAt

acceptedAt (nullable)

2️⃣ Training & Development
Entities and Fields

TrainingProgram

id (PK)

title

description

type (InstructorLed / SelfPaced)

startDate

endDate

createdBy (FK → Employee/Admin)

status (Draft / Published / Completed)

createdAt

updatedAt

TrainingEnrollment

id (PK)

trainingProgramId (FK → TrainingProgram)

employeeId (FK → Employee)

status (Enrolled / Completed / Dropped)

enrolledAt

completedAt (nullable)

TrainingFeedback

id (PK)

trainingProgramId (FK → TrainingProgram)

employeeId (FK → Employee)

rating (1-5)

comments

submittedAt

EmployeeSkillMatrix

id (PK)

employeeId (FK → Employee)

skillName

skillLevel (Beginner / Intermediate / Advanced / Expert)

lastUpdated

3️⃣ Backend Architecture (NestJS + TypeORM)
Modules

RecruitmentModule

Entities: JobRequisition, JobPosting, Candidate, Interview, OfferLetter

Services: Create/Approve Requisition, Post Job, Manage Applications, Schedule Interviews, Generate Offer Letters

Controllers: Role-based endpoints for Admin / Employee

TrainingModule

Entities: TrainingProgram, TrainingEnrollment, TrainingFeedback, EmployeeSkillMatrix

Services: CRUD TrainingProgram, Enroll/Complete Training, Feedback, Skill Tracking

Controllers: Role-based endpoints for Admin / Employee

Role-based Access Control

Admin:

Can approve job requisitions

Create job postings

Schedule interviews

Publish training programs

Give feedback and view all enrollments

Employee:

Apply for jobs

View own interview schedule

Enroll in training

Submit training feedback

View own skills

4️⃣ Frontend Structure (Next.js / React)
ATS Pages

Admin

Job Requisition Management (Create / Approve / Reject)

Job Posting Management

Candidate Review

Interview Scheduling

Offer Letter Management

Employee

Job Listings (Internal/External)

Apply for Job

View Interview Schedule

View Offer Letters

Training & Development Pages

Admin

Create / Publish Training Program

Track Enrollments

Give Feedback

View Skill Matrix

Employee

Browse Trainings

Enroll in Training

Submit Feedback

View Own Skill Matrix

5️⃣ Sample Frontend Form Fields

Job Requisition Form (Admin)

Title

Department

Location

Description

Status (Draft / PendingApproval)

Candidate Application Form (Employee)

First Name

Last Name

Email

Phone

Resume Upload

Apply for Job (Dropdown of Open Job Postings)

Training Program Form (Admin)

Title

Description

Type (InstructorLed / SelfPaced)

Start Date / End Date

Status (Draft / Published)

Training Enrollment (Employee)

Select Training Program

Enroll Button

Training Feedback Form

Rating (1-5)

Comments





📚 Courses
POST   /training/courses
GET    /training/courses
DELETE /training/courses/:id
🎓 Enrollment
POST   /training/enroll
GET    /training/enrollments
GET    /training/employee/:employeeId/courses
⭐ Feedback
POST   /training/feedback

GET /skills/matrix
GET /skills/employee/:id





// enroll
POST /training/enroll
{
  employeeId: 1,
  courseId: 2
}

// get employee courses
GET /training/employee/1/courses

// submit feedback
POST /training/feedback
{
  enrollmentId: 5,
  feedback: "Great course!"
}