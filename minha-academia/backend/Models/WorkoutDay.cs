namespace MinhaAcademia.Api.Models;

/// <summary>Um dia em que o usuário treinou.</summary>
public class WorkoutDay
{
    public int Id { get; set; }

    /// <summary>Data do treino (sem hora). Única por dia.</summary>
    public DateOnly Date { get; set; }

    /// <summary>Observação opcional (ex.: "perna", "cardio").</summary>
    public string? Note { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
