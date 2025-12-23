using Api.Database;
using Api.Entities;
using Api.Features.Products.GetProductById;
using UserRole = Api.Shared.Security.Roles;
using FastEndpoints;

namespace Api.Features.Products.CreateProduct
{
    public class CreateProductEndpoint(ProductDbContext context) : Endpoint<CreateProductRequest>
    {
        public override void Configure()
        {
            Post("/api/products");
            Roles(UserRole.Admin);
        }
        public override async Task HandleAsync(CreateProductRequest req, CancellationToken ct)
        {
            var product = new Product
            {
                Name = req.Name,
                Price = req.Price,
                Description = req.Description
            };
            await context.AddAsync(product, ct);
            await context.SaveChangesAsync(ct);
            await Send.CreatedAtAsync<GetProductByIdEndPoint>(new { product.Id }, cancellation: ct);
        }
    }
}
