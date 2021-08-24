using DuneDaqErrorReporting.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using DuneDaqErrorReporting.Data;
using Microsoft.EntityFrameworkCore;

namespace DuneDaqErrorReporting.Hubs
{
    public class ErrorHub : Hub
    {

        private readonly ApplicationDbContext applicationDbContext;


        public ErrorHub(IConfiguration configuration)
        {
            applicationDbContext = new ApplicationDbContext(configuration);
        }

        public override Task OnConnectedAsync()
        {
            var errorDatasInput = applicationDbContext.ErrorReports.OrderByDescending(er => er.time).Take(20000).ToList();  
            SendInitData(errorDatasInput);

            return base.OnConnectedAsync();
        }

        public async Task SendInitData(List<ErrorReport> errorDatasInput)
        {
            //
            await Clients.All.SendAsync("InitErrors", errorDatasInput);

            //await Clients.All.SendAsync("InitErrors", errorDatasInput);
        }
    }
}
