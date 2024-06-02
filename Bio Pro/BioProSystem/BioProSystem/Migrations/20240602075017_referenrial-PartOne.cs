using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class referenrialPartOne : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MediaFiles_SystemOrders_SystemOrderId",
                table: "MediaFiles");

            migrationBuilder.DropForeignKey(
                name: "FK_SystemOrders_OrderTypes_OrderTypeId",
                table: "SystemOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_SystemOrders_OrderWorkflowTimelines_OrderWorkflowTimelineId",
                table: "SystemOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_SystemOrderSteps_Employees_EmployeeId",
                table: "SystemOrderSteps");

            migrationBuilder.DropForeignKey(
                name: "FK_SystemOrderSteps_SystemOrders_SystemOrderId",
                table: "SystemOrderSteps");

            migrationBuilder.DropForeignKey(
                name: "FK_UserActions_AspNetUsers_UserId",
                table: "UserActions");

            migrationBuilder.DropIndex(
                name: "IX_SystemOrders_OrderWorkflowTimelineId",
                table: "SystemOrders");

            migrationBuilder.AlterColumn<string>(
                name: "SystemOrderId",
                table: "OrderWorkflowTimelines",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_OrderWorkflowTimelines_SystemOrderId",
                table: "OrderWorkflowTimelines",
                column: "SystemOrderId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MediaFiles_SystemOrders_SystemOrderId",
                table: "MediaFiles",
                column: "SystemOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderWorkflowTimelines_SystemOrders_SystemOrderId",
                table: "OrderWorkflowTimelines",
                column: "SystemOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrders_OrderTypes_OrderTypeId",
                table: "SystemOrders",
                column: "OrderTypeId",
                principalTable: "OrderTypes",
                principalColumn: "OrderTypeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrderSteps_Employees_EmployeeId",
                table: "SystemOrderSteps",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "EmployeeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrderSteps_SystemOrders_SystemOrderId",
                table: "SystemOrderSteps",
                column: "SystemOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserActions_AspNetUsers_UserId",
                table: "UserActions",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MediaFiles_SystemOrders_SystemOrderId",
                table: "MediaFiles");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderWorkflowTimelines_SystemOrders_SystemOrderId",
                table: "OrderWorkflowTimelines");

            migrationBuilder.DropForeignKey(
                name: "FK_SystemOrders_OrderTypes_OrderTypeId",
                table: "SystemOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_SystemOrderSteps_Employees_EmployeeId",
                table: "SystemOrderSteps");

            migrationBuilder.DropForeignKey(
                name: "FK_SystemOrderSteps_SystemOrders_SystemOrderId",
                table: "SystemOrderSteps");

            migrationBuilder.DropForeignKey(
                name: "FK_UserActions_AspNetUsers_UserId",
                table: "UserActions");

            migrationBuilder.DropIndex(
                name: "IX_OrderWorkflowTimelines_SystemOrderId",
                table: "OrderWorkflowTimelines");

            migrationBuilder.AlterColumn<string>(
                name: "SystemOrderId",
                table: "OrderWorkflowTimelines",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_SystemOrders_OrderWorkflowTimelineId",
                table: "SystemOrders",
                column: "OrderWorkflowTimelineId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MediaFiles_SystemOrders_SystemOrderId",
                table: "MediaFiles",
                column: "SystemOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrders_OrderTypes_OrderTypeId",
                table: "SystemOrders",
                column: "OrderTypeId",
                principalTable: "OrderTypes",
                principalColumn: "OrderTypeId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrders_OrderWorkflowTimelines_OrderWorkflowTimelineId",
                table: "SystemOrders",
                column: "OrderWorkflowTimelineId",
                principalTable: "OrderWorkflowTimelines",
                principalColumn: "WorkflowStructureId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrderSteps_Employees_EmployeeId",
                table: "SystemOrderSteps",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "EmployeeId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrderSteps_SystemOrders_SystemOrderId",
                table: "SystemOrderSteps",
                column: "SystemOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserActions_AspNetUsers_UserId",
                table: "UserActions",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
