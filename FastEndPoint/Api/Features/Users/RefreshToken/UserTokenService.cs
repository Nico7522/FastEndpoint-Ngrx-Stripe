using Api.Database;
using Api.Entities;
using FastEndpoints;
using FastEndpoints.Security;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using static FastEndpoints.Ep;

namespace Api.Features.Users.RefreshToken;

public class UserTokenService : RefreshTokenService<TokenRequest, TokenResponse>
{
    private readonly ProductDbContext _context;
    public UserTokenService(IConfiguration configuration, ProductDbContext context)
    {
        Setup(o => {
            o.TokenSigningKey = configuration["JwtSettings:SigninKey"];
            o.AccessTokenValidity = TimeSpan.FromMinutes(5);
            o.RefreshTokenValidity = TimeSpan.FromHours(4);
            o.Endpoint("/refresh-token", ep =>
            {
                ep.Summary(s => s.Summary = "this is the refresh token endpoint");
            });
        });
        _context = context;
    }
    public override async Task PersistTokenAsync(TokenResponse response)
    {
        var refreshToken = new RefreshToken
        {
            Token = response.RefreshToken!,
            ExpiryDate = DateTime.UtcNow.AddHours(4),
            UserId = response.UserId
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();
    }


    public override async Task RefreshRequestValidationAsync(TokenRequest req)
    {
        var token = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == req.RefreshToken);
        if (token is null || token.ExpiryDate < DateTime.UtcNow)
        {
            AddError("Invalid or expired refresh token.");
            await Send.ErrorsAsync(400);
            return;
        }
    }

    public override async Task SetRenewalPrivilegesAsync(TokenRequest req, UserPrivileges privileges)
    {
        var user = await _context.Users.FirstOrDefaultAsync(t => t.Id.ToString() == req.UserId);
        if (user is null) { 
            AddError("User not found.");
            await Send.ErrorsAsync(404);
            return;
        }
        privileges.Claims.Add(new(ClaimTypes.Sid, user.Id.ToString()));
        privileges.Claims.Add(new(ClaimTypes.NameIdentifier, user.Username));
        privileges.Claims.Add(new(ClaimTypes.Email, user.Email));
        privileges.Claims.Add(new(ClaimTypes.Role, user.Role));
        privileges.Roles.Add(user.Role);

    }
}
