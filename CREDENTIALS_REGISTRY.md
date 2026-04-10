# Ekya Schools Portal: Enterprise Credentials Registry

This document contains all the provisioned login identities for the SchoolOS platform. All users share the same default password for initial access.

**Default Password for All Accounts:** `password123`

---

### **1. Executive & Super Admin**
Access: Full System Authority (Level 1)
- **Super Admin**: `superadmin@ekyaschools.com`

---

### **2. Directors & Top Management**
Access: Strategic Oversight (Level 2)
- **Director**: `director@ekyaschools.com`
- **Academics Director**: `academicsdirector@ekyaschools.com`
- **Operations Director**: `operationsdirector@ekyaschools.com`
- **HR Director**: `hrdirector@ekyaschools.com`
- **Finance Director**: `financedirector@ekyaschools.com`
- **Innovation Director**: `innovationdirector@ekyaschools.com`

---

### **3. Department Managers (Admins)**
Access: Departmental Administration (Level 3)
- **HR Manager**: `hr.manager@ekyaschools.com`
- **PD Manager**: `pd.manager@ekyaschools.com`
- **Operations Manager**: `operations.manager@ekyaschools.com`
- **Technology Manager**: `tech.manager@ekyaschools.com`
- **ELC Manager**: `ekyalearning.manager@ekyaschools.com`
- **Student Dev Manager**: `studentdev.manager@ekyaschools.com`
- **Marketing Manager**: `marketing.manager@ekyaschools.com`
- **Admissions Manager**: `admissions.manager@ekyaschools.com`
- **Brand Growth Manager**: `brandgrowth.manager@ekyaschools.com`
- **QA Manager**: `qa.manager@ekyaschools.com`
- **Finance Manager**: `finance.manager@ekyaschools.com`
- **Strategy Manager**: `strategy.manager@ekyaschools.com`
- **Wellbeing Manager**: `wellbeing.manager@ekyaschools.com`

---

### **4. School Heads (Principals)**
Access: Institutional Administration (Level 3)
- **Principal BTM**: `principal.btmlayout@ekyaschools.com`
- **Principal JP Nagar**: `principal.jpnagar@ekyaschools.com`
- **Principal ITPL**: `principal.itpl@ekyaschools.com`
- **Principal Byrathi**: `principal.byrathi@ekyaschools.com`
- **Principal Koppa**: `principal.koppagubbi@ekyaschools.com`
- **Principal Nice Road**: `principal.niceroad@ekyaschools.com`
- **Principal Kasturi Nagar**: `principal.kasturinagar@ekyaschools.com`
- **Principal World School**: `principal.worldschool@ekyaschools.com`

---

### **5. Teaching & Staff**
Access: Operational Execution (Level 4)
- **Math Teacher BTM**: `teacher.math.btmlayout@ekyaschools.com`
- **Science Teacher JP Nagar**: `teacher.science.jpnagar@ekyaschools.com`
- **English Teacher ITPL**: `teacher.english.itpl@ekyaschools.com`
- **Physics Teacher Byrathi**: `teacher.physics.byrathi@ekyaschools.com`
- **Admin Staff BTM**: `staff.admin.btmlayout@ekyaschools.com`
- **HR Staff**: `staff.hr@ekyaschools.com`
- **Finance Staff**: `staff.finance@ekyaschools.com`
- **PD Trainer**: `trainer.pd@ekyaschools.com`
- **Student Dev Coordinator**: `coordinator.studentdev@ekyaschools.com`
- **History Teacher Kasturi Nagar**: `teacher.history.kasturinagar@ekyaschools.com`

---

### **6. Guest & External Users**
Access: Restricted View (Level 5)
- **Guest 1**: `guest1@gmail.com`
- **Guest Viewer**: `guest.viewer@external.com`
- **Parent Access**: `parent.access@gmail.com`
- **Visitor Public**: `visitor.public@outlook.com`
- **External Consultant**: `external.consultant@gmail.com`

---

### **System Integration Notes**
The login portal at `/login` uses these credentials to determine:
1. **Sidebar Navigation**: Only tools enabled in the Super Admin **Access Matrix** will be visible.
2. **Redirect Flow**:
   - Managers → Department Dashboard
   - Principals → School Dashboard
   - Executives → Organization Hub
