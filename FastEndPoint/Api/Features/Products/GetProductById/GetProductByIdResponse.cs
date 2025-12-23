namespace Api.Features.Products.GetProductById;

public record GetProductByIdResponse(int Id, string Name, decimal Price, string? Description);

