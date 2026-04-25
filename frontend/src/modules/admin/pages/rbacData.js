export const RF = {
  academic:{label:"Academic staff",color:"#888780",bg:"#F1EFE8",tc:"#444441",roles:[
    {id:"teacher_core",name:"Teacher — core",short:"TC",level:5,scope:"own classes",desc:"Full teaching duties: marks, attendance, student profiles, parent comms."},
    {id:"teacher_specialist",name:"Teacher — specialist",short:"TS",level:5,scope:"own classes",desc:"PE/VA/PA/Coach/Counselor — same base role, restricted to their domain modules."},
    {id:"teacher_senior",name:"Advance faculty",short:"AF",level:5,scope:"own classes",desc:"Senior/advance faculty. Same base + exam analytics, result approval inputs."},
    {id:"teacher_parttime",name:"Part-time teacher",short:"PT",level:5,scope:"own classes",desc:"Same as teacher_core but no timetable editing, no HR modules."},
  ]},
  nonteaching:{label:"Non-teaching staff",color:"#378ADD",bg:"#E6F1FB",tc:"#0C447C",roles:[
    {id:"admin_ops",name:"Admin — operations",short:"AO",level:4,scope:"campus",desc:"Front office, admissions intake, fee collection, transport, notices."},
    {id:"admin_finance",name:"Admin — finance",short:"AF",level:4,scope:"campus",desc:"Fee management, expense tracking, payroll view, invoice generation."},
    {id:"admin_hr",name:"Admin — HR",short:"HR",level:4,scope:"campus",desc:"Staff records, leave management, payroll processing, recruitment."},
    {id:"admin_it",name:"Admin — IT / system",short:"IT",level:4,scope:"campus",desc:"System config, integrations, user provisioning, audit log access."},
    {id:"librarian",name:"Librarian",short:"LB",level:5,scope:"campus",desc:"Library catalogue, issue/return, fine management, reading reports."},
    {id:"nurse",name:"School nurse / medical",short:"NR",level:5,scope:"campus",desc:"Health records, medical alerts, sick leave logging."},
    {id:"transport_mgr",name:"Transport manager",short:"TR",level:5,scope:"campus",desc:"Route management, vehicle tracking, driver records, student transport assignment."},
    {id:"canteen_mgr",name:"Canteen manager",short:"CN",level:5,scope:"campus",desc:"Menu management, order tracking, nutrition records."},
    {id:"security",name:"Security / gate staff",short:"SG",level:6,scope:"campus",desc:"Visitor log, gate pass, student pickup authorisation."},
    {id:"support_staff",name:"Support staff",short:"SS",level:6,scope:"campus",desc:"Housekeeping, maintenance requests — very limited read-only access."},
  ]},
  leadership:{label:"Leadership",color:"#D85A30",bg:"#FAECE7",tc:"#712B13",roles:[
    {id:"super_admin",name:"Super admin",short:"SA",level:1,scope:"system",desc:"Full system. Manage all schools, roles, modules, system config."},
    {id:"management",name:"Management / director",short:"MG",level:2,scope:"system read",desc:"Cross-campus analytics, strategic reports. No operational edits."},
    {id:"hos",name:"Head of school",short:"HS",level:3,scope:"campus",desc:"Full campus control — staff, academics, HR approvals, operational oversight."},
    {id:"coordinator",name:"Coordinator",short:"CR",level:4,scope:"section",desc:"Grade/dept lead. Timetable, results, section reports, teacher oversight."},
  ]},
  stakeholder:{label:"Stakeholders",color:"#D4537E",bg:"#FBEAF0",tc:"#72243E",roles:[
    {id:"parent",name:"Parent / guardian",short:"PG",level:6,scope:"own child",desc:"Child's attendance, grades, fees, health, notices. Fee payment."},
    {id:"student",name:"Student",short:"ST",level:7,scope:"own",desc:"Own timetable, homework, grades, library, notices, events."},
  ]},
};

export const AGENTS = [
  {id:"notif_agent",name:"Notification agent",color:"#533AB7",bg:"#EEEDFE",tc:"#3C3489",scope:"campus",apis:["POST /notifications","GET /students/ids","GET /events"],trigger:"Scheduled / event-driven",desc:"Sends SMS/email/push for attendance alerts, fee reminders, exam schedules, notices."},
  {id:"sync_agent",name:"Data sync agent",color:"#1D9E75",bg:"#E1F5EE",tc:"#085041",scope:"system",apis:["GET /all-modules/delta","PUT /sync/status"],trigger:"Scheduled nightly",desc:"Cross-campus data synchronisation. Replicates attendance, results, HR data to analytics layer."},
  {id:"report_agent",name:"Report generation agent",color:"#D85A30",bg:"#FAECE7",tc:"#712B13",scope:"campus",apis:["GET /reports/*","POST /reports/generate","PUT /reports/publish"],trigger:"Scheduled / on-demand",desc:"Auto-generates progress reports, attendance summaries, fee outstanding lists, audit reports."},
  {id:"fee_agent",name:"Fee & payment agent",color:"#378ADD",bg:"#E6F1FB",tc:"#0C447C",scope:"campus",apis:["GET /fees/due","POST /payments/reconcile","PUT /invoices/status"],trigger:"Payment gateway webhook",desc:"Reconciles online payments, updates fee ledger, triggers receipts, flags overdue accounts."},
  {id:"attendance_agent",name:"Attendance agent",color:"#639922",bg:"#EAF3DE",tc:"#27500A",scope:"campus",apis:["POST /attendance/auto-mark","GET /biometric/feed"],trigger:"Biometric device push",desc:"Auto-marks attendance from biometric/RFID data. Triggers late/absence alerts."},
  {id:"admit_agent",name:"Admissions agent",color:"#BA7517",bg:"#FAEEDA",tc:"#633806",scope:"campus",apis:["GET /applications","POST /applications/status","POST /users/provision"],trigger:"Admissions workflow event",desc:"Provisions new student accounts, sends welcome emails, generates IDs on enrolment confirmation."},
  {id:"audit_agent",name:"Audit & compliance agent",color:"#888780",bg:"#F1EFE8",tc:"#444441",scope:"system",apis:["GET /audit-log","POST /compliance/flag"],trigger:"Continuous / threshold alert",desc:"Watches for anomalous access patterns, failed logins, role escalations. Flags to Super Admin."},
  {id:"analytics_agent",name:"Analytics agent",color:"#D4537E",bg:"#FBEAF0",tc:"#72243E",scope:"system",apis:["GET /*/aggregate","POST /analytics/compute"],trigger:"Nightly batch",desc:"Computes academic performance indices, staff utilisation, fee recovery rates for management dashboard."},
];

export const MODULES = [
  {g:"Academics",gc:"#533AB7",gb:"#EEEDFE",mods:["Timetable & scheduling","Curriculum management","Marks & gradebook","Progress reports","Exam management","Homework & assignments","Co-curricular activities","Academic calendar"]},
  {g:"Attendance",gc:"#1D9E75",gb:"#E1F5EE",mods:["Student attendance","Staff attendance","Leave management","Biometric integration","Attendance reports"]},
  {g:"Finance",gc:"#D85A30",gb:"#FAECE7",mods:["Fee management","Online payments","Expense tracking","Payroll","Invoicing & receipts","Financial reports","Scholarship management"]},
  {g:"HR & payroll",gc:"#378ADD",gb:"#E6F1FB",mods:["Staff records","Recruitment","Appraisal","Leave calendar","PF / statutory compliance","Employee self-service"]},
  {g:"Student lifecycle",gc:"#639922",gb:"#EAF3DE",mods:["Admissions","Student profiles","ID card management","Alumni management","Health records","Transport assignment"]},
  {g:"Communication",gc:"#BA7517",gb:"#FAEEDA",mods:["Announcements","Parent messaging","SMS / email / push","Event management","Circular management"]},
  {g:"Operations",gc:"#888780",gb:"#F1EFE8",mods:["Library management","Transport & fleet","Canteen management","Asset & inventory","Maintenance requests","Visitor management"]},
  {g:"Analytics & BI",gc:"#D4537E",gb:"#FBEAF0",mods:["Campus dashboard","Management BI","Academic analytics","Finance analytics","Audit log & compliance"]},
  {g:"System",gc:"#0C447C",gb:"#E6F1FB",mods:["User & role management","Module configuration","Integration hub","Notification config","Security & access log"]},
];

export const TEACH_TAGS = [
  {desig:"Teaching Staff",role:"Teacher — core",tag:"core",color:"#444441",bg:"#F1EFE8",restrict:"Full teacher access to all academic modules"},
  {desig:"Advance Faculty",role:"Advance faculty",tag:"senior",color:"#3C3489",bg:"#EEEDFE",restrict:"Core + exam analytics + result approval input"},
  {desig:"PE Specialist / Educator",role:"Teacher — specialist",tag:"pe",color:"#085041",bg:"#E1F5EE",restrict:"Attendance only; no core marks; PE scheduling"},
  {desig:"VA Specialist / Educator",role:"Teacher — specialist",tag:"va",color:"#712B13",bg:"#FAECE7",restrict:"Art portfolio module; no core marks"},
  {desig:"PA / Performing Arts Specialist",role:"Teacher — specialist",tag:"pa",color:"#712B13",bg:"#FAECE7",restrict:"Performance module; no core marks"},
  {desig:"Behavioural Counselor",role:"Teacher — specialist",tag:"counselor",color:"#0C447C",bg:"#E6F1FB",restrict:"Student wellness; confidential notes; no marks"},
  {desig:"Swimming / Sports Coach",role:"Teacher — specialist",tag:"coach",color:"#27500A",bg:"#EAF3DE",restrict:"Attendance only; co-curricular module"},
  {desig:"Part Time - Teaching Staff",role:"Part-time teacher",tag:"part-time",color:"#633806",bg:"#FAEEDA",restrict:"No timetable edit; no HR; own subject marks only"},
  {desig:"Makery & Arts Specialist",role:"Teacher — specialist",tag:"makery",color:"#712B13",bg:"#FAECE7",restrict:"Art / makery portfolio; no core marks"},
];

export const NONTEACH_TAGS = [
  {desig:"Front office / receptionist",role:"Admin — operations",tag:"frontoffice",color:"#0C447C",bg:"#E6F1FB",restrict:"Visitor log, admissions intake, notices"},
  {desig:"Accounts / finance officer",role:"Admin — finance",tag:"accounts",color:"#633806",bg:"#FAEEDA",restrict:"Fee, invoicing, expense — no HR or payroll"},
  {desig:"Payroll officer",role:"Admin — finance",tag:"payroll",color:"#633806",bg:"#FAEEDA",restrict:"Payroll only; no student finance"},
  {desig:"HR executive",role:"Admin — HR",tag:"hr-exec",color:"#3C3489",bg:"#EEEDFE",restrict:"Staff records, leave, appraisal — no student data"},
  {desig:"IT administrator",role:"Admin — IT / system",tag:"it-admin",color:"#712B13",bg:"#FAECE7",restrict:"System config, user provisioning, audit log"},
  {desig:"Librarian",role:"Librarian",tag:"library",color:"#444441",bg:"#F1EFE8",restrict:"Library module full; view student profiles (name only)"},
  {desig:"School nurse / medical officer",role:"School nurse",tag:"medical",color:"#085041",bg:"#E1F5EE",restrict:"Health records full; no academic or finance"},
  {desig:"Transport coordinator",role:"Transport manager",tag:"transport",color:"#27500A",bg:"#EAF3DE",restrict:"Transport module full; route & vehicle records"},
  {desig:"Canteen / food service",role:"Canteen manager",tag:"canteen",color:"#444441",bg:"#F1EFE8",restrict:"Canteen module only"},
  {desig:"Security / gate staff",role:"Security / gate staff",tag:"security",color:"#444441",bg:"#F1EFE8",restrict:"Visitor log + gate pass only"},
  {desig:"Housekeeping / support",role:"Support staff",tag:"support",color:"#444441",bg:"#F1EFE8",restrict:"Maintenance requests only — very limited"},
  {desig:"Driver / fleet staff",role:"Transport manager",tag:"driver",color:"#27500A",bg:"#EAF3DE",restrict:"Own vehicle record + route — read only"},
];

export const USERS = [
  {name:"Santhosh S",fam:"academic",role:"Teacher — specialist",tag:"pe",camp:"CMRNPS",subj:"PE",grades:"Gr 4–12",email:"santhoshs@cmrnps.ac.in"},
  {name:"Simran Sangai",fam:"academic",role:"Teacher — specialist",tag:"counselor",camp:"CMRNPS",subj:"Life Skills",grades:"Gr 1–6",email:"simrans@cmrnps.ac.in"},
  {name:"Binesh Thomas",fam:"academic",role:"Advance faculty",tag:"senior",camp:"EITPL",subj:"Chemistry",grades:"Senior",email:"binesht@ekyaschools.com"},
  {name:"Sujimol Thomas",fam:"academic",role:"Part-time teacher",tag:"part-time",camp:"EBYR",subj:"French",grades:"Gr 5–9",email:"sujimolt@ekyaschools.com"},
  {name:"Abhayan R S",fam:"academic",role:"Teacher — specialist",tag:"coach",camp:"EBTM",subj:"Swimming",grades:"Whole School",email:"abhayanrs@ekyaschools.com"},
  {name:"Karthik E",fam:"academic",role:"Teacher — specialist",tag:"va",camp:"EBTM",subj:"Makery",grades:"Senior",email:"karthike@ekyaschools.com"},
  {name:"Sangeeta Saxena",fam:"academic",role:"Teacher — specialist",tag:"counselor",camp:"EBTM",subj:"Psychology",grades:"Mid–Senior",email:"sangeetas@ekyaschools.com"},
  {name:"Rituparna Maiti",fam:"academic",role:"Teacher — specialist",tag:"pa",camp:"EBTM",subj:"Performing Arts",grades:"Pri–Middle",email:"rituparnam@ekyaschools.com"},
  {name:"Susan George",fam:"academic",role:"Teacher — specialist",tag:"counselor",camp:"ENICE",subj:"Counselling",grades:"Whole",email:"susang@ekyaschools.com"},
  {name:"HoS — CMRNPS",fam:"leadership",role:"Head of school",tag:"—",camp:"CMRNPS",subj:"—",grades:"—",email:"hos@cmrnps.ac.in"},
  {name:"HoS — EITPL",fam:"leadership",role:"Head of school",tag:"—",camp:"EITPL",subj:"—",grades:"—",email:"hos.eitpl@ekyaschools.com"},
  {name:"Grade 6 Coord — EITPL",fam:"leadership",role:"Coordinator",tag:"—",camp:"EITPL",subj:"Grade 6",grades:"Gr 6",email:"coord6@ekyaschools.com"},
  {name:"Management — Group",fam:"leadership",role:"Management",tag:"—",camp:"ALL",subj:"—",grades:"—",email:"mgmt@ekyaschools.com"},
  {name:"Super Admin",fam:"leadership",role:"Super admin",tag:"—",camp:"ALL",subj:"—",grades:"—",email:"admin@ekya.in"},
  {name:"Campus Admin — CMRNPS",fam:"nonteaching",role:"Admin — operations",tag:"frontoffice",camp:"CMRNPS",subj:"Operations",grades:"—",email:"admin@cmrnps.ac.in"},
  {name:"Finance Officer — EITPL",fam:"nonteaching",role:"Admin — finance",tag:"accounts",camp:"EITPL",subj:"Finance",grades:"—",email:"finance@ekyaschools.com"},
  {name:"HR Executive — EBTM",fam:"nonteaching",role:"Admin — HR",tag:"hr-exec",camp:"EBTM",subj:"HR",grades:"—",email:"hr.ebtm@ekyaschools.com"},
  {name:"IT Admin — Ekya Group",fam:"nonteaching",role:"Admin — IT / system",tag:"it-admin",camp:"ALL",subj:"IT",grades:"—",email:"it@ekya.in"},
  {name:"Librarian — CMRNPS",fam:"nonteaching",role:"Librarian",tag:"library",camp:"CMRNPS",subj:"Library",grades:"—",email:"library@cmrnps.ac.in"},
  {name:"School Nurse — EITPL",fam:"nonteaching",role:"School nurse",tag:"medical",camp:"EITPL",subj:"Medical",grades:"—",email:"nurse@ekyaschools.com"},
  {name:"Transport Coord — EBTM",fam:"nonteaching",role:"Transport manager",tag:"transport",camp:"EBTM",subj:"Transport",grades:"—",email:"transport.ebtm@ekyaschools.com"},
  {name:"Security — CMRNPS",fam:"nonteaching",role:"Security / gate staff",tag:"security",camp:"CMRNPS",subj:"Security",grades:"—",email:"security@cmrnps.ac.in"},
  {name:"Sample Parent",fam:"stakeholder",role:"Parent / guardian",tag:"—",camp:"CMRNPS",subj:"—",grades:"—",email:"parent@gmail.com"},
  {name:"Sample Student",fam:"stakeholder",role:"Student",tag:"—",camp:"CMRNPS",subj:"—",grades:"Gr 7",email:"student@cmrnps.ac.in"},
  {name:"Notification Agent",fam:"agent",role:"Agent",tag:"notif",camp:"ALL",subj:"System",grades:"—",email:"agent-notif@sys.ekya.in"},
];

export const MX_DATA = {
  "courses":         {super_admin:"✓",management:"✓view",hos:"✓",coordinator:"◆section",teacher_core:"◆own",nonteach:"—",librarian:"—",medical:"—",parent:"◆child",student:"◆own", label: "Academics"},
  "attendance":      {super_admin:"✓",management:"✓view",hos:"✓",coordinator:"◆section",teacher_core:"◆own",nonteach:"◆mark",librarian:"—",medical:"◆view",parent:"◆child",student:"◆own", label: "Attendance"},
  "finance":         {super_admin:"✓",management:"✓view",hos:"✓view",coordinator:"—",teacher_core:"—",nonteach:"◆role",librarian:"—",medical:"—",parent:"◆own",student:"◆own", label: "Finance"},
  "hr":              {super_admin:"✓",management:"✓view",hos:"✓campus",coordinator:"◆view",teacher_core:"◆own leave",nonteach:"◆role",librarian:"◆own",medical:"◆own",parent:"—",student:"—", label: "HR & payroll"},
  "admissions":      {super_admin:"✓",management:"✓view",hos:"✓",coordinator:"—",teacher_core:"—",nonteach:"◆ops",librarian:"—",medical:"—",parent:"◆apply",student:"—", label: "Admissions"},
  "announcements":   {super_admin:"✓",management:"✓",hos:"✓",coordinator:"◆section",teacher_core:"◆own",nonteach:"◆ops",librarian:"◆notices",medical:"◆alerts",parent:"◆receive",student:"◆receive", label: "Communication"},
  "library":         {super_admin:"✓",management:"—",hos:"✓view",coordinator:"—",teacher_core:"◆view",nonteach:"—",librarian:"✓",medical:"—",parent:"—",student:"◆borrow", label: "Library"},
  "transport":       {super_admin:"✓",management:"✓view",hos:"✓view",coordinator:"—",teacher_core:"—",nonteach:"◆transport",librarian:"—",medical:"—",parent:"◆view",student:"◆view", label: "Transport"},
  "health":          {super_admin:"✓",management:"—",hos:"✓view",coordinator:"—",teacher_core:"◆alerts",nonteach:"—",librarian:"—",medical:"✓",parent:"◆child",student:"◆own", label: "Health records"},
  "insights":        {super_admin:"✓",management:"✓",hos:"◆campus",coordinator:"◆section",teacher_core:"—",nonteach:"—",librarian:"—",medical:"—",parent:"—",student:"—", label: "Analytics & BI"},
  "settings":        {super_admin:"✓",management:"—",hos:"◆campus",coordinator:"—",teacher_core:"—",nonteach:"◆IT only",librarian:"—",medical:"—",parent:"—",student:"—", label: "System config"},
  "audit":           {super_admin:"✓",management:"✓view",hos:"◆campus",coordinator:"—",teacher_core:"—",nonteach:"◆IT only",librarian:"—",medical:"—",parent:"—",student:"—", label: "Audit log"},
  "canteen":         {super_admin:"✓",management:"✓view",hos:"✓view",coordinator:"—",teacher_core:"—",nonteach:"◆canteen",librarian:"—",medical:"◆menu",parent:"◆order",student:"◆order", label: "Canteen"},
  "assets":          {super_admin:"✓",management:"✓view",hos:"✓view",coordinator:"—",teacher_core:"◆request",nonteach:"◆ops",librarian:"◆request",medical:"◆request",parent:"—",student:"—", label: "Asset & maint."},
};

export const PRINCIPLES = [
  {title:"Principle 1 — role families, not role explosion",color:"#533AB7",bg:"#EEEDFE",tc:"#3C3489",body:"Group all roles into 4 families: Academic, Non-teaching, Leadership, Stakeholder. Adding a new job title never creates a new role — it maps to an existing role + a new sub-tag. The system will always have exactly 16 roles regardless of how many designations exist."},
  {title:"Principle 2 — scope binding is mandatory",color:"#1D9E75",bg:"#E1F5EE",tc:"#085041",body:"Every permission record carries a scope_filter: all | campus | section | own | none. A HoS of CMRNPS physically cannot read EITPL records — the query is scoped at the data layer, not just the UI. This is enforced in the ORM, not in frontend guards."},
  {title:"Principle 3 — sub-tags narrow, never expand",color:"#D85A30",bg:"#FAECE7",tc:"#712B13",body:"Sub-tags (teacher specialisation, non-teaching role type) can only restrict access within a role — they cannot grant access beyond the role's ceiling. A PE teacher sub-tag hides the marks module. It cannot grant access to HR."},
  {title:"Principle 4 — agents are first-class principals",color:"#378ADD",bg:"#E6F1FB",tc:"#0C447C",body:"Automated agents hold roles in the same users table. They have API-key auth, endpoint whitelists, and 24h token expiry. All agent actions appear in the audit log with agent_id. Agents cannot self-approve — anything requiring HoS+ goes into a human approval queue."},
  {title:"Principle 5 — override table for exceptions",color:"#639922",bg:"#EAF3DE",tc:"#27500A",body:"Never modify a role to accommodate one person's exception. Use the role_override table with a granted_by, reason, and expires_at. Overrides auto-expire and appear in compliance dashboards. This keeps the base role model clean."},
  {title:"Principle 6 — module registry drives scalability",color:"#BA7517",bg:"#FAEEDA",tc:"#633806",body:"Adding a new ERP module (module 46, 47…) is a database operation: insert into modules, then insert permission rows per role. No code change required. Roles are automatically restricted from new modules until permissions are explicitly granted — default deny."},
  {title:"Principle 7 — audit everything",color:"#888780",bg:"#F1EFE8",tc:"#444441",body:"Every create/edit/delete/approve/export action is written to audit_log with user_id, module_id, record_id, campus_id, ip_address, and timestamp. The audit agent monitors for anomalies. Logs are immutable — no user role can delete them, including Super Admin."},
  {title:"Principle 8 — parent & student are consumers, not operators",color:"#D4537E",bg:"#FBEAF0",tc:"#72243E",body:"Parents and students have their own onboarding flow separate from staff provisioning. Parent accounts link to student records via a guardian_of junction table. Students are provisioned by the admissions agent on enrolment confirmation, not manually."},
];

export const SCOPES = [
  {s:"system",l:"Super Admin / Management",c:"#533AB7"},
  {s:"campus",l:"HoS / Admin / Non-teaching leads",c:"#D85A30"},
  {s:"section",l:"Coordinator",c:"#639922"},
  {s:"own classes",l:"Teachers",c:"#888780"},
  {s:"own child",l:"Parents",c:"#D4537E"},
  {s:"own",l:"Students",c:"#BA7517"},
];
