using Microsoft.EntityFrameworkCore;

namespace fiber_erp_dev1.Models
{
    public class ServiceDBContext : DbContext
    {
        public ServiceDBContext(DbContextOptions<ServiceDBContext> options) : base(options)
        {

        }

        public DbSet<Users2> Users2 { get; set; }
        public DbSet<Perfiles> Perfiles { get; set; }
        public DbSet<Permisos> Permisos { get; set; }
        public DbSet<PerfilPermisos> PerfilPermisos { get; set; }
        public DbSet<OrdenesServicio> OrdenesServicio { get; set; }
        public DbSet<AsignacionServicio> AsignacionServicios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Users2>()
                .HasOne(u => u.Perfil)
                .WithMany(p => p.Users2)
                .HasForeignKey(u => u.ID_Perfil);

            modelBuilder.Entity<AsignacionServicio>()
                .HasOne(a => a.Users2)
                .WithMany(u => u.Asignaciones)
                .HasForeignKey(a => a.ID_Usuario);

            modelBuilder.Entity<AsignacionServicio>()
                .HasOne(a => a.OrdenServicio)
                .WithMany(o => o.Asignaciones)
                .HasForeignKey(a => a.ID_OS);

            modelBuilder.Entity<OrdenesServicio>()
                .HasOne(o => o.Users2)
                .WithMany(u => u.OrdenesServicios)
                .HasForeignKey(o => o.ID_Usuario)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PerfilPermisos>()
                .HasOne(pp => pp.Permisos)
                .WithMany()
                .HasForeignKey(pp => pp.PermisoId);

            modelBuilder.Entity<PerfilPermisos>()
                .HasOne(pp => pp.Perfiles)
                .WithMany()
                .HasForeignKey(pp => pp.PerfilId);

        }
    }
}
