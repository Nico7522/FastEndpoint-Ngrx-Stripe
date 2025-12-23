using Api.Database;
using FastEndpoints;
using UserRole = Api.Shared.Security.Roles;

namespace Api.Features.Products.UpdateProduct;

public class UpdateProductEndpoint(ProductDbContext context) : Endpoint<UpdateProductRequest>
{
    public override void Configure()
    {
        Put("/api/products/{Id}");
        Roles(UserRole.Admin);
    }
    public override async Task HandleAsync(UpdateProductRequest req, CancellationToken ct)
    {
        var product = await context.Products.FindAsync([req.Id], ct);
        if (product is null)
        {
            await Send.NotFoundAsync(ct);
            return;
        }

        product.Name = req.Name;
        product.Price = req.Price;
        product.Description = req.Description;
        await context.SaveChangesAsync(ct);
        await Send.NoContentAsync(ct);
    }
}
