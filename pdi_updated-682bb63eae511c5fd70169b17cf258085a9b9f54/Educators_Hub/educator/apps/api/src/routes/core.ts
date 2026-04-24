import { Router } from 'express';
import { authGuard } from '../middleware/authGuard.js';
import { rbacGuard } from '../middleware/rbacGuard.js';
import { prisma } from '../prismaClient.js';

const router = Router();

router.use(authGuard);

router.get('/campuses', rbacGuard('myCampus', 'view'), async (req, res) => {
  const campuses = await prisma.campus.findMany({ include: { teachers: true, students: true } });
  res.json(campuses);
});

router.get('/teachers', rbacGuard('userManagement', 'view'), async (req, res) => {
  const teachers = await prisma.teacher.findMany({ include: { campus: true } });
  res.json(teachers);
});

router.get('/students', rbacGuard('studentRecords', 'view'), async (req, res) => {
  const students = await prisma.student.findMany({ include: { class: true, campus: true } });
  res.json(students);
});

router.get('/classes', rbacGuard('myClassroom', 'view'), async (req, res) => {
  const classes = await prisma.class.findMany({ include: { teacher: true, students: true, timetable: true } });
  res.json(classes);
});

router.get('/policies', rbacGuard('policiesApprovals', 'view'), async (req, res) => {
  const policies = await prisma.policy.findMany({ include: { campus: true } });
  res.json(policies);
});

router.get('/reports', rbacGuard('reportsAnalytics', 'view'), async (req, res) => {
  const campusCount = await prisma.campus.count();
  const teacherCount = await prisma.teacher.count();
  const studentCount = await prisma.student.count();
  res.json({ campusCount, teacherCount, studentCount });
});

export default router;
