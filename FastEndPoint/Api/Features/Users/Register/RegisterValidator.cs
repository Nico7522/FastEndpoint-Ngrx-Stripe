using FastEndpoints;
using FluentValidation;
using System.ComponentModel.DataAnnotations;

namespace Api.Features.Users.Register;

public class RegisterValidator : Validator<RegisterRequest>
{
    public RegisterValidator()
    {
        RuleFor(x => x.UserName).NotEmpty().WithMessage("Username is required")
                                .MinimumLength(3).WithMessage("Username must be at least 3 characters long")
                                .MaximumLength(20).WithMessage("Username must not exceed 20 characters");
        RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required")
                                .MinimumLength(6).WithMessage("Password must be at least 6 characters long")
                                .MaximumLength(100).WithMessage("Password must not exceed 100 characters");
        RuleFor(x => x.PasswordConfirm).Equal(x => x.Password).WithMessage("Passwords do not match");
        RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required")
                             .EmailAddress().WithMessage("Invalid email format");
    }
}
