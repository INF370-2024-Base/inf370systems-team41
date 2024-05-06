using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class update3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_PasswordManagements_ManagementId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_ManagementId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ManagementId",
                table: "AspNetUsers");

            migrationBuilder.CreateTable(
                name: "PasswordManagementSystemUser",
                columns: table => new
                {
                    ManagementId = table.Column<int>(type: "int", nullable: false),
                    PasswordsId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PasswordManagementSystemUser", x => new { x.ManagementId, x.PasswordsId });
                    table.ForeignKey(
                        name: "FK_PasswordManagementSystemUser_AspNetUsers_PasswordsId",
                        column: x => x.PasswordsId,
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

            migrationBuilder.CreateIndex(
                name: "IX_PasswordManagementSystemUser_PasswordsId",
                table: "PasswordManagementSystemUser",
                column: "PasswordsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PasswordManagementSystemUser");

            migrationBuilder.AddColumn<int>(
                name: "ManagementId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_ManagementId",
                table: "AspNetUsers",
                column: "ManagementId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_PasswordManagements_ManagementId",
                table: "AspNetUsers",
                column: "ManagementId",
                principalTable: "PasswordManagements",
                principalColumn: "ManagementId");
        }
    }
}
