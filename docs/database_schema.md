# Anabat School Management System - Database Schema

## Core Tables

### Branch Management

```
branches
- id (PK)
- name
- code
- address
- contact_info
- status
- created_at
- updated_at

branch_settings
- id (PK)
- branch_id (FK)
- setting_key
- setting_value
- created_at
- updated_at
```

### User Management

```
users
- id (PK)
- branch_id (FK) (nullable for multi-branch users)
- name
- email
- password
- phone
- status
- remember_token
- created_at
- updated_at

roles
- id (PK)
- name
- description
- created_at
- updated_at

permissions
- id (PK)
- name
- description
- created_at
- updated_at

role_permissions
- id (PK)
- role_id (FK)
- permission_id (FK)
- created_at
- updated_at

user_roles
- id (PK)
- user_id (FK)
- role_id (FK)
- branch_id (FK) (for branch-specific roles)
- created_at
- updated_at
```

## Admissions Module

```
leads
- id (PK)
- branch_id (FK)
- first_name
- last_name
- contact_number
- email
- address
- inquiry_for (class/course)
- source
- status
- assigned_to (FK to users)
- created_at
- updated_at

lead_followups
- id (PK)
- lead_id (FK)
- user_id (FK)
- followup_date
- remarks
- next_followup_date
- status
- created_at
- updated_at
```

## Student Module

```
students
- id (PK)
- branch_id (FK)
- admission_no
- first_name
- last_name
- date_of_birth
- gender
- address
- contact_number
- email
- blood_group
- photo_path
- status
- admission_date
- created_at
- updated_at

guardians
- id (PK)
- first_name
- last_name
- relation
- occupation
- contact_number
- alternate_contact
- email
- address
- created_at
- updated_at

student_guardians
- id (PK)
- student_id (FK)
- guardian_id (FK)
- is_primary
- created_at
- updated_at

academic_years
- id (PK)
- branch_id (FK)
- name
- start_date
- end_date
- is_active
- created_at
- updated_at

classes
- id (PK)
- branch_id (FK)
- name
- description
- created_at
- updated_at

sections
- id (PK)
- branch_id (FK)
- name
- created_at
- updated_at

class_sections
- id (PK)
- class_id (FK)
- section_id (FK)
- created_at
- updated_at

student_enrollments
- id (PK)
- student_id (FK)
- academic_year_id (FK)
- class_section_id (FK)
- enrollment_date
- status
- roll_number
- created_at
- updated_at
```

## Attendance Module

```
attendance_records
- id (PK)
- branch_id (FK)
- student_id (FK)
- class_section_id (FK)
- academic_year_id (FK)
- date
- status (present/absent/late/excused)
- remarks
- recorded_by (FK to users)
- created_at
- updated_at

leave_requests
- id (PK)
- branch_id (FK)
- student_id (FK) (nullable)
- employee_id (FK) (nullable)
- start_date
- end_date
- leave_type
- reason
- status (pending/approved/rejected)
- approved_by (FK to users)
- created_at
- updated_at
```

## Communication Module

```
sms_templates
- id (PK)
- branch_id (FK)
- name
- content
- variables
- created_at
- updated_at

sms_logs
- id (PK)
- branch_id (FK)
- recipient
- content
- status
- error_message
- sent_at
- created_at
- updated_at

sms_events
- id (PK)
- branch_id (FK)
- event_type
- template_id (FK)
- is_active
- created_at
- updated_at
```

## Exams Module

```
exam_periods
- id (PK)
- branch_id (FK)
- academic_year_id (FK)
- name
- start_date
- end_date
- remarks
- created_at
- updated_at

exam_types
- id (PK)
- branch_id (FK)
- name
- description
- created_at
- updated_at

exams
- id (PK)
- branch_id (FK)
- exam_period_id (FK)
- exam_type_id (FK)
- class_section_id (FK)
- subject_id (FK)
- exam_date
- start_time
- end_time
- total_marks
- passing_marks
- created_at
- updated_at

subjects
- id (PK)
- branch_id (FK)
- name
- code
- created_at
- updated_at

class_subjects
- id (PK)
- class_id (FK)
- subject_id (FK)
- created_at
- updated_at

exam_marks
- id (PK)
- exam_id (FK)
- student_id (FK)
- marks_obtained
- remarks
- created_by (FK to users)
- created_at
- updated_at

grading_scales
- id (PK)
- branch_id (FK)
- name
- created_at
- updated_at

grade_criteria
- id (PK)
- grading_scale_id (FK)
- min_percentage
- max_percentage
- grade
- grade_point
- description
- created_at
- updated_at
```

## Billing Module

```
fee_structures
- id (PK)
- branch_id (FK)
- academic_year_id (FK)
- class_id (FK) (nullable)
- name
- description
- created_at
- updated_at

fee_categories
- id (PK)
- branch_id (FK)
- name
- description
- frequency (monthly/quarterly/yearly/once)
- created_at
- updated_at

fee_structure_details
- id (PK)
- fee_structure_id (FK)
- fee_category_id (FK)
- amount
- created_at
- updated_at

student_fees
- id (PK)
- branch_id (FK)
- student_id (FK)
- fee_structure_id (FK)
- fee_category_id (FK)
- amount
- discount_amount
- net_amount
- due_date
- status (pending/partial/paid)
- academic_year_id (FK)
- month (for monthly fees)
- created_at
- updated_at

payments
- id (PK)
- branch_id (FK)
- student_id (FK)
- payment_date
- amount
- payment_method
- reference_number
- remarks
- collected_by (FK to users)
- created_at
- updated_at

payment_details
- id (PK)
- payment_id (FK)
- student_fee_id (FK)
- amount
- created_at
- updated_at

receipts
- id (PK)
- branch_id (FK)
- payment_id (FK)
- receipt_number
- generated_on
- created_at
- updated_at
```

## HR Module

```
departments
- id (PK)
- branch_id (FK)
- name
- description
- created_at
- updated_at

designations
- id (PK)
- branch_id (FK)
- name
- description
- created_at
- updated_at

employees
- id (PK)
- branch_id (FK)
- employee_code
- first_name
- last_name
- department_id (FK)
- designation_id (FK)
- joining_date
- qualification
- experience
- contact_number
- email
- address
- status
- user_id (FK) (nullable, for login access)
- created_at
- updated_at

employee_attendance
- id (PK)
- branch_id (FK)
- employee_id (FK)
- date
- status (present/absent/late/half-day)
- check_in_time
- check_out_time
- remarks
- created_at
- updated_at
```

## Payroll Module

```
salary_structures
- id (PK)
- branch_id (FK)
- name
- description
- created_at
- updated_at

salary_components
- id (PK)
- branch_id (FK)
- name
- type (earning/deduction)
- calculation_type (fixed/percentage)
- created_at
- updated_at

employee_salary_structures
- id (PK)
- employee_id (FK)
- salary_structure_id (FK)
- effective_date
- created_at
- updated_at

employee_salary_components
- id (PK)
- employee_salary_structure_id (FK)
- salary_component_id (FK)
- amount
- percentage
- created_at
- updated_at

payroll_runs
- id (PK)
- branch_id (FK)
- month
- year
- status
- processed_on
- processed_by (FK to users)
- created_at
- updated_at

payslips
- id (PK)
- branch_id (FK)
- payroll_run_id (FK)
- employee_id (FK)
- basic_salary
- total_earnings
- total_deductions
- net_salary
- remarks
- created_at
- updated_at

payslip_details
- id (PK)
- payslip_id (FK)
- salary_component_id (FK)
- amount
- type (earning/deduction)
- created_at
- updated_at
```

## Accounting Module

```
chart_of_accounts
- id (PK)
- branch_id (FK)
- account_code
- account_name
- account_type
- parent_id (FK self-reference, nullable)
- is_group
- created_at
- updated_at

fiscal_years
- id (PK)
- branch_id (FK)
- name
- start_date
- end_date
- is_active
- created_at
- updated_at

accounting_periods
- id (PK)
- fiscal_year_id (FK)
- name
- start_date
- end_date
- is_closed
- closed_by (FK to users, nullable)
- closed_on
- created_at
- updated_at

vouchers
- id (PK)
- branch_id (FK)
- voucher_number
- voucher_type
- voucher_date
- reference
- description
- status
- approved_by (FK to users, nullable)
- approved_on
- created_by (FK to users)
- created_at
- updated_at

transactions
- id (PK)
- branch_id (FK)
- voucher_id (FK)
- account_id (FK)
- transaction_date
- debit_amount
- credit_amount
- description
- created_at
- updated_at
```

## Inventory Module

```
item_categories
- id (PK)
- branch_id (FK)
- name
- description
- created_at
- updated_at

items
- id (PK)
- branch_id (FK)
- item_category_id (FK)
- name
- code
- description
- unit
- created_at
- updated_at

inventory_locations
- id (PK)
- branch_id (FK)
- name
- description
- created_at
- updated_at

stock_transactions
- id (PK)
- branch_id (FK)
- item_id (FK)
- location_id (FK)
- transaction_type (in/out/transfer)
- quantity
- reference_number
- remarks
- transaction_date
- created_by (FK to users)
- created_at
- updated_at
```
