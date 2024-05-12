using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedMedicalAid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MedicalAidNumber",
                table: "MedicalAids");

            migrationBuilder.AddColumn<string>(
                name: "MedicalAidNumber",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MedicalAidNumber",
                table: "Patients");

            migrationBuilder.AddColumn<string>(
                name: "MedicalAidNumber",
                table: "MedicalAids",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
