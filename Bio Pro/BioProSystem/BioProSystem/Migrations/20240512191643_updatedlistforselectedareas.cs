using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class updatedlistforselectedareas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SelectedAreas_SystemOrders_SystemOrdersId",
                table: "SelectedAreas");

            migrationBuilder.DropIndex(
                name: "IX_SelectedAreas_SystemOrdersId",
                table: "SelectedAreas");

            migrationBuilder.DropColumn(
                name: "SystemOrdersId",
                table: "SelectedAreas");

            migrationBuilder.CreateTable(
                name: "SelectedAreaSystemOrder",
                columns: table => new
                {
                    SelectedAreasSelectedAreaId = table.Column<int>(type: "int", nullable: false),
                    SystemOrdersOrderId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SelectedAreaSystemOrder", x => new { x.SelectedAreasSelectedAreaId, x.SystemOrdersOrderId });
                    table.ForeignKey(
                        name: "FK_SelectedAreaSystemOrder_SelectedAreas_SelectedAreasSelectedAreaId",
                        column: x => x.SelectedAreasSelectedAreaId,
                        principalTable: "SelectedAreas",
                        principalColumn: "SelectedAreaId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SelectedAreaSystemOrder_SystemOrders_SystemOrdersOrderId",
                        column: x => x.SystemOrdersOrderId,
                        principalTable: "SystemOrders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SelectedAreaSystemOrder_SystemOrdersOrderId",
                table: "SelectedAreaSystemOrder",
                column: "SystemOrdersOrderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SelectedAreaSystemOrder");

            migrationBuilder.AddColumn<string>(
                name: "SystemOrdersId",
                table: "SelectedAreas",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_SelectedAreas_SystemOrdersId",
                table: "SelectedAreas",
                column: "SystemOrdersId");

            migrationBuilder.AddForeignKey(
                name: "FK_SelectedAreas_SystemOrders_SystemOrdersId",
                table: "SelectedAreas",
                column: "SystemOrdersId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
