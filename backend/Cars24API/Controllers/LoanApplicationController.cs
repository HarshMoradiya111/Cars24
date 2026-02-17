using Cars24API.Models;
using Cars24API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;

namespace Cars24API.Controllers
{
    [ApiController]
    [EnableCors("CorsPolicy")]
    [Route("api/loanapplications")]
    public class LoanApplicationController : ControllerBase
    {
        private readonly LoanApplicationService _loanApplicationService;

        public LoanApplicationController(LoanApplicationService loanApplicationService)
        {
            _loanApplicationService = loanApplicationService;
        }

        [HttpGet]
        public async Task<ActionResult<List<LoanApplication>>> GetAll()
        {
            var loanApplications = await _loanApplicationService.GetAllAsync();
            return Ok(loanApplications);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LoanApplication>> GetById(string id)
        {
            var loanApplication = await _loanApplicationService.GetByIdAsync(id);
            if (loanApplication == null)
            {
                return NotFound(new { message = "Loan application not found" });
            }
            return Ok(loanApplication);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<LoanApplication>>> GetByUserId(string userId)
        {
            var loanApplications = await _loanApplicationService.GetByUserIdAsync(userId);
            return Ok(loanApplications);
        }

        [HttpGet("status/{status}")]
        public async Task<ActionResult<List<LoanApplication>>> GetByStatus(string status)
        {
            var loanApplications = await _loanApplicationService.GetByStatusAsync(status);
            return Ok(loanApplications);
        }

        [HttpPost]
        public async Task<ActionResult<LoanApplication>> Create([FromBody] LoanApplication loanApplication)
        {
            if (string.IsNullOrEmpty(loanApplication.Name) || 
                string.IsNullOrEmpty(loanApplication.Phone) || 
                string.IsNullOrEmpty(loanApplication.Email))
            {
                return BadRequest(new { message = "Name, phone, and email are required" });
            }

            loanApplication.CreatedAt = DateTime.UtcNow;
            loanApplication.Status = "Pending";

            var created = await _loanApplicationService.CreateAsync(loanApplication);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] LoanApplication loanApplication)
        {
            var existing = await _loanApplicationService.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound(new { message = "Loan application not found" });
            }

            loanApplication.Id = id;
            await _loanApplicationService.UpdateAsync(id, loanApplication);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existing = await _loanApplicationService.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound(new { message = "Loan application not found" });
            }

            await _loanApplicationService.DeleteAsync(id);
            return NoContent();
        }
    }
}
