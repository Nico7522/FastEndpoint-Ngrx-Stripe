using Api.Database;
using Api.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authentication.Cookies;
using Stripe;

namespace Api.Features.Order;

public class CreatePaymentIntentEndpoint(ProductDbContext context) : Endpoint<CreatePaymentIntentRequest, CreatePaymentIntentResponse>
{
    public override void Configure()
    {
        Post("/payments/create-intent");
    }

    public override async Task HandleAsync(
        CreatePaymentIntentRequest req,
        CancellationToken ct)
    {
        var products = context.Products
            .Where(p => req.Items.Select(i => i.ProductId).Contains(p.Id))
            .ToList();

        if (products.Count == 0)
        {
            await Send.ErrorsAsync(400, ct);
            return;
        }

        decimal totalAmount = 0;
        List<OrderItem> orderItem = [];
        foreach (var item in req.Items)
        {
            var product = products.First(p => p.Id == item.ProductId);
            if(product is null)
            {
                await Send.ErrorsAsync(400, ct);
                return;
            }
            totalAmount += (product.Price * item.Quantity);


            orderItem.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                UnitPrice = product.Price,
                Quantity = item.Quantity
            });
        }


        // Stripe attend des montants en centimes
        var amountInCents = (long)(totalAmount * 100);

        var options = new PaymentIntentCreateOptions
        {
            Amount = amountInCents,
            Currency = "eur",
            AutomaticPaymentMethods = new()
            {
                Enabled = true
            }
        };

        var service = new PaymentIntentService();
        var intent = await service.CreateAsync(options, cancellationToken: ct);

        // Optionnel : créer une Order "Pending"
        var order = new Entities.Order
        {
            UserId = req.UserId,
            OrderDate = DateTime.UtcNow,
            TotalAmount = totalAmount,
            Items = orderItem,
            StripePaymentIntentId = intent.Id,
            Status = "Pending"
        };

        context.Orders.Add(order);
        await context.SaveChangesAsync(ct);

        await Send.OkAsync(new CreatePaymentIntentResponse
        {
            ClientSecret = intent.ClientSecret!
        }, ct);
    }
}
