using Api.Configuration;
using Api.Entities;
using FastEndpoints;
using Stripe;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateSlimBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
});

StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];

builder.RegisterServices();
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseCors(c =>
{
    c.AllowAnyOrigin()
     .AllowAnyMethod()
     .AllowAnyHeader();
});
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Seed data on startup
app.Seed();

app.UseAuthentication()
   .UseAuthorization()
   .UseFastEndpoints(c =>
   {
       c.Endpoints.RoutePrefix = "api";
       c.Errors.UseProblemDetails(x =>
       {
           x.AllowDuplicateErrors = true;
           x.IndicateErrorCode = true;
           x.IndicateErrorSeverity = true;
           x.TypeValue = "https://www.rfc-editor.org/rfc/rfc7231#section-6.5.1";
           x.TitleValue = "One or more validation errors occurred.";
           x.TitleTransformer = pd => pd.Status switch
           {
               400 => "Validation Error",
               401 => "Unauthorized",
               403 => "Forbidden",
               404 => "Not Found",
               _ => "Server error."
           };
           x.DetailTransformer = _ => "See errors field for more details.";
       });

   });

app.Run();


[JsonSerializable(typeof(Api.Entities.Product[]))]
[JsonSerializable(typeof(Api.Entities.Product))]
internal partial class AppJsonSerializerContext : JsonSerializerContext
{

}
