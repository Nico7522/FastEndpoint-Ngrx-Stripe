using Api.Database;
using FastEndpoints;

namespace Api.Features.Products.GetProductById;

public class GetProductByIdEndPoint(ProductDbContext context) : Endpoint<GetProductByIdRequest, GetProductByIdResponse>
{
    public override void Configure()
    {
        Get("/api/products/{Id}");
        AllowAnonymous();
    }
    public override async Task HandleAsync(GetProductByIdRequest req, CancellationToken ct)
    {
        var product = await context.Products.FindAsync([req.Id], ct);
        if (product is null)
        {
           await Send.NotFoundAsync(ct);
           return;
        }

         await Send.OkAsync(new GetProductByIdResponse(product.Id, product.Name, product.Price, product.Description), ct);
    }
}
