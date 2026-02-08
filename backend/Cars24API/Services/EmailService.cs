using System.Net;
using System.Net.Mail;

namespace Cars24API.Services;

public class EmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendPasswordResetEmailAsync(string toEmail, string resetLink)
    {
        var host = _config["BrevoSmtp:Host"];
        var portValue = _config["BrevoSmtp:Port"];
        var username = _config["BrevoSmtp:Username"];
        var password = _config["BrevoSmtp:Password"];
        var senderName = _config["BrevoSmtp:SenderName"];
        var senderEmail = _config["BrevoSmtp:SenderEmail"];
        var useSslValue = _config["BrevoSmtp:UseSsl"];

        if (string.IsNullOrWhiteSpace(host) ||
            string.IsNullOrWhiteSpace(portValue) ||
            string.IsNullOrWhiteSpace(username) ||
            string.IsNullOrWhiteSpace(password) ||
            string.IsNullOrWhiteSpace(senderEmail))
        {
            throw new InvalidOperationException("Brevo SMTP configuration is missing.");
        }

        var port = int.TryParse(portValue, out var parsedPort) ? parsedPort : 587;
        var useSsl = bool.TryParse(useSslValue, out var parsedSsl) ? parsedSsl : true;

        var fromAddress = new MailAddress(senderEmail, string.IsNullOrWhiteSpace(senderName) ? "CARS24" : senderName);
        var toAddress = new MailAddress(toEmail);

        using var message = new MailMessage(fromAddress, toAddress)
        {
            Subject = "Reset your CARS24 password",
            Body = BuildResetEmailBody(resetLink),
            IsBodyHtml = true
        };

        using var client = new SmtpClient(host, port)
        {
            EnableSsl = useSsl,
            Credentials = new NetworkCredential(username, password)
        };

        await client.SendMailAsync(message);
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
