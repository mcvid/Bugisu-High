# Excel Import Guide for Bugisu High School
**Complete Reference for Admins, Teachers, and Bursar**

---

## 📋 Table of Contents
1. [Students Import](#1-students-import)
2. [Grades/Marks Import](#2-gradesmarks-import)
3. [Fee Payments Import](#3-fee-payments-import)
4. [General Rules](#4-general-rules-all-imports)

---

## 1. Students Import

### When to Use
- Beginning of academic year
- New admissions batch
- Transferring from another system

### Excel Structure
| Column Name | Required | Format | Example | Notes |
|-------------|----------|--------|---------|-------|
| student_name | ✅ Yes | Text | John Doe Mukasa | Full legal name |
| student_reg_number | ✅ Yes | Text | BHS/2026/0001 | Must be UNIQUE |
| class_grade | ✅ Yes | Text | Senior 1 | Must match: Senior 1-6 |
| house | ❌ No | Text | Red House | Optional |
| parent_name | ❌ No | Text | Mary Mukasa | Optional but recommended |
| parent_email | ❌ No | Email | mary@example.com | Optional |
| parent_phone | ❌ No | Phone | +256700123456 | Optional but recommended |
| valid_until | ❌ No | Date | 2030-12-31 | Leave empty = auto-calculated |

### ✅ Valid Example
```
student_name          | student_reg_number | class_grade | parent_phone
John Doe Mukasa      | BHS/2026/0001      | Senior 1    | +256700123456
Jane Smith Namuli    | BHS/2026/0002      | Senior 2    | +256700234567
```

### ❌ Common Mistakes
- ❌ Duplicate `student_reg_number` → System will reject
- ❌ `class_grade = "S1"` → Must be "Senior 1"
- ❌ Missing `student_name` → Row will be skipped

### 📥 How to Import
1. Go to **Admin → Students**
2. Click **"Import Students"**
3. Select your Excel file
4. Review preview (invalid rows shown in RED)
5. Click **"Confirm Import"**

---

## 2. Grades/Marks Import

### When to Use
- End of term (bulk mark entry)
- Importing historical results

### Excel Structure (Pre-filled Template)
| Column Name | Required | Format | Example | Notes |
|-------------|----------|--------|---------|-------|
| Reg Number | ✅ Yes | Text | BHS/2026/0001 | **DO NOT EDIT** (Pre-filled) |
| Student Name | ✅ Yes | Text | John Doe Mukasa | **DO NOT EDIT** (Pre-filled) |
| Mark (0-100) | ✅ Yes | Number | 85 | Enter the score here |

### ✅ Valid Example
```
Reg Number     | Student Name      | Mark (0-100)
BHS/2026/0001 | John Doe Mukasa   | 85
BHS/2026/0002 | Jane Smith Namuli | 92
BHS/2026/0003 | Peter Okello      | 78
```

### ❌ Common Mistakes
- ❌ Changing the `Reg Number` → Student won't be found
- ❌ Deleting rows → Those students won't get marks
- ❌ Mark = "A" → Must be a number (0-100)
- ❌ Mark = 105 → Out of range (0-100 only)

### 📥 How to Import
1. Go to **Admin → Academics → Enter Marks**
2. Select **Class** (e.g., Senior 1) and **Subject** (e.g., Mathematics)
3. Click **"Template"** to download pre-filled Excel
4. Fill in the **"Mark (0-100)"** column ONLY
5. Save the file
6. Click **"Import"** and select your filled file
7. System will show: "Imported 45 marks. Skipped 3 invalid rows."

### 💡 Pro Tips
- **Don't delete the header row** (Reg Number, Student Name, Mark)
- **Don't add extra columns** (system will ignore them)
- **Don't change student names** (they're just for reference)
- **Leave blank if student was absent** (system will skip)

---

## 3. Fee Payments Import

### When to Use
- Beginning of term (bulk payment recording)
- Bank deposit reconciliation
- Mobile money batch uploads

### Excel Structure (Pre-filled Template)
| Column Name | Required | Format | Example | Notes |
|-------------|----------|--------|---------|-------|
| Reg No | ✅ Yes | Text | BHS/2026/0001 | **DO NOT EDIT** (Pre-filled) |
| Student Name | ✅ Yes | Text | John Doe Mukasa | **DO NOT EDIT** (Pre-filled) |
| Class | ✅ Yes | Text | Senior 1 | **DO NOT EDIT** (Pre-filled) |
| Amount | ✅ Yes | Number | 500000 | Enter payment amount (UGX) |
| Date | ❌ No | Date | 2026-02-01 | Leave empty = today's date |
| Ref No | ❌ No | Text | REC/001 | Bank reference or receipt |

### ✅ Valid Example
```
Reg No        | Student Name      | Class    | Amount  | Date       | Ref No
BHS/2026/0001 | John Doe Mukasa   | Senior 1 | 500000  | 2026-02-01 | BANK/001
BHS/2026/0002 | Jane Smith Namuli | Senior 2 | 300000  | 2026-02-01 | BANK/002
BHS/2026/0003 | Peter Okello      | Senior 1 | 650000  | 2026-02-01 | CASH
```

### ❌ Common Mistakes
- ❌ Amount = "500,000" → Remove commas (use 500000)
- ❌ Amount = "UGX 500000" → Numbers only
- ❌ Date = "1st Feb" → Use format: YYYY-MM-DD (2026-02-01)
- ❌ Changing `Reg No` → Payment won't link to student

### 📥 How to Import
1. Go to **Admin → Finance & Fees**
2. Click **"Template"** (top right) to download pre-filled Excel
3. Fill in the **"Amount"** column for students who paid
4. Optionally fill **"Date"** and **"Ref No"**
5. Delete rows for students who haven't paid (or leave Amount blank)
6. Save the file
7. Click **"Import"** and select your filled file
8. System will show: "Successfully imported 120 payments. Skipped 5 invalid rows."

### 💡 Pro Tips
- **Sort by Class** before filling (easier to process)
- **Use Excel filters** to find specific students
- **Keep a backup** of the original template
- **Don't import the same file twice** (creates duplicate payments)

---

## 4. General Rules (All Imports)

### ✅ DO's
- ✅ **Download the template** from the system (don't create from scratch)
- ✅ **Keep the header row** exactly as provided
- ✅ **Save as .xlsx or .xls** (Excel format)
- ✅ **Review the preview** before confirming
- ✅ **Keep backups** of your files

### ❌ DON'Ts
- ❌ **Don't change column names** (system won't recognize them)
- ❌ **Don't add extra columns** in the middle (put them at the end if needed)
- ❌ **Don't use special characters** in Reg Numbers (stick to letters, numbers, /)
- ❌ **Don't merge cells** (system can't read merged cells)
- ❌ **Don't use formulas** (paste values only)

### 🔍 Validation Process
Every import follows this flow:
1. **Upload** → System reads the Excel file
2. **Validate** → System checks each row
3. **Preview** → You see valid (green) and invalid (red) rows
4. **Confirm** → System imports only valid rows
5. **Report** → "Imported X records. Skipped Y invalid rows."

### 🚨 Error Messages & Fixes

| Error Message | Cause | Fix |
|---------------|-------|-----|
| "Reg No not found" | Student doesn't exist in database | Check spelling or import student first |
| "Duplicate Reg No" | Same student appears twice | Remove duplicate row |
| "Invalid mark: 105" | Mark out of range | Use 0-100 only |
| "Invalid amount" | Non-numeric value | Remove commas, text, currency symbols |
| "File is empty" | No data rows | Add at least one data row |

---

## 📊 Quick Reference Table

| Import Type | Template Source | Key Column | Can Skip Rows? | Duplicate Safe? |
|-------------|----------------|------------|----------------|-----------------|
| Students | Admin → Students → Import | student_reg_number | ✅ Yes | ❌ No (unique constraint) |
| Grades | Admin → Academics → Template | Reg Number | ✅ Yes (blank marks) | ✅ Yes (upsert) |
| Payments | Admin → Finance → Template | Reg No | ✅ Yes (blank amounts) | ❌ No (creates duplicates) |

---

## 🎯 Best Practices

### For Teachers (Grades)
1. Download template at start of term
2. Fill marks progressively (don't wait till last day)
3. Import weekly to track progress
4. Keep a master Excel file as backup

### For Bursar (Payments)
1. Download fresh template daily
2. Delete rows for students who haven't paid (cleaner file)
3. Use "Ref No" to track bank deposits
4. Import at end of each banking day

### For Admins (Students)
1. Import students BEFORE term starts
2. Verify all Reg Numbers are unique
3. Double-check class assignments
4. Test with 5-10 students first before bulk import

---

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review the error message in the preview
3. Verify your Excel matches the template structure
4. Contact IT support with screenshot of the error

---

**Last Updated:** January 2026  
**System Version:** Bugisu High School Management System v1.0
