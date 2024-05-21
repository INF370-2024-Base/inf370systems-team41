using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class AddedSteps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SystemOrderSteps",
                columns: table => new
                {
                    SysteorderStepId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    SystemOrderId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemOrderSteps", x => x.SysteorderStepId);
                    table.ForeignKey(
                        name: "FK_SystemOrderSteps_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SystemOrderSteps_SystemOrders_SystemOrderId",
                        column: x => x.SystemOrderId,
                        principalTable: "SystemOrders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SystemOrderSteps_EmployeeId",
                table: "SystemOrderSteps",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_SystemOrderSteps_SystemOrderId",
                table: "SystemOrderSteps",
                column: "SystemOrderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SystemOrderSteps");
        }
    }
}
