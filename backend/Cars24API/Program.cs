using MongoDB.Driver;
using Cars24API.Services;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

string? connectionstring = builder.Configuration.GetConnectionString("Cars24DB");

builder.Services.AddTransient<UserService>(sp => new UserService(builder.Configuration));
builder.Services.AddTransient<EmailService>(sp => new EmailService(builder.Configuration));
builder.Services.AddTransient<CarService>(sp => new CarService(builder.Configuration));
builder.Services.AddTransient<BookingService>(sp => new BookingService(builder.Configuration));
builder.Services.AddTransient<AppointmentService>(sp => new AppointmentService(builder.Configuration));
builder.Services.AddTransient<PricingService>(sp => new PricingService(builder.Configuration));
builder.Services.AddTransient<RedemptionService>(sp => new RedemptionService(builder.Configuration));
builder.Services.AddTransient<ServiceBookingService>(sp => new ServiceBookingService(builder.Configuration));
builder.Services.AddTransient<LoanApplicationService>(sp => new LoanApplicationService(builder.Configuration));

builder.Services.AddCors(options =>
    options.AddPolicy("AllowAll", policy =>
        policy
            .WithOrigins(
                "https://cars24-teal.vercel.app",
                "http://localhost:3000",
                "http://localhost:3001"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
    )
);

var app = builder.Build();

// Enable CORS before mapping routes
app.UseCors("AllowAll");

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
