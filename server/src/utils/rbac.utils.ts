import { RoleScope } from '@prisma/client';

export const getScopeFilter = (user: any, entity: string = 'department') => {
  if (!user || user.role === 'SUPER_ADMIN' || user.roleScope === RoleScope.SYSTEM) {
    return {};
  }

  const scope = user.roleScope;

  switch (scope) {
    case RoleScope.CAMPUS:
      return { campusId: user.campusId };
    
    case RoleScope.SECTION:
      // For PMS, section might map to department
      if (entity === 'project') {
        return { departmentId: user.departmentId };
      }
      return { departmentId: user.departmentId };

    case RoleScope.OWN:
      if (entity === 'project') {
        return { managerId: user.id };
      }
      if (entity === 'task') {
        return { assigneeId: user.id };
      }
      return { id: user.id };

    case RoleScope.OWN_CHILD:
      // Placeholder for Parent -> Student mapping
      return { parentId: user.id };

    default:
      return { id: user.id };
  }
};
