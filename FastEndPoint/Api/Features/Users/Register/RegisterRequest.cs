namespace Api.Features.Users.Register;

public class RegisterRequest
{
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string PasswordConfirm { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
