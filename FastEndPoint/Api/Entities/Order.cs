namespace Api.Entities;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public List<OrderItem> Items { get; set; } = [];
    public string StripePaymentIntentId { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
}

