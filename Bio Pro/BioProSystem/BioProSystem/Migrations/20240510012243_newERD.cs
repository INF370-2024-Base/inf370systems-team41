using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class newERD : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ActionTypes",
                columns: table => new
                {
                    ActionTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActionTypes", x => x.ActionTypeId);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Surname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Calanders",
                columns: table => new
                {
                    CalanderId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TimelineId = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Calanders", x => x.CalanderId);
                });

            migrationBuilder.CreateTable(
                name: "DeliveryStatuses",
                columns: table => new
                {
                    DeliveryStatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeliveryStatuses", x => x.DeliveryStatusId);
                });

            migrationBuilder.CreateTable(
                name: "Dentists",
                columns: table => new
                {
                    DentistId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactDetail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dentists", x => x.DentistId);
                });

            migrationBuilder.CreateTable(
                name: "EmployeeDailyHours",
                columns: table => new
                {
                    EmployeeDailyHoursId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WorkDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Hours = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeDailyHours", x => x.EmployeeDailyHoursId);
                });

            migrationBuilder.CreateTable(
                name: "JobTitles",
                columns: table => new
                {
                    JobTitleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TitleName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobTitles", x => x.JobTitleId);
                });

            migrationBuilder.CreateTable(
                name: "MedicalAids",
                columns: table => new
                {
                    MedicalAidId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicalAidNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MedicalAidName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalAids", x => x.MedicalAidId);
                });

            migrationBuilder.CreateTable(
                name: "OpenOrders",
                columns: table => new
                {
                    OpenOrderId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EstimatedDurationInDays = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OpenOrders", x => x.OpenOrderId);
                });

            migrationBuilder.CreateTable(
                name: "OrderDirectionStates",
                columns: table => new
                {
                    OrderDirectionStateId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StateDescription = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderDirectionStates", x => x.OrderDirectionStateId);
                });

            migrationBuilder.CreateTable(
                name: "OrderStatuses",
                columns: table => new
                {
                    OrderStatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderStatuses", x => x.OrderStatusId);
                });

            migrationBuilder.CreateTable(
                name: "OrderTypes",
                columns: table => new
                {
                    OrderTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderTypes", x => x.OrderTypeId);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    PaymentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RefundPaymentId = table.Column<int>(type: "int", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProofOfPayment = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    IslatePayment = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.PaymentId);
                });

            migrationBuilder.CreateTable(
                name: "StockCategories",
                columns: table => new
                {
                    StockCategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockCategories", x => x.StockCategoryId);
                });

            migrationBuilder.CreateTable(
                name: "Suppliers",
                columns: table => new
                {
                    SupplierId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SupplierName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CellphoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Suppliers", x => x.SupplierId);
                });

            migrationBuilder.CreateTable(
                name: "TeethShades",
                columns: table => new
                {
                    TeethShadeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Colour = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ColourCode = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeethShades", x => x.TeethShadeId);
                });

            migrationBuilder.CreateTable(
                name: "PasswordManagements",
                columns: table => new
                {
                    ManagementId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ChangeTimeStamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActionTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PasswordManagements", x => x.ManagementId);
                    table.ForeignKey(
                        name: "FK_PasswordManagements_ActionTypes_ActionTypeId",
                        column: x => x.ActionTypeId,
                        principalTable: "ActionTypes",
                        principalColumn: "ActionTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserActions",
                columns: table => new
                {
                    ActionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId1 = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserActions", x => x.ActionId);
                    table.ForeignKey(
                        name: "FK_UserActions_AspNetUsers_UserId1",
                        column: x => x.UserId1,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CalanderScheduleEvents",
                columns: table => new
                {
                    CalanderScheduleEventId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CalanderScheduleEventDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CalanderId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CalanderScheduleEvents", x => x.CalanderScheduleEventId);
                    table.ForeignKey(
                        name: "FK_CalanderScheduleEvents_Calanders_CalanderId",
                        column: x => x.CalanderId,
                        principalTable: "Calanders",
                        principalColumn: "CalanderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProceduralTimelines",
                columns: table => new
                {
                    ProceduralTimelineId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CalanderId = table.Column<int>(type: "int", nullable: false),
                    TimelineDetail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TimeStamp = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProceduralTimelines", x => x.ProceduralTimelineId);
                    table.ForeignKey(
                        name: "FK_ProceduralTimelines_Calanders_CalanderId",
                        column: x => x.CalanderId,
                        principalTable: "Calanders",
                        principalColumn: "CalanderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    EmployeeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SystemUserId = table.Column<int>(type: "int", nullable: false),
                    JobTitleId = table.Column<int>(type: "int", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CellphoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SystemUserId1 = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.EmployeeId);
                    table.ForeignKey(
                        name: "FK_Employees_AspNetUsers_SystemUserId1",
                        column: x => x.SystemUserId1,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Employees_JobTitles_JobTitleId",
                        column: x => x.JobTitleId,
                        principalTable: "JobTitles",
                        principalColumn: "JobTitleId");
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    PatientId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirsName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Lastname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DentistId = table.Column<int>(type: "int", nullable: false),
                    MedicalAidId = table.Column<int>(type: "int", nullable: false),
                    CellphoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.PatientId);
                    table.ForeignKey(
                        name: "FK_Patients_Dentists_DentistId",
                        column: x => x.DentistId,
                        principalTable: "Dentists",
                        principalColumn: "DentistId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Patients_MedicalAids_MedicalAidId",
                        column: x => x.MedicalAidId,
                        principalTable: "MedicalAids",
                        principalColumn: "MedicalAidId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderDirections",
                columns: table => new
                {
                    OrderDirectionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Instructions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OrderDirectionStateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderDirections", x => x.OrderDirectionId);
                    table.ForeignKey(
                        name: "FK_OrderDirections_OrderDirectionStates_OrderDirectionStateId",
                        column: x => x.OrderDirectionStateId,
                        principalTable: "OrderDirectionStates",
                        principalColumn: "OrderDirectionStateId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RefundPayments",
                columns: table => new
                {
                    RefundPaymentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PaymentId = table.Column<int>(type: "int", nullable: false),
                    ProofOfrefund = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    RefundPaymentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReasonForRefund = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RefundPaymentAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefundPayments", x => x.RefundPaymentId);
                    table.ForeignKey(
                        name: "FK_RefundPayments_Payments_PaymentId",
                        column: x => x.PaymentId,
                        principalTable: "Payments",
                        principalColumn: "PaymentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Stocks",
                columns: table => new
                {
                    StockId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StockCategoryId = table.Column<int>(type: "int", nullable: false),
                    SupplierId = table.Column<int>(type: "int", nullable: false),
                    StockName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    QuantityAvailable = table.Column<int>(type: "int", nullable: false),
                    MaximumStockLevel = table.Column<int>(type: "int", nullable: false),
                    MinimumStockLevel = table.Column<int>(type: "int", nullable: false),
                    ReorderPoint = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stocks", x => x.StockId);
                    table.ForeignKey(
                        name: "FK_Stocks_StockCategories_StockCategoryId",
                        column: x => x.StockCategoryId,
                        principalTable: "StockCategories",
                        principalColumn: "StockCategoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Stocks_Suppliers_SupplierId",
                        column: x => x.SupplierId,
                        principalTable: "Suppliers",
                        principalColumn: "SupplierId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PasswordManagementSystemUser",
                columns: table => new
                {
                    ManagementId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PasswordManagementSystemUser", x => new { x.ManagementId, x.UserId });
                    table.ForeignKey(
                        name: "FK_PasswordManagementSystemUser_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PasswordManagementSystemUser_PasswordManagements_ManagementId",
                        column: x => x.ManagementId,
                        principalTable: "PasswordManagements",
                        principalColumn: "ManagementId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EmployeeEmployeeDailyHours",
                columns: table => new
                {
                    EmployeeDailyHoursId = table.Column<int>(type: "int", nullable: false),
                    EmployeesEmployeeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeEmployeeDailyHours", x => new { x.EmployeeDailyHoursId, x.EmployeesEmployeeId });
                    table.ForeignKey(
                        name: "FK_EmployeeEmployeeDailyHours_EmployeeDailyHours_EmployeeDailyHoursId",
                        column: x => x.EmployeeDailyHoursId,
                        principalTable: "EmployeeDailyHours",
                        principalColumn: "EmployeeDailyHoursId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmployeeEmployeeDailyHours_Employees_EmployeesEmployeeId",
                        column: x => x.EmployeesEmployeeId,
                        principalTable: "Employees",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderWorkflowTimelines",
                columns: table => new
                {
                    WorkflowStructureId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TimelineId = table.Column<int>(type: "int", nullable: true),
                    SystemOrderId = table.Column<int>(type: "int", nullable: false),
                    OrderDirectionId = table.Column<int>(type: "int", nullable: false),
                    TimelineDetails = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderWorkflowTimelines", x => x.WorkflowStructureId);
                    table.ForeignKey(
                        name: "FK_OrderWorkflowTimelines_OrderDirections_OrderDirectionId",
                        column: x => x.OrderDirectionId,
                        principalTable: "OrderDirections",
                        principalColumn: "OrderDirectionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderWorkflowTimelines_ProceduralTimelines_TimelineId",
                        column: x => x.TimelineId,
                        principalTable: "ProceduralTimelines",
                        principalColumn: "ProceduralTimelineId");
                });

            migrationBuilder.CreateTable(
                name: "StakeWriteOffs",
                columns: table => new
                {
                    StakeWriteOffId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StockId = table.Column<int>(type: "int", nullable: false),
                    QuantityWrittenOff = table.Column<int>(type: "int", nullable: false),
                    WriteOffDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StakeWriteOffs", x => x.StakeWriteOffId);
                    table.ForeignKey(
                        name: "FK_StakeWriteOffs_Stocks_StockId",
                        column: x => x.StockId,
                        principalTable: "Stocks",
                        principalColumn: "StockId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SystemOrders",
                columns: table => new
                {
                    OrderId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DentistId = table.Column<int>(type: "int", nullable: false),
                    OpenOrderId = table.Column<int>(type: "int", nullable: false),
                    OrderStatusId = table.Column<int>(type: "int", nullable: false),
                    OrderWorkflowTimelineId = table.Column<int>(type: "int", nullable: true),
                    OrderTypeId = table.Column<int>(type: "int", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    OrderDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SpecialRequirements = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PriorityLevel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MouthArea = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TotalAmountDue = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemOrders", x => x.OrderId);
                    table.ForeignKey(
                        name: "FK_SystemOrders_Dentists_DentistId",
                        column: x => x.DentistId,
                        principalTable: "Dentists",
                        principalColumn: "DentistId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SystemOrders_OpenOrders_OpenOrderId",
                        column: x => x.OpenOrderId,
                        principalTable: "OpenOrders",
                        principalColumn: "OpenOrderId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SystemOrders_OrderStatuses_OrderStatusId",
                        column: x => x.OrderStatusId,
                        principalTable: "OrderStatuses",
                        principalColumn: "OrderStatusId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SystemOrders_OrderTypes_OrderTypeId",
                        column: x => x.OrderTypeId,
                        principalTable: "OrderTypes",
                        principalColumn: "OrderTypeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SystemOrders_OrderWorkflowTimelines_OrderWorkflowTimelineId",
                        column: x => x.OrderWorkflowTimelineId,
                        principalTable: "OrderWorkflowTimelines",
                        principalColumn: "WorkflowStructureId");
                });

            migrationBuilder.CreateTable(
                name: "DecisionLogs",
                columns: table => new
                {
                    DecisionLogId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DecisionLogState = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Justification = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SystemOrderId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DecisionLogs", x => x.DecisionLogId);
                    table.ForeignKey(
                        name: "FK_DecisionLogs_SystemOrders_SystemOrderId",
                        column: x => x.SystemOrderId,
                        principalTable: "SystemOrders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Deliveries",
                columns: table => new
                {
                    DeliveryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SystemOrderId = table.Column<int>(type: "int", nullable: false),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    DeliveryDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeliveryStatusId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Deliveries", x => x.DeliveryId);
                    table.ForeignKey(
                        name: "FK_Deliveries_DeliveryStatuses_DeliveryStatusId",
                        column: x => x.DeliveryStatusId,
                        principalTable: "DeliveryStatuses",
                        principalColumn: "DeliveryStatusId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Deliveries_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Deliveries_SystemOrders_SystemOrderId",
                        column: x => x.SystemOrderId,
                        principalTable: "SystemOrders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Discounts",
                columns: table => new
                {
                    DiscountId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SystemOrderId = table.Column<int>(type: "int", nullable: false),
                    ReasonForDiscount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DiscountAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DiscountDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Discounts", x => x.DiscountId);
                    table.ForeignKey(
                        name: "FK_Discounts_SystemOrders_SystemOrderId",
                        column: x => x.SystemOrderId,
                        principalTable: "SystemOrders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EmployeeSystemOrder",
                columns: table => new
                {
                    EmployeesEmployeeId = table.Column<int>(type: "int", nullable: false),
                    SystemOrdersOrderId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeSystemOrder", x => new { x.EmployeesEmployeeId, x.SystemOrdersOrderId });
                    table.ForeignKey(
                        name: "FK_EmployeeSystemOrder_Employees_EmployeesEmployeeId",
                        column: x => x.EmployeesEmployeeId,
                        principalTable: "Employees",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmployeeSystemOrder_SystemOrders_SystemOrdersOrderId",
                        column: x => x.SystemOrdersOrderId,
                        principalTable: "SystemOrders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MediaFiles",
                columns: table => new
                {
                    MediaFileId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SystemOrderId = table.Column<int>(type: "int", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileSelf = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    FileSizeKb = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ExportDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExportStatus = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MediaFiles", x => x.MediaFileId);
                    table.ForeignKey(
                        name: "FK_MediaFiles_SystemOrders_SystemOrderId",
                        column: x => x.SystemOrderId,
                        principalTable: "SystemOrders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderPayments",
                columns: table => new
                {
                    OrderId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PaymentId = table.Column<int>(type: "int", nullable: false),
                    OrderPaymentStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OrderId1 = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderPayments", x => x.OrderId);
                    table.ForeignKey(
                        name: "FK_OrderPayments_Payments_PaymentId",
                        column: x => x.PaymentId,
                        principalTable: "Payments",
                        principalColumn: "PaymentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderPayments_SystemOrders_OrderId1",
                        column: x => x.OrderId1,
                        principalTable: "SystemOrders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StockItems",
                columns: table => new
                {
                    StockId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    StockId1 = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockItems", x => x.StockId);
                    table.ForeignKey(
                        name: "FK_StockItems_Stocks_StockId1",
                        column: x => x.StockId1,
                        principalTable: "Stocks",
                        principalColumn: "StockId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StockItems_SystemOrders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "SystemOrders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SystemOrderTeethShade",
                columns: table => new
                {
                    SystemOrdersOrderId = table.Column<int>(type: "int", nullable: false),
                    TeethShadesTeethShadeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemOrderTeethShade", x => new { x.SystemOrdersOrderId, x.TeethShadesTeethShadeId });
                    table.ForeignKey(
                        name: "FK_SystemOrderTeethShade_SystemOrders_SystemOrdersOrderId",
                        column: x => x.SystemOrdersOrderId,
                        principalTable: "SystemOrders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SystemOrderTeethShade_TeethShades_TeethShadesTeethShadeId",
                        column: x => x.TeethShadesTeethShadeId,
                        principalTable: "TeethShades",
                        principalColumn: "TeethShadeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_CalanderScheduleEvents_CalanderId",
                table: "CalanderScheduleEvents",
                column: "CalanderId");

            migrationBuilder.CreateIndex(
                name: "IX_DecisionLogs_SystemOrderId",
                table: "DecisionLogs",
                column: "SystemOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Deliveries_DeliveryStatusId",
                table: "Deliveries",
                column: "DeliveryStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Deliveries_EmployeeId",
                table: "Deliveries",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Deliveries_SystemOrderId",
                table: "Deliveries",
                column: "SystemOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Discounts_SystemOrderId",
                table: "Discounts",
                column: "SystemOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeEmployeeDailyHours_EmployeesEmployeeId",
                table: "EmployeeEmployeeDailyHours",
                column: "EmployeesEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_JobTitleId",
                table: "Employees",
                column: "JobTitleId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_SystemUserId1",
                table: "Employees",
                column: "SystemUserId1");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeSystemOrder_SystemOrdersOrderId",
                table: "EmployeeSystemOrder",
                column: "SystemOrdersOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_MediaFiles_SystemOrderId",
                table: "MediaFiles",
                column: "SystemOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDirections_OrderDirectionStateId",
                table: "OrderDirections",
                column: "OrderDirectionStateId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderPayments_OrderId1",
                table: "OrderPayments",
                column: "OrderId1");

            migrationBuilder.CreateIndex(
                name: "IX_OrderPayments_PaymentId",
                table: "OrderPayments",
                column: "PaymentId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderWorkflowTimelines_OrderDirectionId",
                table: "OrderWorkflowTimelines",
                column: "OrderDirectionId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderWorkflowTimelines_TimelineId",
                table: "OrderWorkflowTimelines",
                column: "TimelineId");

            migrationBuilder.CreateIndex(
                name: "IX_PasswordManagements_ActionTypeId",
                table: "PasswordManagements",
                column: "ActionTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PasswordManagementSystemUser_UserId",
                table: "PasswordManagementSystemUser",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_DentistId",
                table: "Patients",
                column: "DentistId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_MedicalAidId",
                table: "Patients",
                column: "MedicalAidId");

            migrationBuilder.CreateIndex(
                name: "IX_ProceduralTimelines_CalanderId",
                table: "ProceduralTimelines",
                column: "CalanderId");

            migrationBuilder.CreateIndex(
                name: "IX_RefundPayments_PaymentId",
                table: "RefundPayments",
                column: "PaymentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StakeWriteOffs_StockId",
                table: "StakeWriteOffs",
                column: "StockId");

            migrationBuilder.CreateIndex(
                name: "IX_StockItems_OrderId",
                table: "StockItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_StockItems_StockId1",
                table: "StockItems",
                column: "StockId1");

            migrationBuilder.CreateIndex(
                name: "IX_Stocks_StockCategoryId",
                table: "Stocks",
                column: "StockCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Stocks_SupplierId",
                table: "Stocks",
                column: "SupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_SystemOrders_DentistId",
                table: "SystemOrders",
                column: "DentistId");

            migrationBuilder.CreateIndex(
                name: "IX_SystemOrders_OpenOrderId",
                table: "SystemOrders",
                column: "OpenOrderId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SystemOrders_OrderStatusId",
                table: "SystemOrders",
                column: "OrderStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_SystemOrders_OrderTypeId",
                table: "SystemOrders",
                column: "OrderTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_SystemOrders_OrderWorkflowTimelineId",
                table: "SystemOrders",
                column: "OrderWorkflowTimelineId",
                unique: true,
                filter: "[OrderWorkflowTimelineId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_SystemOrderTeethShade_TeethShadesTeethShadeId",
                table: "SystemOrderTeethShade",
                column: "TeethShadesTeethShadeId");

            migrationBuilder.CreateIndex(
                name: "IX_UserActions_UserId1",
                table: "UserActions",
                column: "UserId1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "CalanderScheduleEvents");

            migrationBuilder.DropTable(
                name: "DecisionLogs");

            migrationBuilder.DropTable(
                name: "Deliveries");

            migrationBuilder.DropTable(
                name: "Discounts");

            migrationBuilder.DropTable(
                name: "EmployeeEmployeeDailyHours");

            migrationBuilder.DropTable(
                name: "EmployeeSystemOrder");

            migrationBuilder.DropTable(
                name: "MediaFiles");

            migrationBuilder.DropTable(
                name: "OrderPayments");

            migrationBuilder.DropTable(
                name: "PasswordManagementSystemUser");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "RefundPayments");

            migrationBuilder.DropTable(
                name: "StakeWriteOffs");

            migrationBuilder.DropTable(
                name: "StockItems");

            migrationBuilder.DropTable(
                name: "SystemOrderTeethShade");

            migrationBuilder.DropTable(
                name: "UserActions");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "DeliveryStatuses");

            migrationBuilder.DropTable(
                name: "EmployeeDailyHours");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "PasswordManagements");

            migrationBuilder.DropTable(
                name: "MedicalAids");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "Stocks");

            migrationBuilder.DropTable(
                name: "SystemOrders");

            migrationBuilder.DropTable(
                name: "TeethShades");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "JobTitles");

            migrationBuilder.DropTable(
                name: "ActionTypes");

            migrationBuilder.DropTable(
                name: "StockCategories");

            migrationBuilder.DropTable(
                name: "Suppliers");

            migrationBuilder.DropTable(
                name: "Dentists");

            migrationBuilder.DropTable(
                name: "OpenOrders");

            migrationBuilder.DropTable(
                name: "OrderStatuses");

            migrationBuilder.DropTable(
                name: "OrderTypes");

            migrationBuilder.DropTable(
                name: "OrderWorkflowTimelines");

            migrationBuilder.DropTable(
                name: "OrderDirections");

            migrationBuilder.DropTable(
                name: "ProceduralTimelines");

            migrationBuilder.DropTable(
                name: "OrderDirectionStates");

            migrationBuilder.DropTable(
                name: "Calanders");
        }
    }
}
