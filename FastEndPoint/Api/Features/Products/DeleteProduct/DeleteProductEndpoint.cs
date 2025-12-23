using Api.Database;
using FastEndpoints;
using UserRole = Api.Shared.Security.Roles;

namespace Api.Features.Products.DeleteProduct;

public class DeleteProductEndpoint(ProductDbContext context) : Endpoint<DeleteProductRequest>
{
    public override void Configure()
    {
        Delete("/api/products/{Id}");
        Roles(UserRole.Admin);
    }
    public override async Task HandleAsync(DeleteProductRequest req, CancellationToken ct)
    {
        var product = await context.Products.FindAsync([req.Id], ct);
        if (product is null)
        {
            await Send.NotFoundAsync(ct);
            return;
        }
        context.Products.Remove(product);
        await context.SaveChangesAsync(ct);
        await Send.NoContentAsync(ct);
    }
}
