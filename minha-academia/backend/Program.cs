using Microsoft.EntityFrameworkCore;
using MinhaAcademia.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Controllers + Swagger (documentação da API em /swagger)
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Banco de dados via EF Core (SQLite por padrão — veja appsettings.json)
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("Default")
                  ?? "Data Source=academia.db"));

// Libera o front-end (React em http://localhost:5173) a chamar a API
builder.Services.AddCors(o => o.AddPolicy("frontend", p =>
    p.WithOrigins("http://localhost:5173")
     .AllowAnyHeader()
     .AllowAnyMethod()));

var app = builder.Build();

// Cria o banco automaticamente na primeira execução
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("frontend");
app.MapControllers();

app.Run();
