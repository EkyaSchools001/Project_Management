import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const data = [
  { uid: "s1", dutyId: "staff-list", teacherName: "Rima Kumari Ojha", block: "WS", subject: "Hindi", grade: "I to X" },
  { uid: "s2", dutyId: "staff-list", teacherName: "Sandhya Singh", block: "MS & SS", subject: "Phy, Chem, Geo", grade: "VIII, IX, X" },
  { uid: "s3", dutyId: "staff-list", teacherName: "Mangala R", block: "PY, MS, SS", subject: "Kannada", grade: "III,IV,V,VI,VIII,X" },
  { uid: "s4", dutyId: "staff-list", teacherName: "Shruthi Srinivas", block: "WS", subject: "CSC", grade: "I to X" },
  { uid: "s5", dutyId: "staff-list", teacherName: "Shashikumara R", block: "WS", subject: "PE, Outdoor Play, Sandpit", grade: "EY to X" },
  { uid: "s6", dutyId: "staff-list", teacherName: "Geetha Sakthi Kumar", block: "EY, PY", subject: "EL, Reading, Science, Math", grade: "EY, III, IV" },
  { uid: "s7", dutyId: "staff-list", teacherName: "Vaishnavi S", block: "MS & SS", subject: "Math", grade: "V, VIII, IX, X" },
  { uid: "s8", dutyId: "staff-list", teacherName: "Sugandhi S", block: "PY & MS", subject: "SSC, H/C, Geo", grade: "I to VI" },
  { uid: "s9", dutyId: "staff-list", teacherName: "Rupsikha Dowerah", block: "PY & SS", subject: "H/C, Eng, Geo", grade: "IV,V,VIII,IX,X" },
  { uid: "s10", dutyId: "staff-list", teacherName: "Shakshi Sandil", block: "MS & SS", subject: "English, PA", grade: "VI,VIII,IX,X" },
  { uid: "s11", dutyId: "staff-list", teacherName: "Ankita Prakash", block: "PY", subject: "Math, Science, PA", grade: "I, II, III, IV" },
  { uid: "s12", dutyId: "staff-list", teacherName: "S Jayalakshmi", block: "PY, MS, SS", subject: "Bio, Science", grade: "IV,V,VI,VIII,IX,X" },
  { uid: "s13", dutyId: "staff-list", teacherName: "Thejaswini", block: "PY & MS", subject: "Kannada", grade: "I–VIII" },
  { uid: "s14", dutyId: "staff-list", teacherName: "Taniya Tiwary", block: "PY", subject: "Eng, PA", grade: "I, II, III" },
  { uid: "s15", dutyId: "staff-list", teacherName: "Muthamizh Selvi", block: "EY", subject: "All except EL & Reading", grade: "EY" },
  { uid: "s16", dutyId: "staff-list", teacherName: "Prashanth Mallik", block: "WS", subject: "Visual Arts", grade: "EY to X" },
  { uid: "s17", dutyId: "staff-list", teacherName: "Susan George", block: "WS", subject: "Behavioural Counsellor", grade: "EY to X" },
  { uid: "s18", dutyId: "staff-list", teacherName: "Kavya H", block: "P—Nurse", subject: "-", grade: "EY to X" },
  { uid: "s19", dutyId: "staff-list", teacherName: "Aarti Rathore", block: "PY", subject: "Math, Science", grade: "EY, III, IV" },

  { uid: "ct1", dutyId: "class-teacher-lists", teacherName: "Ms Sandhya Singh", grade: "Grade X – A", block: "SS" },
  { uid: "ct2", dutyId: "class-teacher-lists", teacherName: "Ms Shakshi Sandil", grade: "Grade IX – A", block: "SS" },
  { uid: "ct3", dutyId: "class-teacher-lists", teacherName: "Ms Vaishnavi S", grade: "Grade VIII – A", block: "MS" },
  { uid: "ct4", dutyId: "class-teacher-lists", teacherName: "Ms Shruthi Srinivas", grade: "Grade VI – A", block: "MS" },
  { uid: "ct5", dutyId: "class-teacher-lists", teacherName: "Ms Rupsikha Dowerah", grade: "Grade IV & V – A", block: "PY" },
  { uid: "ct6", dutyId: "class-teacher-lists", teacherName: "Ms Tejaswini Aradhya", grade: "Grade III – A", block: "PY" },
  { uid: "ct7", dutyId: "class-teacher-lists", teacherName: "Ms Mangala R", grade: "Grade II – A", block: "PY" },
  { uid: "ct8", dutyId: "class-teacher-lists", teacherName: "Ms Ankita Prakash", grade: "Grade I – A", block: "PY" },
  { uid: "ct9", dutyId: "class-teacher-lists", teacherName: "Non-Class Teachers", subject: "Shashikumara R, Prashanth Mallik, Susan George, Rima Kumari Ojha, Shruthi Srinivas, Geetha SK, Sugandhi S, Jayalakshmi S, Taniya Tiwary, Muthamizh Selvi, Kavya HP, Aarti Rathore" },

  { uid: "ad1", dutyId: "assembly-duty", teacherName: "Ms Sandhya Singh & Ms Shakshi Sandil", month: "June", startDate: "5 Jun 2025 (Mon)", grade: "IX, X" },
  { uid: "ad2", dutyId: "assembly-duty", teacherName: "Ms Vaishnavi S", month: "July", startDate: "7 Jul 2025 (Mon)", grade: "VIII" },
  { uid: "ad3", dutyId: "assembly-duty", teacherName: "Ms Tejaswini", month: "September", startDate: "8 Sep 2025 (Mon)", grade: "III" },
  { uid: "ad4", dutyId: "assembly-duty", teacherName: "Ms Rupsikha & Ms Mangala R", month: "November", startDate: "24 Nov 2025 (Mon)", grade: "IV, V" },
  { uid: "ad5", dutyId: "assembly-duty", teacherName: "Ms Mangala R", month: "February", startDate: "16 Feb 2026 (Mon)", grade: "II" },
  { uid: "ad6", dutyId: "assembly-duty", teacherName: "Ms Ankita Prakash", month: "March", startDate: "11 Mar 2026 (Wed)", grade: "I" },

  { uid: "fi1", dutyId: "floor-in-charge", teacherName: "Ms Asmita Shetiya", floor: "Ground Floor", block: "EY to PY" },
  { uid: "fi2", dutyId: "floor-in-charge", teacherName: "Mr Shashikumara R", floor: "First Floor", block: "MS & SS" },

  { uid: "ec1", dutyId: "events-competitions", teacherName: "Mr Shashikumar, Ms Sandhya, Ms Shakshi", eventName: "Yoga Day", grade: "9, 10", startDate: "16 Jun 2025" },
  { uid: "ec2", dutyId: "events-competitions", teacherName: "Ms Ankita Prakash", eventName: "Olympiad – IMO", grade: "WS", startDate: "12 Nov 2025" },
  { uid: "ec3", dutyId: "events-competitions", teacherName: "Ms Shruthi Srinivas", eventName: "Olympiad – IEO", grade: "WS", startDate: "26 Nov 2025" },
  { uid: "ec4", dutyId: "events-competitions", teacherName: "Ms Sandhya Singh", eventName: "Olympiad – NSO", grade: "WS", startDate: "11 Dec 2025" },
  { uid: "ec5", dutyId: "events-competitions", teacherName: "Ms Rupsikha & Ms Mangala", eventName: "Kannada Rajyotsava Assembly", grade: "IV, V", startDate: "24 Nov 2025" },
  { uid: "ec6", dutyId: "events-competitions", teacherName: "Ms Shruthi", eventName: "Sankranti Assembly", grade: "VI", startDate: "28 Jan 2026" },

  { uid: "dd1", dutyId: "dispersal-duty", teacherName: "Ms Mangala / Ms Sugandhi", day: "Monday" },
  { uid: "dd2", dutyId: "dispersal-duty", teacherName: "Ms Shruthi / Ms Tejaswini", day: "Tuesday" },
  { uid: "dd3", dutyId: "dispersal-duty", teacherName: "Ms Sandhya / Ms Jayalakshmi", day: "Wednesday" },
  { uid: "dd4", "dutyId": "dispersal-duty", teacherName: "Ms Rima / Ms Vaishnavi", day: "Thursday" },
  { uid: "dd5", dutyId: "dispersal-duty", teacherName: "Ms Rupsikha / Ms Ankita", day: "Friday" },
  { uid: "dd6", dutyId: "dispersal-duty", teacherName: "Ms Geetha (Mon), Ms Selvi (Tue)", day: "EY (alternate days)" },

  { uid: "gd1", dutyId: "gate-duty", teacherName: "Ms Vaishnavi / Ms Taniya", day: "Monday" },
  { uid: "gd2", dutyId: "gate-duty", teacherName: "Ms Shakshi / Ms Ankita", day: "Tuesday" },
  { uid: "gd3", dutyId: "gate-duty", teacherName: "Ms Shruthi / Ms Sandhya", day: "Wednesday" },
  { uid: "gd4", "dutyId": "gate-duty", teacherName: "Ms Mangala / Ms Rupsikha", day: "Thursday" },
  { uid: "gd5", "dutyId": "gate-duty", teacherName: "Ms Sugandhi / Ms Rima", day: "Friday" },
  { uid: "gd6", "dutyId": "gate-duty", teacherName: "Ms Jayalakshmi", day: "Saturday (Gr 9 & 10)" },

  { uid: "tt1", dutyId: "teacher-talk", teacherName: "Ms Rupsikha", theme: "Earth & Sustainability", startDate: "10 Jun" },
  { uid: "tt2", dutyId: "teacher-talk", teacherName: "Ms Sugandhi S", theme: "Earth & Sustainability", startDate: "17 Jun" },
  { uid: "tt3", dutyId: "teacher-talk", teacherName: "Ms Sandhya", theme: "Earth & Sustainability", startDate: "24 Jun" },
  { uid: "tt4", dutyId: "teacher-talk", teacherName: "Ms Mangala", theme: "Health & Wellness", startDate: "1 Jul" },
  { uid: "tt5", dutyId: "teacher-talk", teacherName: "Ms Shakshi", theme: "Health & Wellness", startDate: "8 Jul" },
  { uid: "tt6", dutyId: "teacher-talk", teacherName: "Ms Vaishnavi", theme: "Health & Wellness", startDate: "15 Jul" },
  { uid: "tt7", dutyId: "teacher-talk", teacherName: "Ms Geetha", theme: "Health & Wellness", startDate: "22 Jul" },
  { uid: "tt8", dutyId: "teacher-talk", teacherName: "Ms Rima", theme: "Health & Wellness", startDate: "29 Jul" },
  { uid: "tt9", dutyId: "teacher-talk", teacherName: "Ms Tejaswini", theme: "Unity in Diversity", startDate: "5 Aug" },
  { uid: "tt10", dutyId: "teacher-talk", teacherName: "Ms Jayalakshmi", theme: "Unity in Diversity", startDate: "12 Aug" },
  { uid: "tt11", dutyId: "teacher-talk", teacherName: "Ms Ankita", theme: "Unity in Diversity", startDate: "19 Aug" },
  { uid: "tt12", dutyId: "teacher-talk", teacherName: "Ms Taniya", theme: "Unity in Diversity", startDate: "26 Aug" },
  { uid: "tt13", dutyId: "teacher-talk", teacherName: "Ms Shruthi", theme: "Art & Expression / Career", startDate: "2 Sep" },
  { uid: "tt14", dutyId: "teacher-talk", teacherName: "Ms Shakshi", theme: "Bravery & Resilience", startDate: "6 Jan" },
  { uid: "tt15", dutyId: "teacher-talk", teacherName: "Ms Vaishnavi", theme: "Bravery & Resilience", startDate: "13 Jan" },
  { uid: "tt16", dutyId: "teacher-talk", teacherName: "Ms Geetha", theme: "Bravery & Resilience", startDate: "20 Jan" },
  { uid: "tt17", dutyId: "teacher-talk", teacherName: "Ms Rima", theme: "Bravery & Resilience", startDate: "27 Jan" },
  { uid: "tt18", dutyId: "teacher-talk", teacherName: "Ms Tejaswini", theme: "The Joy of Learning", startDate: "3 Feb" },
  { uid: "tt19", dutyId: "teacher-talk", teacherName: "Ms Jayalakshmi", theme: "The Joy of Learning", startDate: "10 Feb" },
  { uid: "tt20", dutyId: "teacher-talk", teacherName: "Ms Ankita", theme: "The Joy of Learning", startDate: "17 Feb" },
  { uid: "tt21", dutyId: "teacher-talk", teacherName: "Ms Taniya", theme: "The Joy of Learning", startDate: "24 Feb" },

  { uid: "ld1", dutyId: "lunch-duty", teacherName: "Class Teachers", subject: "Term 1: Students eat in respective classes — Class Teachers are on lunch duty in their own classroom." },

  { uid: "ra1", dutyId: "room-allocation", teacherName: "Chemistry Lab", floor: "L3111", block: "Level 0" },

  { uid: "hm1", dutyId: "house-mistress", teacherName: "Ms Shakshi Sandil", houseName: "Agni", houseColor: "Yellow" },
  { uid: "hm2", dutyId: "house-mistress", teacherName: "Ms Taniya Tiwary", houseName: "Bhoomi", houseColor: "Orange" },
  { uid: "hm3", dutyId: "house-mistress", teacherName: "Ms Rupsikha Dowerah", houseName: "Jal", houseColor: "Green" },
  { uid: "hm4", dutyId: "house-mistress", teacherName: "Ms Vaishnavi S", houseName: "Vayu", houseColor: "Blue" },

  { uid: "tb1", dutyId: "teacher-blog", teacherName: "Ms Taniya Tiwary", month: "May", subject: "✅" },
  { uid: "tb2", dutyId: "teacher-blog", teacherName: "Ms Mangala R", month: "June", subject: "✅" },
  { uid: "tb3", dutyId: "teacher-blog", teacherName: "Ms Sugandhi S", month: "July", subject: "✅" },
  { uid: "tb4", dutyId: "teacher-blog", teacherName: "Ms Shakshi Sandil", month: "August", subject: "✅" },
  { uid: "tb5", dutyId: "teacher-blog", teacherName: "Ms Rupsikha Dowerah", month: "September", subject: "✅" },
  { uid: "tb6", dutyId: "teacher-blog", teacherName: "Ms Shruthi Srinivas", month: "October", subject: "✅" },
  { uid: "tb7", dutyId: "teacher-blog", teacherName: "Ms Sandhya Singh", month: "November" },
  { uid: "tb8", dutyId: "teacher-blog", teacherName: "Ms Rima Kumari Ojha", month: "December" },
  { uid: "tb9", dutyId: "teacher-blog", teacherName: "Ms Geetha", month: "January" },
  { uid: "tb10", dutyId: "teacher-blog", teacherName: "Ms Vaishnavi S", month: "February", subject: "✅" },
  { uid: "tb11", dutyId: "teacher-blog", teacherName: "Ms Ankita Prakash", month: "March" },

  { uid: "ci1", dutyId: "club-in-charge", teacherName: "Mr Prashanth Mallik", clubName: "Visual Arts Club" },
  { uid: "ci2", dutyId: "club-in-charge", teacherName: "Mr Shashikumara", clubName: "Table Tennis (Wrap-Around)" },
  { uid: "ci3", dutyId: "club-in-charge", teacherName: "Mr Shashikumara", clubName: "Basketball (Wrap-Around)" },

  { uid: "bg1", dutyId: "buddy-group", teacherName: "English", leadLA: "Ms Rupsikha", leadGeneral: "Ms Shruthi", menteesLA1: "Shakshi, Taniya", menteesGen1: "Prashanth, Taniya" },
  { uid: "bg2", dutyId: "buddy-group", teacherName: "Math", leadLA: "Ms Asmita", leadGeneral: "Ms Sandhya", menteesLA1: "Vaishnavi, Ankita", menteesGen1: "Jayalakshmi, Tejaswini" },
  { uid: "bg3", dutyId: "buddy-group", teacherName: "SSC", leadLA: "Ms Mathangi", leadGeneral: "-", menteesLA1: "Sugandhi, Rupsikha, Sandhya" },
  { uid: "bg4", dutyId: "buddy-group", teacherName: "Kannada", leadLA: "Ms Mangala", leadGeneral: "-", menteesLA1: "Ms Tejaswini" },
  { uid: "bg5", dutyId: "buddy-group", teacherName: "Science", leadLA: "Ms Sandhya", leadGeneral: "-", menteesLA1: "Ankita, Jayalakshmi, Geetha" },
  { uid: "bg6", dutyId: "buddy-group", teacherName: "EY", leadLA: "Ms Geetha", leadGeneral: "-", menteesLA1: "Ms Muthamizh Selvi" },
  { uid: "bg7", dutyId: "buddy-group", teacherName: "VA", leadLA: "Mr Karthik / Mr Shashi", leadGeneral: "-", menteesLA1: "Mr Prashanth Mallik" }
];

async function updateDb() {
  await prisma.systemSettings.upsert({
    where: { key: 'duty_assignments_enice_list' },
    update: { value: JSON.stringify(data) },
    create: { key: 'duty_assignments_enice_list', value: JSON.stringify(data) }
  });
  console.log('Successfully updated duty_assignments_enice_list');
  await prisma.$disconnect();
}

updateDb().catch(console.error);
