using BioProSystem.EmailService;
using BioProSystem.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Twilio;
using System.Text.Json.Serialization;
using Twilio.Rest.Api.V2010.Account;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

try
{
    builder.Services.AddCors(options => options.AddDefaultPolicy(
        include =>
        {
            include.AllowAnyHeader();
            include.AllowAnyMethod();
            include.AllowAnyOrigin();
        }));

    builder.Services.AddControllers().AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Description = "Add Bearer Token",
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            BearerFormat = "JWT",
            Scheme = "bearer"
        });
        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new string[]{ }
            }
        });
    });

    builder.Services.AddIdentity<SystemUser, IdentityRole>(options =>
    {
        options.Password.RequireUppercase = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireNonAlphanumeric = true;
        options.Password.RequireDigit = true;
        options.User.RequireUniqueEmail = true;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<DentalProSystemTestDBContext>()
    .AddDefaultTokenProviders();

    builder.Services.AddAuthentication()
        .AddCookie()
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters()
            {
                ValidIssuer = builder.Configuration["Tokens:Issuer"],
                ValidAudience = builder.Configuration["Tokens:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Tokens:Key"]))
            };
        });

    builder.Services.Configure<DataProtectionTokenProviderOptions>(options => options.TokenLifespan = TimeSpan.FromHours(3));

    builder.Services.AddDbContext<DentalProSystemTestDBContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

    builder.Services.AddScoped<IRepository, Repository>();

    builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
    // Register the email sender service
    builder.Services.AddTransient<IEmailSender, EmailSender>();

    TwilioClient.Init("AC61be70d65a7bd65169a56cf4be5cd574", "ecb1193339c64649ec450f8fda1bef99");

}
catch (Exception ex)
{
    // Log the exception (for example, using a logger or just output to console for debugging)
    Console.WriteLine($"Error during service configuration: {ex.Message}");
    throw; // Re-throw the exception to prevent the application from starting
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
