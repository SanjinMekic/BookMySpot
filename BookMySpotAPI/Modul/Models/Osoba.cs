﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookMySpotAPI.Modul.Models
{
    [Table("Osoba")]
    public class Osoba
    {
        [Key]
        public int OsobaID { get; set; }
        public string? Ime { get; set; }
        public string? Prezime { get; set; }
        public string? Email { get; set; }
        public string? Telefon { get; set; }
        public string? Adresa { get; set; }
        public byte[]? Slika { get; set; }
    }
}
