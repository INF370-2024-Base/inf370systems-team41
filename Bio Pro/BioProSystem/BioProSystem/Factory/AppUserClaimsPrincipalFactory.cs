using BioProSystem.Models;
using BioProSystem.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace ApplicationSecurity_Backend.Factory
{
    public class AppUserClaimsPrincipalFactory: UserClaimsPrincipalFactory<SystemUser, IdentityRole>
    {
        public AppUserClaimsPrincipalFactory(UserManager<SystemUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IOptions<IdentityOptions> optionsAccessor)
        : base(userManager, roleManager, optionsAccessor)
        {
        }

    }
}

