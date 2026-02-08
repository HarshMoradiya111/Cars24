using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Cars24API.Services;

public class EmailService
{
  private static readonly JsonSerializerOptions JsonOptions = new JsonSerializerOptions
  {
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
  };

    private readonly IConfiguration _config;
  private readonly HttpClient _httpClient;

  public EmailService(IConfiguration config, HttpClient httpClient)
    {
        _config = config;
    _httpClient = httpClient;
    }

    public async Task SendPasswordResetEmailAsync(string toEmail, string resetLink)
    {
    var apiKey = _config["BrevoApi:ApiKey"];
    var senderName = _config["BrevoApi:SenderName"];
    var senderEmail = _config["BrevoApi:SenderEmail"];

    if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(senderEmail))
    {
      throw new InvalidOperationException("Brevo API configuration is missing.");
    }

    var payload = new
    {
      sender = new
      {
        name = string.IsNullOrWhiteSpace(senderName) ? "CARS24" : senderName,
        email = senderEmail
      },
      to = new[] { new { email = toEmail } },
      subject = "Reset your CARS24 password",
      htmlContent = BuildResetEmailBody(resetLink)
    };

    using var request = new HttpRequestMessage(HttpMethod.Post, "smtp/email")
    {
      Content = new StringContent(JsonSerializer.Serialize(payload, JsonOptions), Encoding.UTF8, "application/json")
    };

    request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    request.Headers.Add("api-key", apiKey);

    using var response = await _httpClient.SendAsync(request);
    if (!response.IsSuccessStatusCode)
    {
      var responseBody = await response.Content.ReadAsStringAsync();
      throw new InvalidOperationException($"Brevo API request failed with status {(int)response.StatusCode}: {responseBody}");
    }
    }

    private static string BuildResetEmailBody(string resetLink)
    {
        return $@"
<!DOCTYPE html>
<html>
  <body style=""font-family: Arial, sans-serif; color: #111;"">
    <h2>Password reset request</h2>
    <p>We received a request to reset your password. Click the button below to continue.</p>
    <p>
      <a href=""{resetLink}"" style=""display:inline-block;background:#2563eb;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;"">
        Reset Password
      </a>
    </p>
    <p>If you did not request this, you can safely ignore this email.</p>
  </body>
</html>";
    }
}
