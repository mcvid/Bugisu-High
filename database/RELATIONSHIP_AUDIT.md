# Database Relationship Audit & Schema Map
**Bugisu High School Management System**

## Core Entity: STUDENTS (The Identity Hub)
Every student has a unique `id` (UUID) and `student_reg_number` (Human-readable).

### Relationship Map

```
STUDENTS (id, student_reg_number)
    ├── GRADES (student_id → students.id)
    ├── FEE_PAYMENTS (student_id → students.id)
    ├── ADMISSION_APPLICATIONS (Converts to → students.id on approval)
    └── PROFILES (id → auth.users.id, for login)
```

---

## 1. Academic System (Grades/Results)

### Current Schema
```sql
grades (
    id UUID PRIMARY KEY,
    student_id UUID → students(id) ON DELETE CASCADE ✅,
    subject_id UUID → subjects(id) ON DELETE CASCADE ✅,
    term TEXT,
    year INTEGER,
    marks INTEGER,
    grade TEXT,
    UNIQUE(student_id, subject_id, term, year) ✅
)
```

**Status:** ✅ CORRECT
- Foreign Keys: Properly linked
- Unique Constraint: Prevents duplicate imports
- Cascade: Deleting student removes their grades

---

## 2. Finance System (Fee Payments)

### Current Schema
```sql
fee_payments (
    id UUID PRIMARY KEY,
    student_id UUID → students(id) ON DELETE CASCADE ✅,
    amount_paid DECIMAL,
    payment_date TIMESTAMP,
    receipt_no SERIAL,
    captured_by UUID → profiles(id) ⚠️
)
```

**Status:** ✅ CORRECT
- Foreign Key to students: Linked
- Cascade: Deleting student removes payment history
- Note: `captured_by` should reference `profiles.id` (admin who recorded it)

---

## 3. Admissions System

### Current Schema
```sql
admission_applications (
    id UUID PRIMARY KEY,
    student_name TEXT,
    parent_name TEXT,
    status TEXT,
    -- NO DIRECT LINK TO STUDENTS ✅ (Correct - they're not students yet)
)
```

**Status:** ✅ CORRECT
- Applications are "pre-students"
- On approval, a NEW student record is created
- The `student_reg_number` is generated at approval time

---

## 4. Report Card System

### Current Implementation
The `ReportCard.jsx` component receives:
```javascript
<ReportCard 
    student={studentObject}  // Contains: id, student_name, student_reg_number
    grades={gradesArray}     // Contains: student_id, subject_id, marks, grade
    term="Term 1"
    year={2026}
/>
```

**Status:** ✅ CORRECT
- Grades are fetched using `student_id`
- Student details are passed as object
- Relationship is maintained through props

---

## 5. Import Systems (The Critical Bridge)

### A. Student Import (CSV/Excel)
**Current:** Creates students with auto-generated UUIDs
**Bridge Field:** `student_reg_number` (e.g., BHS/2026/0442)

### B. Grades Import (Excel)
**Current:** Uses `student_reg_number` to lookup `student_id`
**Process:**
1. Read Excel: `[{Reg No: "BHS/2026/0001", Math: 85}]`
2. Lookup: `SELECT id FROM students WHERE student_reg_number = 'BHS/2026/0001'`
3. Insert: `{student_id: <UUID>, subject_id: <UUID>, marks: 85}`

**Status:** ✅ IMPLEMENTED (in AdminMarksEntry.jsx)

### C. Payment Import (Excel)
**Current:** Uses `student_reg_number` to lookup `student_id`
**Process:** Same as Grades Import

**Status:** ✅ IMPLEMENTED (in FinanceManager.jsx)

---

## 6. Missing Relationships to Add

### A. Notifications → Students
```sql
ALTER TABLE notifications 
ADD COLUMN student_id UUID REFERENCES students(id);
```
**Reason:** Track which student a notification is about

### B. Activity Logs → Profiles
```sql
-- Already has user tracking via sessions
-- No change needed
```

---

## 7. Unique Constraints Checklist

| Table | Constraint | Purpose | Status |
|-------|-----------|---------|--------|
| students | `student_reg_number UNIQUE` | Prevent duplicate IDs | ✅ |
| subjects | `name UNIQUE` | Prevent duplicate subjects | ✅ |
| grades | `(student_id, subject_id, term, year) UNIQUE` | Prevent duplicate marks | ✅ |
| fees_structure | `class_name UNIQUE` | One fee per class | ✅ |
| fee_payments | No constraint (multiple payments allowed) | - | ✅ |

---

## 8. Cascade Behavior Audit

**What happens when a student is deleted?**

| Table | Behavior | Correct? |
|-------|----------|----------|
| grades | CASCADE DELETE | ✅ Yes |
| fee_payments | CASCADE DELETE | ✅ Yes |
| admission_applications | No link | ✅ N/A |

---

## 9. Template Download Strategy

For each import system, provide a "Pre-filled Template":

### Grades Template
```javascript
// Download button generates:
SELECT student_reg_number, student_name, class_grade 
FROM students 
WHERE class_grade = 'Senior 1'
// Export to Excel with empty "Math", "English" columns
```

### Payments Template
```javascript
// Download button generates:
SELECT student_reg_number, student_name, class_grade 
FROM students 
WHERE class_grade = 'Senior 1'
// Export to Excel with empty "Amount", "Date" columns
```

**Status:** ⚠️ TO IMPLEMENT

---

## 10. Validation Rules

Before any import:
1. ✅ Check if `student_reg_number` exists in database
2. ✅ Highlight invalid rows in RED
3. ✅ Show count: "Valid: 45, Invalid: 3"
4. ✅ Block "Confirm" if any invalid rows

**Status:** ✅ IMPLEMENTED (Marks & Payments)

---

## Conclusion

**Overall System Health:** 🟢 GOOD

**Action Items:**
1. Add `student_id` to `notifications` table
2. Implement "Download Pre-filled Template" for Grades
3. Implement "Download Pre-filled Template" for Payments
