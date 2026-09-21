using Microsoft.EntityFrameworkCore;
using MinhaAcademia.Api.Models;

namespace MinhaAcademia.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<WorkoutDay> Workouts => Set<WorkoutDay>();
    public DbSet<Setting> Settings => Set<Setting>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        // Não deixa registrar o mesmo dia duas vezes
        b.Entity<WorkoutDay>().HasIndex(w => w.Date).IsUnique();

        // Já cria a linha de configurações padrão
        b.Entity<Setting>().HasData(new Setting { Id = 1, WeeklyGoal = 4 });
    }
}
