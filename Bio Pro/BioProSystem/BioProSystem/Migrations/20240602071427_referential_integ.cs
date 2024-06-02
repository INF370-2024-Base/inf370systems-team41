using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioProSystem.Migrations
{
    /// <inheritdoc />
    public partial class referential_integ : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                table: "AspNetRoleClaims");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                table: "AspNetUserClaims");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                table: "AspNetUserLogins");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                table: "AspNetUserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                table: "AspNetUserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                table: "AspNetUserTokens");

            migrationBuilder.DropForeignKey(
                name: "FK_CalanderScheduleEvents_Calanders_CalanderId1",
                table: "CalanderScheduleEvents");

            migrationBuilder.DropForeignKey(
                name: "FK_DecisionLogs_SystemOrders_SystemOrderId",
                table: "DecisionLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_Deliveries_Employees_EmployeeId",
                table: "Deliveries");

            migrationBuilder.DropForeignKey(
                name: "FK_Deliveries_SystemOrders_SystemOrderId",
                table: "Deliveries");

            migrationBuilder.DropForeignKey(
                name: "FK_Discounts_SystemOrders_SystemOrderId",
                table: "Discounts");

            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeEmployeeDailyHours_EmployeeDailyHours_EmployeeDailyHoursId",
                table: "EmployeeEmployeeDailyHours");

            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeEmployeeDailyHours_Employees_EmployeesEmployeeId",
                table: "EmployeeEmployeeDailyHours");

            migrationBuilder.DropForeignKey(
                name: "FK_Employees_JobTitles_JobTitleId",
                table: "Employees");

            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeSystemOrder_Employees_EmployeesEmployeeId",
                table: "EmployeeSystemOrder");

            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeSystemOrder_SystemOrders_SystemOrdersOrderId",
                table: "EmployeeSystemOrder");

            migrationBuilder.DropForeignKey(
                name: "FK_MediaFiles_SystemOrders_SystemOrderId",
                table: "MediaFiles");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderDirectionStates_JobTitles_JobTitleId",
                table: "OrderDirectionStates");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderDirectionStates_OrderDirections_OrderDirectionsId",
                table: "OrderDirectionStates");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderPayments_Payments_PaymentId",
                table: "OrderPayments");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderPayments_SystemOrders_OrderId1",
                table: "OrderPayments");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderWorkflowTimelines_OrderDirections_OrderDirectionId",
                table: "OrderWorkflowTimelines");

            migrationBuilder.DropForeignKey(
                name: "FK_PasswordManagements_ActionTypes_ActionTypeId",
                table: "PasswordManagements");

            migrationBuilder.DropForeignKey(
                name: "FK_PasswordManagementSystemUser_AspNetUsers_UserId",
                table: "PasswordManagementSystemUser");

            migrationBuilder.DropForeignKey(
                name: "FK_PasswordManagementSystemUser_PasswordManagements_ManagementId",
                table: "PasswordManagementSystemUser");

            migrationBuilder.DropForeignKey(
                name: "FK_Patients_Dentists_DentistId",
                table: "Patients");

            migrationBuilder.DropForeignKey(
                name: "FK_Patients_MedicalAids_MedicalAidId",
                table: "Patients");

            migrationBuilder.DropForeignKey(
                name: "FK_ProceduralTimelines_Calanders_CalanderId",
                table: "ProceduralTimelines");

            migrationBuilder.DropForeignKey(
                name: "FK_RefundPayments_Payments_PaymentId",
                table: "RefundPayments");

            migrationBuilder.DropForeignKey(
                name: "FK_SelectedAreaSystemOrder_SelectedAreas_SelectedAreasSelectedAreaId",
                table: "SelectedAreaSystemOrder");

            migrationBuilder.DropForeignKey(
                name: "FK_SelectedAreaSystemOrder_SystemOrders_SystemOrdersOrderId",
                table: "SelectedAreaSystemOrder");

            migrationBuilder.DropForeignKey(
                name: "FK_StakeWriteOffs_Stocks_StockId",
                table: "StakeWriteOffs");

            migrationBuilder.DropForeignKey(
                name: "FK_StockItems_Stocks_StockId1",
                table: "StockItems");

            migrationBuilder.DropForeignKey(
                name: "FK_StockItems_SystemOrders_OrderId1",
                table: "StockItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Stocks_StockCategories_StockCategoryId",
                table: "Stocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Stocks_Suppliers_SupplierId",
                table: "Stocks");

            migrationBuilder.DropForeignKey(
                name: "FK_SystemOrders_Dentists_DentistId",
                table: "SystemOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_SystemOrders_OrderStatuses_OrderStatusId",
                table: "SystemOrders");

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
                name: "FK_SystemOrderTeethShade_SystemOrders_SystemOrdersOrderId",
                table: "SystemOrderTeethShade");

            migrationBuilder.DropForeignKey(
                name: "FK_SystemOrderTeethShade_TeethShades_TeethShadesTeethShadeId",
                table: "SystemOrderTeethShade");

            migrationBuilder.DropForeignKey(
                name: "FK_UserActions_AspNetUsers_UserId",
                table: "UserActions");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId",
                principalTable: "AspNetRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                table: "AspNetUserClaims",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                table: "AspNetUserLogins",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId",
                principalTable: "AspNetRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                table: "AspNetUserRoles",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                table: "AspNetUserTokens",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CalanderScheduleEvents_Calanders_CalanderId1",
                table: "CalanderScheduleEvents",
                column: "CalanderId1",
                principalTable: "Calanders",
                principalColumn: "CalanderId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DecisionLogs_SystemOrders_SystemOrderId",
                table: "DecisionLogs",
                column: "SystemOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Deliveries_Employees_EmployeeId",
                table: "Deliveries",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "EmployeeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Deliveries_SystemOrders_SystemOrderId",
                table: "Deliveries",
                column: "SystemOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Discounts_SystemOrders_SystemOrderId",
                table: "Discounts",
                column: "SystemOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeEmployeeDailyHours_EmployeeDailyHours_EmployeeDailyHoursId",
                table: "EmployeeEmployeeDailyHours",
                column: "EmployeeDailyHoursId",
                principalTable: "EmployeeDailyHours",
                principalColumn: "EmployeeDailyHoursId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeEmployeeDailyHours_Employees_EmployeesEmployeeId",
                table: "EmployeeEmployeeDailyHours",
                column: "EmployeesEmployeeId",
                principalTable: "Employees",
                principalColumn: "EmployeeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_JobTitles_JobTitleId",
                table: "Employees",
                column: "JobTitleId",
                principalTable: "JobTitles",
                principalColumn: "JobTitleId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeSystemOrder_Employees_EmployeesEmployeeId",
                table: "EmployeeSystemOrder",
                column: "EmployeesEmployeeId",
                principalTable: "Employees",
                principalColumn: "EmployeeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeSystemOrder_SystemOrders_SystemOrdersOrderId",
                table: "EmployeeSystemOrder",
                column: "SystemOrdersOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MediaFiles_SystemOrders_SystemOrderId",
                table: "MediaFiles",
                column: "SystemOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDirectionStates_JobTitles_JobTitleId",
                table: "OrderDirectionStates",
                column: "JobTitleId",
                principalTable: "JobTitles",
                principalColumn: "JobTitleId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDirectionStates_OrderDirections_OrderDirectionsId",
                table: "OrderDirectionStates",
                column: "OrderDirectionsId",
                principalTable: "OrderDirections",
                principalColumn: "OrderDirectionId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderPayments_Payments_PaymentId",
                table: "OrderPayments",
                column: "PaymentId",
                principalTable: "Payments",
                principalColumn: "PaymentId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderPayments_SystemOrders_OrderId1",
                table: "OrderPayments",
                column: "OrderId1",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderWorkflowTimelines_OrderDirections_OrderDirectionId",
                table: "OrderWorkflowTimelines",
                column: "OrderDirectionId",
                principalTable: "OrderDirections",
                principalColumn: "OrderDirectionId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PasswordManagements_ActionTypes_ActionTypeId",
                table: "PasswordManagements",
                column: "ActionTypeId",
                principalTable: "ActionTypes",
                principalColumn: "ActionTypeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PasswordManagementSystemUser_AspNetUsers_UserId",
                table: "PasswordManagementSystemUser",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PasswordManagementSystemUser_PasswordManagements_ManagementId",
                table: "PasswordManagementSystemUser",
                column: "ManagementId",
                principalTable: "PasswordManagements",
                principalColumn: "ManagementId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Patients_Dentists_DentistId",
                table: "Patients",
                column: "DentistId",
                principalTable: "Dentists",
                principalColumn: "DentistId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Patients_MedicalAids_MedicalAidId",
                table: "Patients",
                column: "MedicalAidId",
                principalTable: "MedicalAids",
                principalColumn: "MedicalAidId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProceduralTimelines_Calanders_CalanderId",
                table: "ProceduralTimelines",
                column: "CalanderId",
                principalTable: "Calanders",
                principalColumn: "CalanderId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RefundPayments_Payments_PaymentId",
                table: "RefundPayments",
                column: "PaymentId",
                principalTable: "Payments",
                principalColumn: "PaymentId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SelectedAreaSystemOrder_SelectedAreas_SelectedAreasSelectedAreaId",
                table: "SelectedAreaSystemOrder",
                column: "SelectedAreasSelectedAreaId",
                principalTable: "SelectedAreas",
                principalColumn: "SelectedAreaId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SelectedAreaSystemOrder_SystemOrders_SystemOrdersOrderId",
                table: "SelectedAreaSystemOrder",
                column: "SystemOrdersOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StakeWriteOffs_Stocks_StockId",
                table: "StakeWriteOffs",
                column: "StockId",
                principalTable: "Stocks",
                principalColumn: "StockId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StockItems_Stocks_StockId1",
                table: "StockItems",
                column: "StockId1",
                principalTable: "Stocks",
                principalColumn: "StockId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StockItems_SystemOrders_OrderId1",
                table: "StockItems",
                column: "OrderId1",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Stocks_StockCategories_StockCategoryId",
                table: "Stocks",
                column: "StockCategoryId",
                principalTable: "StockCategories",
                principalColumn: "StockCategoryId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Stocks_Suppliers_SupplierId",
                table: "Stocks",
                column: "SupplierId",
                principalTable: "Suppliers",
                principalColumn: "SupplierId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrders_Dentists_DentistId",
                table: "SystemOrders",
                column: "DentistId",
                principalTable: "Dentists",
                principalColumn: "DentistId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrders_OrderStatuses_OrderStatusId",
                table: "SystemOrders",
                column: "OrderStatusId",
                principalTable: "OrderStatuses",
                principalColumn: "OrderStatusId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrders_OrderTypes_OrderTypeId",
                table: "SystemOrders",
                column: "OrderTypeId",
                principalTable: "OrderTypes",
                principalColumn: "OrderTypeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrders_OrderWorkflowTimelines_OrderWorkflowTimelineId",
                table: "SystemOrders",
                column: "OrderWorkflowTimelineId",
                principalTable: "OrderWorkflowTimelines",
                principalColumn: "WorkflowStructureId",
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
                name: "FK_SystemOrderTeethShade_SystemOrders_SystemOrdersOrderId",
                table: "SystemOrderTeethShade",
                column: "SystemOrdersOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrderTeethShade_TeethShades_TeethShadesTeethShadeId",
                table: "SystemOrderTeethShade",
                column: "TeethShadesTeethShadeId",
                principalTable: "TeethShades",
                principalColumn: "TeethShadeId",
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
                name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                table: "AspNetRoleClaims");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                table: "AspNetUserClaims");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                table: "AspNetUserLogins");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                table: "AspNetUserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                table: "AspNetUserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                table: "AspNetUserTokens");

            migrationBuilder.DropForeignKey(
                name: "FK_CalanderScheduleEvents_Calanders_CalanderId1",
                table: "CalanderScheduleEvents");

            migrationBuilder.DropForeignKey(
                name: "FK_DecisionLogs_SystemOrders_SystemOrderId",
                table: "DecisionLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_Deliveries_Employees_EmployeeId",
                table: "Deliveries");

            migrationBuilder.DropForeignKey(
                name: "FK_Deliveries_SystemOrders_SystemOrderId",
                table: "Deliveries");

            migrationBuilder.DropForeignKey(
                name: "FK_Discounts_SystemOrders_SystemOrderId",
                table: "Discounts");

            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeEmployeeDailyHours_EmployeeDailyHours_EmployeeDailyHoursId",
                table: "EmployeeEmployeeDailyHours");

            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeEmployeeDailyHours_Employees_EmployeesEmployeeId",
                table: "EmployeeEmployeeDailyHours");

            migrationBuilder.DropForeignKey(
                name: "FK_Employees_JobTitles_JobTitleId",
                table: "Employees");

            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeSystemOrder_Employees_EmployeesEmployeeId",
                table: "EmployeeSystemOrder");

            migrationBuilder.DropForeignKey(
                name: "FK_EmployeeSystemOrder_SystemOrders_SystemOrdersOrderId",
                table: "EmployeeSystemOrder");

            migrationBuilder.DropForeignKey(
                name: "FK_MediaFiles_SystemOrders_SystemOrderId",
                table: "MediaFiles");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderDirectionStates_JobTitles_JobTitleId",
                table: "OrderDirectionStates");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderDirectionStates_OrderDirections_OrderDirectionsId",
                table: "OrderDirectionStates");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderPayments_Payments_PaymentId",
                table: "OrderPayments");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderPayments_SystemOrders_OrderId1",
                table: "OrderPayments");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderWorkflowTimelines_OrderDirections_OrderDirectionId",
                table: "OrderWorkflowTimelines");

            migrationBuilder.DropForeignKey(
                name: "FK_PasswordManagements_ActionTypes_ActionTypeId",
                table: "PasswordManagements");

            migrationBuilder.DropForeignKey(
                name: "FK_PasswordManagementSystemUser_AspNetUsers_UserId",
                table: "PasswordManagementSystemUser");

            migrationBuilder.DropForeignKey(
                name: "FK_PasswordManagementSystemUser_PasswordManagements_ManagementId",
                table: "PasswordManagementSystemUser");

            migrationBuilder.DropForeignKey(
                name: "FK_Patients_Dentists_DentistId",
                table: "Patients");

            migrationBuilder.DropForeignKey(
                name: "FK_Patients_MedicalAids_MedicalAidId",
                table: "Patients");

            migrationBuilder.DropForeignKey(
                name: "FK_ProceduralTimelines_Calanders_CalanderId",
                table: "ProceduralTimelines");

            migrationBuilder.DropForeignKey(
                name: "FK_RefundPayments_Payments_PaymentId",
                table: "RefundPayments");

            migrationBuilder.DropForeignKey(
                name: "FK_SelectedAreaSystemOrder_SelectedAreas_SelectedAreasSelectedAreaId",
                table: "SelectedAreaSystemOrder");

            migrationBuilder.DropForeignKey(
                name: "FK_SelectedAreaSystemOrder_SystemOrders_SystemOrdersOrderId",
                table: "SelectedAreaSystemOrder");

            migrationBuilder.DropForeignKey(
                name: "FK_StakeWriteOffs_Stocks_StockId",
                table: "StakeWriteOffs");

            migrationBuilder.DropForeignKey(
                name: "FK_StockItems_Stocks_StockId1",
                table: "StockItems");

            migrationBuilder.DropForeignKey(
                name: "FK_StockItems_SystemOrders_OrderId1",
                table: "StockItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Stocks_StockCategories_StockCategoryId",
                table: "Stocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Stocks_Suppliers_SupplierId",
                table: "Stocks");

            migrationBuilder.DropForeignKey(
                name: "FK_SystemOrders_Dentists_DentistId",
                table: "SystemOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_SystemOrders_OrderStatuses_OrderStatusId",
                table: "SystemOrders");

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
                name: "FK_SystemOrderTeethShade_SystemOrders_SystemOrdersOrderId",
                table: "SystemOrderTeethShade");

            migrationBuilder.DropForeignKey(
                name: "FK_SystemOrderTeethShade_TeethShades_TeethShadesTeethShadeId",
                table: "SystemOrderTeethShade");

            migrationBuilder.DropForeignKey(
                name: "FK_UserActions_AspNetUsers_UserId",
                table: "UserActions");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId",
                principalTable: "AspNetRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                table: "AspNetUserClaims",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                table: "AspNetUserLogins",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId",
                principalTable: "AspNetRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                table: "AspNetUserRoles",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                table: "AspNetUserTokens",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_CalanderScheduleEvents_Calanders_CalanderId1",
                table: "CalanderScheduleEvents",
                column: "CalanderId1",
                principalTable: "Calanders",
                principalColumn: "CalanderId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_DecisionLogs_SystemOrders_SystemOrderId",
                table: "DecisionLogs",
                column: "SystemOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Deliveries_Employees_EmployeeId",
                table: "Deliveries",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "EmployeeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Deliveries_SystemOrders_SystemOrderId",
                table: "Deliveries",
                column: "SystemOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Discounts_SystemOrders_SystemOrderId",
                table: "Discounts",
                column: "SystemOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeEmployeeDailyHours_EmployeeDailyHours_EmployeeDailyHoursId",
                table: "EmployeeEmployeeDailyHours",
                column: "EmployeeDailyHoursId",
                principalTable: "EmployeeDailyHours",
                principalColumn: "EmployeeDailyHoursId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeEmployeeDailyHours_Employees_EmployeesEmployeeId",
                table: "EmployeeEmployeeDailyHours",
                column: "EmployeesEmployeeId",
                principalTable: "Employees",
                principalColumn: "EmployeeId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_JobTitles_JobTitleId",
                table: "Employees",
                column: "JobTitleId",
                principalTable: "JobTitles",
                principalColumn: "JobTitleId");

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeSystemOrder_Employees_EmployeesEmployeeId",
                table: "EmployeeSystemOrder",
                column: "EmployeesEmployeeId",
                principalTable: "Employees",
                principalColumn: "EmployeeId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeeSystemOrder_SystemOrders_SystemOrdersOrderId",
                table: "EmployeeSystemOrder",
                column: "SystemOrdersOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_MediaFiles_SystemOrders_SystemOrderId",
                table: "MediaFiles",
                column: "SystemOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDirectionStates_JobTitles_JobTitleId",
                table: "OrderDirectionStates",
                column: "JobTitleId",
                principalTable: "JobTitles",
                principalColumn: "JobTitleId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDirectionStates_OrderDirections_OrderDirectionsId",
                table: "OrderDirectionStates",
                column: "OrderDirectionsId",
                principalTable: "OrderDirections",
                principalColumn: "OrderDirectionId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderPayments_Payments_PaymentId",
                table: "OrderPayments",
                column: "PaymentId",
                principalTable: "Payments",
                principalColumn: "PaymentId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderPayments_SystemOrders_OrderId1",
                table: "OrderPayments",
                column: "OrderId1",
                principalTable: "SystemOrders",
                principalColumn: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderWorkflowTimelines_OrderDirections_OrderDirectionId",
                table: "OrderWorkflowTimelines",
                column: "OrderDirectionId",
                principalTable: "OrderDirections",
                principalColumn: "OrderDirectionId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_PasswordManagements_ActionTypes_ActionTypeId",
                table: "PasswordManagements",
                column: "ActionTypeId",
                principalTable: "ActionTypes",
                principalColumn: "ActionTypeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PasswordManagementSystemUser_AspNetUsers_UserId",
                table: "PasswordManagementSystemUser",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_PasswordManagementSystemUser_PasswordManagements_ManagementId",
                table: "PasswordManagementSystemUser",
                column: "ManagementId",
                principalTable: "PasswordManagements",
                principalColumn: "ManagementId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Patients_Dentists_DentistId",
                table: "Patients",
                column: "DentistId",
                principalTable: "Dentists",
                principalColumn: "DentistId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Patients_MedicalAids_MedicalAidId",
                table: "Patients",
                column: "MedicalAidId",
                principalTable: "MedicalAids",
                principalColumn: "MedicalAidId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProceduralTimelines_Calanders_CalanderId",
                table: "ProceduralTimelines",
                column: "CalanderId",
                principalTable: "Calanders",
                principalColumn: "CalanderId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RefundPayments_Payments_PaymentId",
                table: "RefundPayments",
                column: "PaymentId",
                principalTable: "Payments",
                principalColumn: "PaymentId");

            migrationBuilder.AddForeignKey(
                name: "FK_SelectedAreaSystemOrder_SelectedAreas_SelectedAreasSelectedAreaId",
                table: "SelectedAreaSystemOrder",
                column: "SelectedAreasSelectedAreaId",
                principalTable: "SelectedAreas",
                principalColumn: "SelectedAreaId");

            migrationBuilder.AddForeignKey(
                name: "FK_SelectedAreaSystemOrder_SystemOrders_SystemOrdersOrderId",
                table: "SelectedAreaSystemOrder",
                column: "SystemOrdersOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_StakeWriteOffs_Stocks_StockId",
                table: "StakeWriteOffs",
                column: "StockId",
                principalTable: "Stocks",
                principalColumn: "StockId");

            migrationBuilder.AddForeignKey(
                name: "FK_StockItems_Stocks_StockId1",
                table: "StockItems",
                column: "StockId1",
                principalTable: "Stocks",
                principalColumn: "StockId");

            migrationBuilder.AddForeignKey(
                name: "FK_StockItems_SystemOrders_OrderId1",
                table: "StockItems",
                column: "OrderId1",
                principalTable: "SystemOrders",
                principalColumn: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Stocks_StockCategories_StockCategoryId",
                table: "Stocks",
                column: "StockCategoryId",
                principalTable: "StockCategories",
                principalColumn: "StockCategoryId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Stocks_Suppliers_SupplierId",
                table: "Stocks",
                column: "SupplierId",
                principalTable: "Suppliers",
                principalColumn: "SupplierId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrders_Dentists_DentistId",
                table: "SystemOrders",
                column: "DentistId",
                principalTable: "Dentists",
                principalColumn: "DentistId");

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrders_OrderStatuses_OrderStatusId",
                table: "SystemOrders",
                column: "OrderStatusId",
                principalTable: "OrderStatuses",
                principalColumn: "OrderStatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrders_OrderTypes_OrderTypeId",
                table: "SystemOrders",
                column: "OrderTypeId",
                principalTable: "OrderTypes",
                principalColumn: "OrderTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrders_OrderWorkflowTimelines_OrderWorkflowTimelineId",
                table: "SystemOrders",
                column: "OrderWorkflowTimelineId",
                principalTable: "OrderWorkflowTimelines",
                principalColumn: "WorkflowStructureId");

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrderSteps_Employees_EmployeeId",
                table: "SystemOrderSteps",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "EmployeeId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrderSteps_SystemOrders_SystemOrderId",
                table: "SystemOrderSteps",
                column: "SystemOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrderTeethShade_SystemOrders_SystemOrdersOrderId",
                table: "SystemOrderTeethShade",
                column: "SystemOrdersOrderId",
                principalTable: "SystemOrders",
                principalColumn: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_SystemOrderTeethShade_TeethShades_TeethShadesTeethShadeId",
                table: "SystemOrderTeethShade",
                column: "TeethShadesTeethShadeId",
                principalTable: "TeethShades",
                principalColumn: "TeethShadeId");

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
