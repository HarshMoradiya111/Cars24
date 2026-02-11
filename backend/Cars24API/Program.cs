using MongoDB.Driver;
using Cars24API.Services;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

string? connectionstring = builder.Configuration.GetConnectionString("Cars24DB");

// Register MongoDbContext as Singleton for connection pooling
builder.Services.AddSingleton<MongoDbContext>();
builder.Services.AddSingleton<MongoDbIndexInitializer>();

// Register services with MongoDbContext dependency injection
builder.Services.AddTransient<UserService>(sp => new UserService(builder.Configuration));
builder.Services.AddHttpClient<EmailService>(client =>
{
    client.BaseAddress = new Uri("https://api.brevo.com/v3/");
    client.Timeout = TimeSpan.FromSeconds(10);
});
builder.Services.AddTransient<CarService>();
builder.Services.AddTransient<BookingService>(sp => new BookingService(builder.Configuration));
builder.Services.AddTransient<AppointmentService>(sp => new AppointmentService(builder.Configuration));
builder.Services.AddTransient<PricingService>(sp => new PricingService(builder.Configuration));
builder.Services.AddTransient<RedemptionService>(sp => new RedemptionService(builder.Configuration));
builder.Services.AddTransient<ServiceBookingService>(sp => new ServiceBookingService(builder.Configuration));
builder.Services.AddTransient<LoanApplicationService>(sp => new LoanApplicationService(builder.Configuration));

builder.Services.AddCors(options =>
    options.AddPolicy("AllowAll", policy =>
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader()
    )
);

var app = builder.Build();

// Initialize MongoDB indexes on startup
using (var scope = app.Services.CreateScope())
{
    var indexInitializer = scope.ServiceProvider.GetRequiredService<MongoDbIndexInitializer>();
    await indexInitializer.InitializeAsync();
}

// Enable CORS before mapping routes
app.UseCors("AllowAll");

// Ensure CORS middleware is applied before any other middleware
app.UseRouting();

app.MapGet("/", () => "Welcome to Cars24 API");

app.MapGet("/db-check", async () =>
{
    try
    {
        if (string.IsNullOrEmpty(connectionstring))
            return Results.BadRequest("Connection string not configured");

        var client = new MongoClient(connectionstring);
        await client.ListDatabaseNamesAsync();

        return Results.Ok("MongoDb connected successfully");
    }
    catch (Exception ex)
    {
        return Results.Problem($"Mongodb connection failed: {ex.Message}");
    }
});

app.MapControllers();

app.Run();
