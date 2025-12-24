using Api.Database;
using Api.Entities;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Users.Register;

public class RegisterEndpoint(ProductDbContext context) : Endpoint<RegisterRequest>
{
    public override void Configure()
    {
        Post("/users/register");
        AllowAnonymous();
    }

    public override async Task HandleAsync(RegisterRequest req, CancellationToken ct)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == req.Email, ct);
        if(user is not null)
        {
            AddError("Email already exist");
            await Send.ErrorsAsync(400, ct);
            return;
        }
        await context.Users.AddAsync(new User { Email = req.Email, Username = req.UserName, PasswordHash = PasswordHasher.HashPassword(req.Password) }, ct);
        await context.SaveChangesAsync(ct);
        await Send.NoContentAsync(ct);
    }
}
