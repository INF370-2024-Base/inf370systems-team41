using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class employee1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Employees_AspNetUsers_SystemUserId1",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_Employees_SystemUserId1",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "SystemUserId1",
                table: "Employees");

            migrationBuilder.AlterColumn<string>(
                name: "SystemUserId",
                table: "Employees",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_SystemUserId",
                table: "Employees",
                column: "SystemUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_AspNetUsers_SystemUserId",
                table: "Employees",
                column: "SystemUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Employees_AspNetUsers_SystemUserId",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_Employees_SystemUserId",
                table: "Employees");

            migrationBuilder.AlterColumn<int>(
                name: "SystemUserId",
                table: "Employees",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "SystemUserId1",
                table: "Employees",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employees_SystemUserId1",
                table: "Employees",
                column: "SystemUserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_AspNetUsers_SystemUserId1",
                table: "Employees",
                column: "SystemUserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
