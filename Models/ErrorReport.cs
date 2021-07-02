using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DuneDaqErrorReporting.Models
{
    public class ErrorReport
    {

        [Key]
        public Guid Id { get; set; }

        [Display(Name = "Application Name")]
        public string application_name { get; set; }

        [Display(Name = "Chain")]
        public int chain { get; set; }

        [Display(Name = "Current Working Directory")]
        public string cwd { get; set; }

        [Display(Name = "File name")]
        public string file_name { get; set; }

        [Display(Name = "Function name")]
        public string function_name { get; set; }

        [Display(Name = "Group hash")]
        public long group_hash { get; set; }

        [Display(Name = "Host name")]
        public string host_name { get; set; }

        [Display(Name = "Issue name")]
        public string issue_name { get; set; }

        [Display(Name = "Line number")]
        public int line_number { get; set; }

        [Display(Name = "Message")]
        public string message { get; set; }

        [Display(Name = "Package name")]
        public string package_name { get; set; }

        [Display(Name = "Parameters")]
        public string parameters { get; set; }

        [Display(Name = "Partition")]
        public string partition { get; set; }

        [Display(Name = "Process ID")]
        public int process_id { get; set; }

        [Display(Name = "Qualifiers")]
        public string[] qualifiers { get; set; }

        [Display(Name = "Severity")]
        public string severity { get; set; }

        [Display(Name = "Thread ID")]
        public int thread_id { get; set; }

        [Display(Name = "Time")]
        public long time { get; set; }

        [Display(Name = "Time from epoch")]
        public long usecs_since_epoch { get; set; }

        [Display(Name = "User ID")]
        public int user_id { get; set; }

        [Display(Name = "User name")]
        public string user_name { get; set; }
    }
}
