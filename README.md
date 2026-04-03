# BookMySpot

**BookMySpot** je full-stack web aplikacija za pregled i rezervaciju uslužnih objekata kao što su saloni, smještaj, ordinacije i rent-a-car i slično. Projekat uključuje korisnički dio, te administratorski i menadžerski panel za upravljanje sadržajem, korisnicima i rezervacijama.

---

## Tech Stack
- **Frontend:** Angular 18, TypeScript  
- **Backend:** ASP.NET Core Web API (.NET 6)  
- **Baza podataka:** SQL Server, Entity Framework Core 6  
- **Ostalo:** Swagger, SendGrid, Google Maps  

---

## Ključne funkcionalnosti

### Korisnički dio
- Registracija i prijava korisnika  
- Pregled kategorija i uslužnih objekata  
- Kreiranje rezervacija i pregled historije rezervacija  
- Favoriti i recenzije  
- Pitanja i odgovori  

### Administratorski i menadžerski panel
- Upravljanje kategorijama i uslužnim objektima  
- Upravljanje korisničkim računima  
- Uređivanje sadržaja sekcije “O nama”  

---

## Arhitektura
- **angularApp:** Klijentska aplikacija  
- **BookMySpotAPI:** REST API i poslovna logika  
- **SQL Server:** Perzistencija podataka  

---

## Pokretanje lokalno

### Backend
```bash
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend
```bash
npm install
npm start
```
