import sidebarItems from './sidebarItems';

function normalizeRole(role = '') {
  return role.toLowerCase().trim().replace(/\s+/g, '_');
}

export function getSidebarItems(role) {
  const userRole = normalizeRole(role);

  return sidebarItems
    .filter((item) => item.roles.includes(userRole))
    .map((item) => {
      if (item.pathByRole) {
        return {
          label: item.label,
          path:
            item.pathByRole[userRole] ||
            item.pathByRole.member ||
            '/dashboard',
        };
      }

      return {
        label: item.label,
        path: item.path,
      };
    });
}