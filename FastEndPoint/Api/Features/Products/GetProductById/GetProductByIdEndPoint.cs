using Api.Database;
using FastEndpoints;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Api.Features.Products.GetProductById;

public class GetProductByIdEndPoint(ProductDbContext context) : Endpoint<GetProductByIdRequest, GetProductByIdResponse>
{
    public override void Configure()
    {
        Get("/products/{Id}");
  
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
