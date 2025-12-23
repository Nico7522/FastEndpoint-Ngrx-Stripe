using Api.Database;
using Api.Features.Order;
using FastEndpoints;
using Stripe;

public class StripeWebhookEndpoint(ProductDbContext context, IConfiguration configuration) : EndpointWithoutRequest
{

    public override void Configure()
    {
        Post("/stripe/webhook");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync(ct);

        var signatureHeader = HttpContext.Request.Headers["Stripe-Signature"];

        Event stripeEvent;

        try
        {
            stripeEvent = EventUtility.ConstructEvent(
                json,
                signatureHeader,
                configuration["Stripe:WebhookSecret"]
            );
        }
        catch
        {
            await Send.ErrorsAsync(400, ct);
            return;
        }

        if (stripeEvent.Type == PaymentStatus.Paid)
        {
            var intent = stripeEvent.Data.Object as PaymentIntent;
            if (intent is null)
            {
                return;
            }
            var order = context.Orders
                .FirstOrDefault(o => o.StripePaymentIntentId == intent.Id);

            if (order is not null)
            {
                order.Status = PaymentStatus.Paid;
                await context.SaveChangesAsync(ct);
            }
        }

        await Send.OkAsync(200, ct);
    }
}
