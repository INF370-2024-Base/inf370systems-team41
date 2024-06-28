using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class calendarevents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CalanderScheduleEvents_Calanders_CalanderId1",
                table: "CalanderScheduleEvents");

            migrationBuilder.DropIndex(
                name: "IX_CalanderScheduleEvents_CalanderId1",
                table: "CalanderScheduleEvents");

            migrationBuilder.DropColumn(
                name: "CalanderId1",
                table: "CalanderScheduleEvents");

            migrationBuilder.AlterColumn<int>(
                name: "CalanderId",
                table: "CalanderScheduleEvents",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_CalanderScheduleEvents_CalanderId",
                table: "CalanderScheduleEvents",
                column: "CalanderId");

            migrationBuilder.AddForeignKey(
                name: "FK_CalanderScheduleEvents_Calanders_CalanderId",
                table: "CalanderScheduleEvents",
                column: "CalanderId",
                principalTable: "Calanders",
                principalColumn: "CalanderId",
                onDelete: ReferentialAction.Cascade);
            migrationBuilder.DropColumn(
               name: "TimelineId",
               table: "Calanders");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CalanderScheduleEvents_Calanders_CalanderId",
                table: "CalanderScheduleEvents");

            migrationBuilder.DropIndex(
                name: "IX_CalanderScheduleEvents_CalanderId",
                table: "CalanderScheduleEvents");

            migrationBuilder.AlterColumn<string>(
                name: "CalanderId",
                table: "CalanderScheduleEvents",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "CalanderId1",
                table: "CalanderScheduleEvents",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_CalanderScheduleEvents_CalanderId1",
                table: "CalanderScheduleEvents",
                column: "CalanderId1");

            migrationBuilder.AddForeignKey(
                name: "FK_CalanderScheduleEvents_Calanders_CalanderId1",
                table: "CalanderScheduleEvents",
                column: "CalanderId1",
                principalTable: "Calanders",
                principalColumn: "CalanderId",
                onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddColumn<int>(
               name: "TimelineId",
               table: "Calanders",
               type: "int",
               nullable: true);
        }
    }
}
