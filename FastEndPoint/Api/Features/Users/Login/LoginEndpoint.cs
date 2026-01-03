using Api.Configuration;
using Api.Database;
using Api.Features.Users.RefreshToken;
using FastEndpoints;
using FastEndpoints.Security;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Api.Features.Users.Login;

public class LoginEndpoint(ProductDbContext context, IConfiguration configuration) : Endpoint<LoginRequest, TokenResponse>
{
    public override void Configure()
    {
        Post("/users/login");
        AllowAnonymous();
    }
    public override async Task HandleAsync(LoginRequest req, CancellationToken ct)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == req.Email, cancellationToken: ct);
        if (user is null || !PasswordHasher.VerifyPassword(req.Password, user.PasswordHash))
        {
            AddError("The provided email or password is incorrect.", "WrongEmailOrPassword", FluentValidation.Severity.Error);

            await Send.ErrorsAsync(400, ct);
            return;
        }
        _ = CookieAuth.SignInAsync(u =>
        {
            u.Roles.Add("Admin");
            u.Permissions.AddRange(["Create_Item", "Delete_Item"]);
            u.Claims.Add(new("Address", "123 Street"));

            u["Email"] = "abc@def.com";
            u["Department"] = "Administration";
        });
        var signInKey = configuration["JwtSettings:SigninKey"];
        if (signInKey is null)
        {
            await Send.ErrorsAsync(500, ct);
            return;
        }
    
        Response = await CreateTokenWith<UserTokenService>(
            user.Id.ToString(),
            o =>
            {
                o.Roles.Add(user.Role);
                o.Claims.Add(
                    (ClaimTypes.Email, user.Email),
                    new(ClaimTypes.Sid, user.Id.ToString()),
                    new(ClaimTypes.NameIdentifier, user.Username),
                    new(ClaimTypes.Role, user.Role));
            }
        );

    }
}
