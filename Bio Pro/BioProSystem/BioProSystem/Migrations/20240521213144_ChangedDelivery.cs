using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class ChangedDelivery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Deliveries_DeliveryStatuses_DeliveryStatusId1",
                table: "Deliveries");

            migrationBuilder.DropForeignKey(
                name: "FK_Deliveries_Employees_EmployeeId1",
                table: "Deliveries");

            migrationBuilder.DropIndex(
                name: "IX_Deliveries_DeliveryStatusId1",
                table: "Deliveries");

            migrationBuilder.DropIndex(
                name: "IX_Deliveries_EmployeeId1",
                table: "Deliveries");

            migrationBuilder.DropColumn(
                name: "DeliveryStatusId1",
                table: "Deliveries");

            migrationBuilder.DropColumn(
                name: "EmployeeId1",
                table: "Deliveries");

            migrationBuilder.AlterColumn<int>(
                name: "EmployeeId",
                table: "Deliveries",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "DeliveryStatusId",
                table: "Deliveries",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Deliveries_DeliveryStatusId",
                table: "Deliveries",
                column: "DeliveryStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Deliveries_EmployeeId",
                table: "Deliveries",
                column: "EmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Deliveries_DeliveryStatuses_DeliveryStatusId",
                table: "Deliveries",
                column: "DeliveryStatusId",
                principalTable: "DeliveryStatuses",
                principalColumn: "DeliveryStatusId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Deliveries_Employees_EmployeeId",
                table: "Deliveries",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "EmployeeId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Deliveries_DeliveryStatuses_DeliveryStatusId",
                table: "Deliveries");

            migrationBuilder.DropForeignKey(
                name: "FK_Deliveries_Employees_EmployeeId",
                table: "Deliveries");

            migrationBuilder.DropIndex(
                name: "IX_Deliveries_DeliveryStatusId",
                table: "Deliveries");

            migrationBuilder.DropIndex(
                name: "IX_Deliveries_EmployeeId",
                table: "Deliveries");

            migrationBuilder.AlterColumn<string>(
                name: "EmployeeId",
                table: "Deliveries",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "DeliveryStatusId",
                table: "Deliveries",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "DeliveryStatusId1",
                table: "Deliveries",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EmployeeId1",
                table: "Deliveries",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Deliveries_DeliveryStatusId1",
                table: "Deliveries",
                column: "DeliveryStatusId1");

            migrationBuilder.CreateIndex(
                name: "IX_Deliveries_EmployeeId1",
                table: "Deliveries",
                column: "EmployeeId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Deliveries_DeliveryStatuses_DeliveryStatusId1",
                table: "Deliveries",
                column: "DeliveryStatusId1",
                principalTable: "DeliveryStatuses",
                principalColumn: "DeliveryStatusId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Deliveries_Employees_EmployeeId1",
                table: "Deliveries",
                column: "EmployeeId1",
                principalTable: "Employees",
                principalColumn: "EmployeeId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
