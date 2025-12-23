namespace Api.Features.Order;

public class CreatePaymentIntentRequest
{
    public int UserId { get; set; }
    public OrderItemDto[] Items { get; set; } = [];
}
public class OrderItemDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}