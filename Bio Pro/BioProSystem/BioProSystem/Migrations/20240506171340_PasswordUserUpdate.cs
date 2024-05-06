using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class PasswordUserUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PasswordManagementSystemUser_AspNetUsers_PasswordsId",
                table: "PasswordManagementSystemUser");

            migrationBuilder.RenameColumn(
                name: "PasswordsId",
                table: "PasswordManagementSystemUser",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_PasswordManagementSystemUser_PasswordsId",
                table: "PasswordManagementSystemUser",
                newName: "IX_PasswordManagementSystemUser_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_PasswordManagementSystemUser_AspNetUsers_UserId",
                table: "PasswordManagementSystemUser",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PasswordManagementSystemUser_AspNetUsers_UserId",
                table: "PasswordManagementSystemUser");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "PasswordManagementSystemUser",
                newName: "PasswordsId");

            migrationBuilder.RenameIndex(
                name: "IX_PasswordManagementSystemUser_UserId",
                table: "PasswordManagementSystemUser",
                newName: "IX_PasswordManagementSystemUser_PasswordsId");

            migrationBuilder.AddForeignKey(
                name: "FK_PasswordManagementSystemUser_AspNetUsers_PasswordsId",
                table: "PasswordManagementSystemUser",
                column: "PasswordsId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
