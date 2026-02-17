namespace Cars24API.Services;

public static class MongoConfig
{
    public static string? GetConnectionString(IConfiguration configuration)
    {
        // Standard .NET connection strings section
        var cs = configuration.GetConnectionString("Cars24DB");
        if (!string.IsNullOrWhiteSpace(cs)) return cs;

        // Common env var names on PaaS deployments
        cs = configuration["ConnectionStrings:Cars24DB"];
        if (!string.IsNullOrWhiteSpace(cs)) return cs;

        cs = configuration["Cars24DB"];
        if (!string.IsNullOrWhiteSpace(cs)) return cs;

        cs = configuration["MONGODB_URI"];
        if (!string.IsNullOrWhiteSpace(cs)) return cs;

        cs = configuration["MongoDB:ConnectionString"];
        if (!string.IsNullOrWhiteSpace(cs)) return cs;

        return null;
    }

    public static string GetDatabaseName(IConfiguration configuration)
    {
        var name = configuration["MongoDB:DatabaseName"];
        return string.IsNullOrWhiteSpace(name) ? "Cars24DB" : name;
    }
}
