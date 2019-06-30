/**
 * Response roles
 */
export enum Roles {
    'AdminUser'
}

export module RoleRouting {
    /**
     * returns the correct path for routing
     * @param role string of Roles enum
     */
    export function getRoute(role: string): string {
        return routesMap.get(Roles[role]);
    }

    /**
     * mapping Roles with internal paths
     */
    const routesMap = new Map<number, string>([
        [Roles['AdminUser'], 'user']
    ]);
}
