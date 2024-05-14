using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class updatedSystemOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderDirectionMaincategory",
                table: "SystemOrders");

            migrationBuilder.DropColumn(
                name: "OrderDirectionSubcategory",
                table: "SystemOrders");

            migrationBuilder.AlterColumn<string>(
                name: "SystemOrderId",
                table: "OrderWorkflowTimelines",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OrderDirectionMaincategory",
                table: "SystemOrders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OrderDirectionSubcategory",
                table: "SystemOrders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "SystemOrderId",
                table: "OrderWorkflowTimelines",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
