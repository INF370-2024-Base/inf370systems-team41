using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class stocktype : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StockTypeId",
                table: "StockCategories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "StockType",
                columns: table => new
                {
                    StockTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockType", x => x.StockTypeId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StockCategories_StockTypeId",
                table: "StockCategories",
                column: "StockTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_StockCategories_StockType_StockTypeId",
                table: "StockCategories",
                column: "StockTypeId",
                principalTable: "StockType",
                principalColumn: "StockTypeId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockCategories_StockType_StockTypeId",
                table: "StockCategories");

            migrationBuilder.DropTable(
                name: "StockType");

            migrationBuilder.DropIndex(
                name: "IX_StockCategories_StockTypeId",
                table: "StockCategories");

            migrationBuilder.DropColumn(
                name: "StockTypeId",
                table: "StockCategories");
        }
    }
}
