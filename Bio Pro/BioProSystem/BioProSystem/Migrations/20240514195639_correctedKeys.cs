using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class correctedKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderDirectionStates_OrderDirections_OrderDirectionsOrderDirectionId",
                table: "OrderDirectionStates");

            migrationBuilder.DropColumn(
                name: "OrderDirectionStateId",
                table: "OrderDirections");

            migrationBuilder.RenameColumn(
                name: "OrderDirectionsOrderDirectionId",
                table: "OrderDirectionStates",
                newName: "OrderDirectionsId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderDirectionStates_OrderDirectionsOrderDirectionId",
                table: "OrderDirectionStates",
                newName: "IX_OrderDirectionStates_OrderDirectionsId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDirectionStates_OrderDirections_OrderDirectionsId",
                table: "OrderDirectionStates",
                column: "OrderDirectionsId",
                principalTable: "OrderDirections",
                principalColumn: "OrderDirectionId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderDirectionStates_OrderDirections_OrderDirectionsId",
                table: "OrderDirectionStates");

            migrationBuilder.RenameColumn(
                name: "OrderDirectionsId",
                table: "OrderDirectionStates",
                newName: "OrderDirectionsOrderDirectionId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderDirectionStates_OrderDirectionsId",
                table: "OrderDirectionStates",
                newName: "IX_OrderDirectionStates_OrderDirectionsOrderDirectionId");

            migrationBuilder.AddColumn<int>(
                name: "OrderDirectionStateId",
                table: "OrderDirections",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDirectionStates_OrderDirections_OrderDirectionsOrderDirectionId",
                table: "OrderDirectionStates",
                column: "OrderDirectionsOrderDirectionId",
                principalTable: "OrderDirections",
                principalColumn: "OrderDirectionId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
