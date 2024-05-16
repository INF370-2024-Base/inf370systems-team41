using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class addedJob_orderdirectionstate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SystemOrders_OrderWorkflowTimelines_OrderWorkflowTimelineId",
                table: "SystemOrders");

            migrationBuilder.DropIndex(
                name: "IX_SystemOrders_OrderWorkflowTimelineId",
                table: "SystemOrders");

            migrationBuilder.AlterColumn<int>(
                name: "OrderWorkflowTimelineId",
                table: "SystemOrders",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "JobTitleId",
                table: "OrderDirectionStates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_SystemOrders_OrderWorkflowTimelineId",
                table: "SystemOrders",
                column: "OrderWorkflowTimelineId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderDirectionStates_JobTitleId",
                table: "OrderDirectionStates",
                column: "JobTitleId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDirectionStates_JobTitles_JobTitleId",
                table: "OrderDirectionStates",
                column: "JobTitleId",
                principalTable: "JobTitles",
                principalColumn: "JobTitleId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrders_OrderWorkflowTimelines_OrderWorkflowTimelineId",
                table: "SystemOrders",
                column: "OrderWorkflowTimelineId",
                principalTable: "OrderWorkflowTimelines",
                principalColumn: "WorkflowStructureId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderDirectionStates_JobTitles_JobTitleId",
                table: "OrderDirectionStates");

            migrationBuilder.DropForeignKey(
                name: "FK_SystemOrders_OrderWorkflowTimelines_OrderWorkflowTimelineId",
                table: "SystemOrders");

            migrationBuilder.DropIndex(
                name: "IX_SystemOrders_OrderWorkflowTimelineId",
                table: "SystemOrders");

            migrationBuilder.DropIndex(
                name: "IX_OrderDirectionStates_JobTitleId",
                table: "OrderDirectionStates");

            migrationBuilder.DropColumn(
                name: "JobTitleId",
                table: "OrderDirectionStates");

            migrationBuilder.AlterColumn<int>(
                name: "OrderWorkflowTimelineId",
                table: "SystemOrders",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_SystemOrders_OrderWorkflowTimelineId",
                table: "SystemOrders",
                column: "OrderWorkflowTimelineId",
                unique: true,
                filter: "[OrderWorkflowTimelineId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrders_OrderWorkflowTimelines_OrderWorkflowTimelineId",
                table: "SystemOrders",
                column: "OrderWorkflowTimelineId",
                principalTable: "OrderWorkflowTimelines",
                principalColumn: "WorkflowStructureId");
        }
    }
}
