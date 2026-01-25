using MongoDB.Driver;
using Cars24API.Services;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

string? connectionstring = builder.Configuration.GetConnectionString("Cars24DB");

builder.Services.AddTransient<UserService>(sp => new UserService(builder.Configuration));
builder.Services.AddTransient<CarService>(sp => new CarService(builder.Configuration));
builder.Services.AddTransient<BookingService>(sp => new BookingService(builder.Configuration));
builder.Services.AddTransient<AppointmentService>(sp => new AppointmentService(builder.Configuration));

builder.Services.AddCors(options =>
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()
    )
);

var app = builder.Build();

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

app.UseCors("AllowAll");

app.MapControllers();

app.Run();
