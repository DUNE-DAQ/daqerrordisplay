using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using DuneDaqErrorReporting.Data;
using DuneDaqErrorReporting.Models;
using Microsoft.AspNetCore.Authorization;

namespace DuneDaqErrorReporting.Controllers
{
    [Authorize]
    public class ErrorReportsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ErrorReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: ErrorReports
        public async Task<IActionResult> Index()
        {
            ViewBag.Initializer = _context.ErrorReports.FirstOrDefault();
            return View();
        }

        // GET: ErrorReports/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var errorReport = await _context.ErrorReports
                .FirstOrDefaultAsync(m => m.Id == id);
            if (errorReport == null)
            {
                return NotFound();
            }

            return View(errorReport);
        }


        private bool ErrorReportExists(Guid id)
        {
            return _context.ErrorReports.Any(e => e.Id == id);
        }
    }
}
