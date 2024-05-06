using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class UpdateOne : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Passwords_PasswordId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Employees_AspNetUsers_UserId1",
                table: "Employees");

            migrationBuilder.DropTable(
                name: "Passwords");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_PasswordId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LoginEmail",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "PasswordId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "UserId1",
                table: "Employees",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "AspNetUsers",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256);

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

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_AspNetUsers_UserId1",
                table: "Employees",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_PasswordManagements_ManagementId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Employees_AspNetUsers_UserId1",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_ManagementId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ManagementId",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "UserId1",
                table: "Employees",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "AspNetUsers",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LoginEmail",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "PasswordId",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Passwords",
                columns: table => new
                {
                    PasswordId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ManagementId = table.Column<int>(type: "int", nullable: true),
                    PasswordHash = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    SecretAnswer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecretQuestion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Passwords", x => x.PasswordId);
                    table.ForeignKey(
                        name: "FK_Passwords_PasswordManagements_ManagementId",
                        column: x => x.ManagementId,
                        principalTable: "PasswordManagements",
                        principalColumn: "ManagementId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_PasswordId",
                table: "AspNetUsers",
                column: "PasswordId");

            migrationBuilder.CreateIndex(
                name: "IX_Passwords_ManagementId",
                table: "Passwords",
                column: "ManagementId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Passwords_PasswordId",
                table: "AspNetUsers",
                column: "PasswordId",
                principalTable: "Passwords",
                principalColumn: "PasswordId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_AspNetUsers_UserId1",
                table: "Employees",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
