import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(private router: Router) {this.loadRoles(); }
  private roles: string[] = [];
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles: string[] = route.data['expectedRoles'];
    const userRoles: string[] = JSON.parse(sessionStorage.getItem('User') || '[]').roles;
    const user: any = JSON.parse(sessionStorage.getItem('User') || '[]')

    if (!user) {
        this.router.navigate(['unauthorized'], { queryParams: { reason: 'notSignedIn' } });
        return false;
      }
  
      // Check if the user has any of the expected roles
      if (!expectedRoles.some(role => this.roles.map(r => r.toLowerCase()).includes(role.toLowerCase()))) {
        this.router.navigate(['unauthorized']);
        return false;
      }
  
      return true;
  }
  public loadRoles() {
    const user = JSON.parse(sessionStorage.getItem('User') || '{}');
    this.roles = user.roles || [];
  }

  // Get roles
  getRoles(): string[] {
    return this.roles;
  }

  // Check if a user has a specific role
  hasRole(roles: string[]): boolean {
    return roles.some(role => this.roles.map(r => r.toLowerCase()).includes(role.toLowerCase()));
  }
}
