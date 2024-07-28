using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class possibleFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderWorkflowTimelines_SystemOrders_SystemOrderId",
                table: "OrderWorkflowTimelines");

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
                name: "FK_SystemOrders_OrderWorkflowTimelines_OrderWorkflowTimelineId",
                table: "SystemOrders",
                column: "OrderWorkflowTimelineId",
                principalTable: "OrderWorkflowTimelines",
                principalColumn: "WorkflowStructureId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SystemOrders_OrderWorkflowTimelines_OrderWorkflowTimelineId",
                table: "SystemOrders");

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
                name: "FK_OrderWorkflowTimelines_SystemOrders_SystemOrderId",
                table: "OrderWorkflowTimelines",
                column: "SystemOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
