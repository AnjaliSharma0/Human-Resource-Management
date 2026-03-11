app/
  layout.tsx            # Main layout (Sidebar + Header + main content)
  page.tsx              # Dashboard page ("/")
  auth/
    login/
      page.tsx          # "/auth/login"
    register/
      page.tsx          # "/auth/register"
  employees/
    page.tsx            # "/employees" - list page
    [id]/
      page.tsx          # "/employees/:id" - employee profile
  attendance/
    page.tsx            # "/attendance"
    [id]/
      page.tsx          # "/attendance/:id" - view attendance of specific employee
  leave/
    page.tsx            # "/leave"
    [id]/
      page.tsx          # "/leave/:id" - view leave requests of employee
  payroll/
    page.tsx            # "/payroll"
    [id]/
      page.tsx          # "/payroll/:id" - payroll details
  performance/
    page.tsx            # "/performance"
    [id]/
      page.tsx          # "/performance/:id"
  recruitment/
    page.tsx
    job/
      page.tsx
    candidate/
      page.tsx
  training/
    page.tsx
    [id]/
      page.tsx
  onboarding/
    page.tsx
    [id]/
      page.tsx
  org/
    page.tsx
    [id]/
      page.tsx
  reports/
    page.tsx
  integrations/
    page.tsx