using Api.Database;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Products.GetAllProducts;

public class GetAllProductsEndpoints(ProductDbContext context) : EndpointWithoutRequest<GetAllProductsResponse[]>
{
    public override void Configure()
    {
        Get("/products");
        AllowAnonymous();
    }
    public override async Task HandleAsync(CancellationToken ct)
    {
        await Send.OkAsync(await context.Products.Select(p => new GetAllProductsResponse(p.Id, p.Name, p.Price, p.Description)).ToArrayAsync(cancellationToken: ct), ct);
    }
}
