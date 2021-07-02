using DuneDaqErrorReporting.Actions;
using DuneDaqErrorReporting.Data;
using DuneDaqErrorReporting.Hubs;
using DuneDaqErrorReporting.Models;
using DuneDaqErrorReporting.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DuneDaqErrorReporting.Actions
{
    public class SendMessagesToClients
    {
        private readonly IHubContext<ErrorHub> _hubContext;

        public SendMessagesToClients(IHubContext<ErrorHub> hubContext)
        {
            InputsMessenger messenger = InputsMessenger.Instance;
            IInputMessage m = (IInputMessage)messenger;
            m.OnIncoming += m_OnIncoming;

            _hubContext = hubContext;
        }

        private async void m_OnIncoming(object sender, EventArgs e)
        {
            ErrorReport ErrorData = (ErrorReport)sender;

            await _hubContext.Clients.All.SendAsync("ReceiveUpdate", ErrorData);
        }
    }
}
