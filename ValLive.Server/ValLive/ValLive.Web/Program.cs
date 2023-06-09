using Microsoft.EntityFrameworkCore;

using ValLive.Core.Interfaces;
using ValLive.Core.Model;
using ValLive.Core.Services;
using ValLive.Infrastructure;
using ValLive.Infrastructure.Data;
using ValLive.Web;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder => builder
    //.SetIsOriginAllowed(_ => true)
    //.AllowAnyOrigin()
    .WithOrigins("https://localhost:4200", "http://localhost:4200", "http://localhost")
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials()
    );
});

builder.Services.AddControllers();
builder.Services.AddSignalR();

builder.Services.Configure<StorageOptions>(options => builder.Configuration.GetSection(StorageOptions.Storage));

builder.Services.AddDbContext<OnionContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnectionString")));
builder.Services.AddTransient<DbContext, OnionContext>();
builder.Services.AddTransient<IRepository<Value, int>, EFRepository<Value, int>>();
builder.Services.AddTransient<IRepository<Feature, int>, EFRepository<Value, int>>();
builder.Services.AddTransient<IValueService, ValueService>();
builder.Services.AddTransient<IValuationService, ValuationService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");
app.MapHub<ValuationHub>("/valuationHub");
// app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();
