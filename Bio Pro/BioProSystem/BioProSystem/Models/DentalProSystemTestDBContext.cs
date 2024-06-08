using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BioProSystem.Models
    {      public class DentalProSystemTestDBContext : IdentityDbContext<SystemUser>
    {

     public DentalProSystemTestDBContext(DbContextOptions<DentalProSystemTestDBContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ActionType> ActionTypes { get; set; }

    public virtual DbSet<Calander> Calanders { get; set; }

    public virtual DbSet<CalanderScheduleEvent> CalanderScheduleEvents { get; set; }

    public virtual DbSet<DecisionLog> DecisionLogs { get; set; }

    public virtual DbSet<Delivery> Deliveries { get; set; }

    public virtual DbSet<DeliveryStatus> DeliveryStatuses { get; set; }

    public virtual DbSet<Dentist> Dentists { get; set; }

    public virtual DbSet<Discount> Discounts { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<JobTitle> JobTitles { get; set; }

    public virtual DbSet<MediaFile> MediaFiles { get; set; }

    public virtual DbSet<MedicalAid> MedicalAids { get; set; }

    public virtual DbSet<OpenOrder> OpenOrders { get; set; }

    public virtual DbSet<OrderDirection> OrderDirections { get; set; }

    public virtual DbSet<OrderDirectionState> OrderDirectionStates { get; set; }

    public virtual DbSet<OrderPayment> OrderPayments { get; set; }

    public virtual DbSet<OrderStatus> OrderStatuses { get; set; }

    public virtual DbSet<OrderType> OrderTypes { get; set; }

    public virtual DbSet<OrderWorkflowTimeline> OrderWorkflowTimelines { get; set; }

    public virtual DbSet<PasswordManagement> PasswordManagements { get; set; }

    public virtual DbSet<Patient> Patients { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<ProceduralTimeline> ProceduralTimelines { get; set; }

    public virtual DbSet<RefundPayment> RefundPayments { get; set; }

    public virtual DbSet<StakeWriteOff> StakeWriteOffs { get; set; }

    public virtual DbSet<Stock> Stocks { get; set; }

    public virtual DbSet<StockCategory> StockCategories { get; set; }

    public virtual DbSet<StockItem> StockItems { get; set; }

    public virtual DbSet<Supplier> Suppliers { get; set; }

    public virtual DbSet<SelectedArea> SelectedAreas { get; set; }

    public virtual DbSet<SystemOrder> SystemOrders { get; set; }

    public virtual DbSet<SystemUser> SystemUsers { get; set; }

        public virtual DbSet<SystemOrderSteps> SystemOrderSteps { get; set; }

        public virtual DbSet<StockType> StockTypes { get; set; }

    public virtual DbSet<TeethShade> TeethShades { get; set; }

    public virtual DbSet<UserAction> UserActions { get; set; }

    public virtual DbSet<EmployeeDailyHours> EmployeeDailyHours { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<OrderWorkflowTimeline>()
                .HasOne(owt => owt.systemOrder) 
                .WithOne(so => so.OrderWorkflowTimeline)
                .HasForeignKey<SystemOrder>(so => so.OrderWorkflowTimelineId)
                .OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<Payment>()
                .HasOne(owt => owt.RefundPayments)
                .WithOne(so => so.Payment)
                .HasForeignKey<RefundPayment>(so => so.PaymentId);
            modelBuilder.Entity<OrderWorkflowTimeline>()
                .HasOne(owt => owt.systemOrder)
                .WithOne(so => so.OrderWorkflowTimeline)
                .HasForeignKey<SystemOrder>(so => so.OrderWorkflowTimelineId)
                .OnDelete(DeleteBehavior.Restrict); ;

            modelBuilder.Entity<SystemOrderSteps>()
                .HasOne(sos => sos.SystemOrders)
                .WithMany(so => so.SystemOrderSteps)
                .HasForeignKey(sos => sos.SystemOrderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SystemOrder>()
             .HasOne(so => so.OrderType)
             .WithMany(ot => ot.systemOrders)
             .HasForeignKey(so => so.OrderTypeId)
             .OnDelete(DeleteBehavior.Restrict);

                

            // SystemOrderSteps -> Employees
            modelBuilder.Entity<SystemOrderSteps>()
                .HasOne(sos => sos.Employee)
                .WithMany(e => e.SystemOrderSteps)
                .HasForeignKey(sos => sos.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            // SystemOrderSteps -> SystemOrders
            modelBuilder.Entity<SystemOrderSteps>()
                .HasOne(sos => sos.SystemOrders)
                .WithMany(so => so.SystemOrderSteps)
                .HasForeignKey(sos => sos.SystemOrderId)
                .OnDelete(DeleteBehavior.Restrict);
  
            modelBuilder.Entity<UserAction>()
                .HasOne(ua => ua.User)
                .WithMany(u => u.UserActions)
                .HasForeignKey(ua => ua.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        }

    }
}