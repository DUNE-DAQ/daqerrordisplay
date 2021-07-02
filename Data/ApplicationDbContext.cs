using DuneDaqErrorReporting.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace DuneDaqErrorReporting.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(IConfiguration configuration) : base(new DbContextOptionsBuilder<ApplicationDbContext>().UseNpgsql(   configuration["ApplicationDbConnectionParameters:Server"] +
                                                                                                                                        configuration["ApplicationDbConnectionParameters:Port"] +
                                                                                                                                        configuration["ApplicationDbConnectionParameters:Database"] +
                                                                                                                                        configuration["ApplicationDbConnectionParameters:User"] +
                                                                                                                                        configuration["ApplicationDbConnectionParameters:Password"] +
                                                                                                                                        configuration["ApplicationDbConnectionParameters:Security"] +
                                                                                                                                        configuration["ApplicationDbConnectionParameters:Pooling"]
                                                                                                                                    ).Options) { }

        public DbSet<DuneDaqErrorReporting.Models.ErrorReport> ErrorReports { get; set; }

        
    }
}
