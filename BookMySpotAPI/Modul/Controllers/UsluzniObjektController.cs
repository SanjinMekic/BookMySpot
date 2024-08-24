﻿using BookMySpotAPI.Data;
using BookMySpotAPI.Modul.Models;
using BookMySpotAPI.Modul.ViewModels;
using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookMySpotAPI.Modul.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class UsluzniObjektController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public UsluzniObjektController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<UsluzniObjekt>> Get (int id)
        {
            var usluzniObjekt = await _dbContext.UsluzniObjekti.FindAsync(id);

            if (usluzniObjekt == null)
                return NotFound("Uslužni objekt nije pronađen!");

            var returnUsluzniObjekt = await _dbContext.UsluzniObjekti.Where(u => u.usluzniObjektID == usluzniObjekt.usluzniObjektID).Include(u => u.grad).Include(u => u.kategorija).Select(u => new UsluzniObjekt
            {
                usluzniObjektID = u.usluzniObjektID,
                nazivObjekta = u.nazivObjekta,
                adresa = u.adresa,
                telefon = u.telefon,
                radnoVrijemePocetak = u.radnoVrijemePocetak,
                radnoVrijemeKraj = u.radnoVrijemeKraj,
                slika = u.slika,
                kategorijaID = u.kategorijaID,
                kategorija = u.kategorija,
                gradID = u.gradID,
                grad = u.grad,
                prosjecnaOcjena = _dbContext.Recenzije.Where(r => r.usluzniObjektID == u.usluzniObjektID).Average(r => (double?)r.recenzijaOcjena),
                isSmjestaj = u.isSmjestaj,
                latitude = u.latitude,
                longitude = u.longitude,
          
            }).FirstOrDefaultAsync();

            return Ok(returnUsluzniObjekt);
        }

        [HttpGet]
        public async Task<ActionResult<List<UsluzniObjekt>>> GetByKategorijaID(int id)
        {
            var kategorija = await _dbContext.Kategorije.FindAsync(id);
            if (kategorija == null)
                return NotFound("Kategorija nije pronađena!");

            var listaObjekata = await _dbContext.UsluzniObjekti.Where(u => u.kategorijaID == kategorija.kategorijaID).Include(u => u.grad).Include(u => u.kategorija).Select(u => new UsluzniObjekt
            {
                usluzniObjektID = u.usluzniObjektID,
                nazivObjekta = u.nazivObjekta,
                adresa = u.adresa,
                telefon = u.telefon,
                radnoVrijemePocetak = u.radnoVrijemePocetak,
                radnoVrijemeKraj = u.radnoVrijemeKraj,
                slika = u.slika,
                kategorijaID = u.kategorijaID,
                kategorija = u.kategorija,
                gradID = u.gradID,
                grad = u.grad,
                prosjecnaOcjena = _dbContext.Recenzije.Where(r => r.usluzniObjektID == u.usluzniObjektID).Average(r => (double?)r.recenzijaOcjena),
                isSmjestaj = u.isSmjestaj,
                latitude = u.latitude,
                longitude = u.longitude,
            }).ToListAsync();

            return Ok(listaObjekata);
        }
        [HttpPut]
        [Route("{id:int}")]
        public async Task<ActionResult<List<UsluzniObjekt>>> EditKoordinateObjekta([FromRoute] int id, [FromBody] EditKoordinateObjektaVM request)
        {
            var izBaze = await _dbContext.UsluzniObjekti.FirstOrDefaultAsync(u => u.usluzniObjektID == id);

            if(izBaze == null)
            {
                return NotFound();
            }

            izBaze.latitude = request.latitude;
            izBaze.longitude = request.longitude;

            await _dbContext.SaveChangesAsync();

            return Ok(izBaze);  
        }


    }
}
