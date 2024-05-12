using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class OptionalSystemOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SystemOrders_OpenOrders_OpenOrderId",
                table: "SystemOrders");

            migrationBuilder.DropIndex(
                name: "IX_SystemOrders_OpenOrderId",
                table: "SystemOrders");

            migrationBuilder.AlterColumn<decimal>(
                name: "TotalAmountDue",
                table: "SystemOrders",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<int>(
                name: "OpenOrderId",
                table: "SystemOrders",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_SystemOrders_OpenOrderId",
                table: "SystemOrders",
                column: "OpenOrderId",
                unique: true,
                filter: "[OpenOrderId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrders_OpenOrders_OpenOrderId",
                table: "SystemOrders",
                column: "OpenOrderId",
                principalTable: "OpenOrders",
                principalColumn: "OpenOrderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SystemOrders_OpenOrders_OpenOrderId",
                table: "SystemOrders");

            migrationBuilder.DropIndex(
                name: "IX_SystemOrders_OpenOrderId",
                table: "SystemOrders");

            migrationBuilder.AlterColumn<decimal>(
                name: "TotalAmountDue",
                table: "SystemOrders",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "OpenOrderId",
                table: "SystemOrders",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SystemOrders_OpenOrderId",
                table: "SystemOrders",
                column: "OpenOrderId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrders_OpenOrders_OpenOrderId",
                table: "SystemOrders",
                column: "OpenOrderId",
                principalTable: "OpenOrders",
                principalColumn: "OpenOrderId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
