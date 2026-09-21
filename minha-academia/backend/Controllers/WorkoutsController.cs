using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinhaAcademia.Api.Data;
using MinhaAcademia.Api.Models;

namespace MinhaAcademia.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkoutsController : ControllerBase
{
    private readonly AppDbContext _db;
    public WorkoutsController(AppDbContext db) => _db = db;

    public record WorkoutDto(int Id, DateOnly Date, string? Note);
    public record DateBody(DateOnly Date, string? Note);

    /// <summary>Lista os treinos, opcionalmente filtrando por intervalo.</summary>
    // GET /api/workouts?from=2026-01-01&to=2026-12-31
    [HttpGet]
    public async Task<IEnumerable<WorkoutDto>> Get([FromQuery] DateOnly? from, [FromQuery] DateOnly? to)
    {
        var q = _db.Workouts.AsQueryable();
        if (from is not null) q = q.Where(w => w.Date >= from);
        if (to is not null) q = q.Where(w => w.Date <= to);

        return await q.OrderBy(w => w.Date)
                      .Select(w => new WorkoutDto(w.Id, w.Date, w.Note))
                      .ToListAsync();
    }

    /// <summary>Marca (ou desmarca) um dia de treino.</summary>
    // POST /api/workouts/toggle   { "date": "2026-09-20" }
    [HttpPost("toggle")]
    public async Task<IActionResult> Toggle([FromBody] DateBody body)
    {
        var existing = await _db.Workouts.FirstOrDefaultAsync(w => w.Date == body.Date);
        if (existing is not null)
        {
            _db.Workouts.Remove(existing);
            await _db.SaveChangesAsync();
            return Ok(new { date = body.Date, attended = false });
        }

        _db.Workouts.Add(new WorkoutDay { Date = body.Date, Note = body.Note });
        await _db.SaveChangesAsync();
        return Ok(new { date = body.Date, attended = true });
    }

    /// <summary>Remove um dia de treino específico.</summary>
    // DELETE /api/workouts/2026-09-20
    [HttpDelete("{date}")]
    public async Task<IActionResult> Delete(DateOnly date)
    {
        var existing = await _db.Workouts.FirstOrDefaultAsync(w => w.Date == date);
        if (existing is null) return NotFound();

        _db.Workouts.Remove(existing);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
