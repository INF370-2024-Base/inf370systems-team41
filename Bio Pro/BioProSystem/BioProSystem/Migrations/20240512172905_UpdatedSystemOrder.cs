using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedSystemOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CellphoneNumber",
                table: "Patients");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderDirectionMaincategory",
                table: "SystemOrders");

            migrationBuilder.DropColumn(
                name: "OrderDirectionSubcategory",
                table: "SystemOrders");

            migrationBuilder.AddColumn<string>(
                name: "CellphoneNumber",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
