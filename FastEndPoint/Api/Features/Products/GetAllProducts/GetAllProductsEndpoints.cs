using Api.Database;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Products.GetAllProducts;

public class GetAllProductsEndpoints(ProductDbContext context) : EndpointWithoutRequest<GetAllProductsResponse>
{
    public override void Configure()
    {
        Get("/products");
        AllowAnonymous();
    }
    public override async Task HandleAsync(CancellationToken ct)
    {
        int page = Query<int>("page");
        int pageSize = Query<int>("pageSize");

        if (pageSize > 100) pageSize = 100;

        var query = context.Products.AsQueryable();
        var totalItems = await query.CountAsync(ct);

        var products = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var totalPages = (int)Math.Ceiling((double)totalItems / (double)pageSize);

        var response = new GetAllProductsResponse(
            products,
            page,
            pageSize,
            totalItems,
            totalPages,
            page > 1,
            page < totalPages
        );

        await Send.OkAsync(response, ct);
    }
}
