using Microsoft.AspNetCore.Mvc;
using MinhaAcademia.Api.Data;
using MinhaAcademia.Api.Models;

namespace MinhaAcademia.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly AppDbContext _db;
    public SettingsController(AppDbContext db) => _db = db;

    public record SettingsDto(int WeeklyGoal, DateOnly? PeriodStart, DateOnly? PeriodEnd);

    /// <summary>Lê a meta semanal e o período marcado.</summary>
    // GET /api/settings
    [HttpGet]
    public async Task<SettingsDto> Get()
    {
        var s = await _db.Settings.FindAsync(1) ?? new Setting { Id = 1, WeeklyGoal = 4 };
        return new SettingsDto(s.WeeklyGoal, s.PeriodStart, s.PeriodEnd);
    }

    /// <summary>Atualiza a meta semanal e/ou o período (início e fim).</summary>
    // PUT /api/settings   { "weeklyGoal": 4, "periodStart": "2026-09-01", "periodEnd": null }
    [HttpPut]
    public async Task<SettingsDto> Update([FromBody] SettingsDto dto)
    {
        var s = await _db.Settings.FindAsync(1);
        if (s is null)
        {
            s = new Setting { Id = 1 };
            _db.Settings.Add(s);
        }

        s.WeeklyGoal = Math.Clamp(dto.WeeklyGoal, 1, 7);
        s.PeriodStart = dto.PeriodStart;
        s.PeriodEnd = dto.PeriodEnd;

        await _db.SaveChangesAsync();
        return new SettingsDto(s.WeeklyGoal, s.PeriodStart, s.PeriodEnd);
    }
}
