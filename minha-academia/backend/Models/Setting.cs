namespace MinhaAcademia.Api.Models;

/// <summary>Configurações do usuário (linha única, Id = 1).</summary>
public class Setting
{
    public int Id { get; set; }

    /// <summary>Meta de treinos por semana (1 a 7).</summary>
    public int WeeklyGoal { get; set; } = 4;

    /// <summary>Início do período de treino marcado no calendário.</summary>
    public DateOnly? PeriodStart { get; set; }

    /// <summary>Fim do período de treino marcado no calendário.</summary>
    public DateOnly? PeriodEnd { get; set; }
}
