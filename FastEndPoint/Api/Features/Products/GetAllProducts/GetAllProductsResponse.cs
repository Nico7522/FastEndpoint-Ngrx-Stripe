namespace Api.Features.Products.GetAllProducts;

public record GetAllProductsResponse(List<Api.Entities.Product> Products, int CurrentPage,int PageSize, int TotalItems, int TotalPages, bool HasPrevious, bool HasNext);

