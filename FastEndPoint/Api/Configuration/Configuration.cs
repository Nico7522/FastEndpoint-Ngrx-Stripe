using Api.Database;
using Api.Entities;
using Api.Shared.Security;
using FastEndpoints;
using FastEndpoints.Security;
using Microsoft.EntityFrameworkCore;

namespace Api.Configuration;

public static class Configuration
{
    extension(WebApplicationBuilder builder)
    {
        public void RegisterServices()
        {
            builder.Services.AddCors();
            builder.Services.AddDbContext<ProductDbContext>(opt => opt.UseInMemoryDatabase("Products"));
            builder.Services.AddAuthenticationJwtBearer(s => s.SigningKey = builder.Configuration["JwtSettings:SigninKey"])
                            .AddAuthorization()
                            .AddFastEndpoints();
        }

        public void ConfigureMiddleware()
        {
            // Configure middleware here
        }

    }

    extension(WebApplication app)
    {
        public void Seed()
        {
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ProductDbContext>();

            if (!db.Products.Any())
            {
                db.Products.AddRange(
                    new Product { Name = "Laptop", Price = 999.99m, Description = "Ordinateur portable haute performance" },
                    new Product { Name = "Souris", Price = 29.99m, Description = "Souris ergonomique sans fil" },
                    new Product { Name = "Clavier", Price = 79.99m, Description = "Clavier m�canique RGB" },
                    new Product { Name = "�cran", Price = 299.99m, Description = "�cran 27 pouces 4K" },
                    new Product { Name = "Webcam", Price = 89.99m, Description = "Webcam Full HD 1080p" }
                );
                db.SaveChanges();
            }

            if(!db.Users.Any())
            {
                db.Users.AddRange(
                    new User { Id = 1, Username = "admin", PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123") , Email = "admin@test.com", Role = Roles.Admin},
                    new User { Id = 2, Username = "user1", PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"), Email = "test1@test.com", Role = Roles.User },
                    new User { Id = 3, Username = "user2", PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"), Email = "test2@test.com", Role = Roles.User }
                );
                db.SaveChanges();
            }
        }
    }

}
