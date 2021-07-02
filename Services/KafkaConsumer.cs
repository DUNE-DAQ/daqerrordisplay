using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Confluent.Kafka;
using DuneDaqErrorReporting.Actions;
using DuneDaqErrorReporting.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using System.Text.Json;
using DuneDaqErrorReporting.Data;

namespace DuneDaqErrorReporting.Services
{
    public class KafkaConsumer : BackgroundService
    {

        private readonly string topic;
        private readonly IConsumer<string, string> kafkaConsumer;
        private readonly IConfiguration _configuration;

        public KafkaConsumer(IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            string path;

            #if DEBUG
                path = webHostEnvironment.ContentRootPath;
            #else
                path = "/opt/app-root/src/";
            #endif
            
            ConsumerConfig consumerConfig = new ConsumerConfig()
            {        
                BootstrapServers = configuration["KafkaConfig:Logging:BootstrapServers"],
                GroupId = configuration["KafkaConfig:Logging:GroupId"],
            };
            kafkaConsumer = new ConsumerBuilder<string, string>(consumerConfig).Build();
            topic = configuration["KafkaConfig:Topics:MessengerTopic"];
            _configuration = configuration;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {

            new Thread(() => StartConsumerLoop(stoppingToken)).Start();

            return Task.CompletedTask;

        }
        
        private async void StartConsumerLoop(CancellationToken cancellationToken)
        {
            kafkaConsumer.Subscribe(this.topic);
            InputsMessenger messenger = InputsMessenger.Instance;

            int consumerCalls = 0;

            while (!cancellationToken.IsCancellationRequested)
            {
                try
                {
                    consumerCalls++;

                    var consumeResult = kafkaConsumer.Consume(cancellationToken);

                    if (consumeResult != null)
                    {
                        //Transforms message to an object and inject to database
                        ErrorReport errorReport = await InputTransforming(consumeResult.Message.Value);

                        messenger.InputMessage(errorReport);                        
                    }
                    
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (ConsumeException e)
                {
                    // Consumer errors should generally be ignored (or logged) unless fatal.
                    Console.WriteLine($"Consume error: {e.Error.Reason}");

                    if (e.Error.IsFatal)
                    {
                        break;
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine($"Unexpected error: {e}");
                    break;
                }

            }
        }

        public async Task<ErrorReport> InputTransforming(string message)
        {
            Guid guid = Guid.NewGuid();
            ErrorReport errorReport = JsonSerializer.Deserialize<ErrorReport>(message);
            errorReport.Id = guid;

            using (ApplicationDbContext monitoringDbContext = new ApplicationDbContext(_configuration))
            {
                monitoringDbContext.Add(errorReport);
                await monitoringDbContext.SaveChangesAsync();
            }

            return errorReport;
        }
    }
}
