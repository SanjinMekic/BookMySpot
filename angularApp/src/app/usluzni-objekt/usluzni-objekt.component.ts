import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { UsluzniObjekt } from '../models/usluzniObjekt.model';
import { MojConfig } from '../moj-config';
import { Usluga } from '../models/usluga.model';
import { LoginInformacije } from '../_helpers/login-informacije';
import { AutentifikacijaHelper } from '../_helpers/autentifikacija-helper';
import { HeaderComponent } from '../shared/header/header.component';
import { Recenzija } from '../models/recenzija.model';
import { TerminFunckijeService } from '../shared/termin-manager/termin-funckije.service';

@Component({
  selector: 'app-usluzni-objekt',
  templateUrl: './usluzni-objekt.component.html',
  styleUrl: './usluzni-objekt.component.css'
})
export class UsluzniObjektComponent implements OnInit {

  usluzniObjektID: any;
  usluzniObjekt: UsluzniObjekt | null = null;
  listaUsluga: Usluga[] | null = null;
  odabraniDatum: string | null = null;
  odabranaUsluga: Usluga | null = null;
  odabranoVrijeme: string | null = null;
  dostupniTermini: string[] = [];
  minDate: string = '';
  prosjecnaOcjena: any;
  listaRecenzija: Recenzija[] | null = null;
  defaultSlika: any = "../../assets/user.png";
  odabranaOcjena: number | null = null;
  tekstRecenzije: string = "";
  logiraniKorisnik: any;
  datumPocetka: string | null = null;
  datumKraja: string | null = null;
  karticnoPlacanje: boolean = false;


  constructor(private httpKlijent: HttpClient, private route: ActivatedRoute, private router: Router, private menu: HeaderComponent, private terminFunkcije: TerminFunckijeService)
{}

  ngOnInit(): void {
    this.usluzniObjektID=Number(this.route.snapshot.paramMap.get('usluzniObjektId'));
    this.getUsluzniObjekt(this.usluzniObjektID);
    this.getListaUsluga(this.usluzniObjektID);
    this.getListaRecenzija(this.usluzniObjektID);
    this.getPodaci();
    const danas = new Date();
    this.minDate = danas.toISOString().split('T')[0];

    if (this.datumPocetka) {
      this.datumKraja = this.datumPocetka;
    }
  }

  onDatumPocetkaChange() {
    if (this.datumPocetka) {
      const datumPocetkaDate = new Date(this.datumPocetka);
      datumPocetkaDate.setDate(datumPocetkaDate.getDate() + 1);
      this.datumKraja = datumPocetkaDate.toISOString().split('T')[0];
    }
  }



  getStars(): number[] {
    const totalStars = 5;
    return Array(totalStars).fill(0);
  }

  get filledStars(): number {
    return Math.round(this.prosjecnaOcjena);
  }

  getImagePath(putanja: string): string {
    return putanja ? putanja : this.defaultSlika;
  }

  loginInfo():LoginInformacije {
    return AutentifikacijaHelper.getLoginInfo();
  }

  getPodaci()
  {
    this.logiraniKorisnik=this.loginInfo().autentifikacijaToken?.korisnickiNalog;
  }

  getUsluzniObjekt(id: number) {
    this.httpKlijent.get<UsluzniObjekt>(MojConfig.adresa_servera + "/UsluzniObjekt/Get?id="+id, MojConfig.http_opcije()).subscribe(x=>{
      this.usluzniObjekt=x;
      this.prosjecnaOcjena=x.prosjecnaOcjena;
    })
  }

  getListaUsluga(id:number)
  {
    this.httpKlijent.get<Usluga[]>(MojConfig.adresa_servera+ "/Usluga/GetByObjektID?id="+id, MojConfig.http_opcije()).subscribe(x=>{
      this.listaUsluga=x;
    })
  }

  getListaRecenzija(id:number)
  {
    this.httpKlijent.get<Recenzija[]>(MojConfig.adresa_servera+ "/Recenzija/GetByUsluzniObjektID?id="+id, MojConfig.http_opcije()).subscribe(x=>{
      this.listaRecenzija = x;
    })
  }

  prijava()
  {
    this.menu.NavigirajIZatvori("/login");
  }

  onDatumUslugaChange()
  {
    if(this.odabraniDatum && this.odabranaUsluga)
    {
       this.terminFunkcije.getListaDostupnihTermina(this.usluzniObjektID,this.odabraniDatum, this.odabranaUsluga.trajanje).subscribe(x=>{
        this.dostupniTermini=x;
       });
    }
  }

  rezervisiTermin() {
    console.log(this.karticnoPlacanje);

    if(this.odabraniDatum && this.odabranaUsluga && this.odabranoVrijeme)
    {
      this.terminFunkcije.rezervisiTermin(this.odabraniDatum, this.odabranoVrijeme, this.odabranaUsluga, this.karticnoPlacanje, this.logiraniKorisnik.osobaID);
      this.odabraniDatum=null;
      this.odabranoVrijeme=null;
      this.odabranaUsluga=null;
    }

    else{
      alert("Morate odabrati datum rezervacije, uslugu i početno vrijeme rezervacije!");
    }
  }

  posaljiRecenziju() {
    if(this.odabranaOcjena && this.tekstRecenzije)
    {
      let parametri: any=
      {
        recenzijaOcjena: this.odabranaOcjena,
        recenzijaTekst: this.tekstRecenzije,
        osobaID: this.loginInfo().autentifikacijaToken?.osobaID,
        usluzniObjektID: this.usluzniObjektID
      };

      this.httpKlijent.post(MojConfig.adresa_servera+"/Recenzija/Add", parametri, MojConfig.http_opcije()).subscribe({
        next: (response) => {
          alert("Recenzija uspješno dodana!");
          console.log(response);
          this.getListaRecenzija(this.usluzniObjektID);
        },
        error: (error) => {
          alert("Greška pri dodavanju recenzije!");
          console.log(error);
        }
      });
      this.odabranaOcjena = null;
      this.tekstRecenzije = "";
    }

    else{
      alert("Morate odabrati ocjenu i unijeti tekst recenzije!");
    }
  }

  onSmjestajUsluga() {
    if (this.odabranaUsluga) {
      this.terminFunkcije.getNajdaljiDatum(this.odabranaUsluga).subscribe({
        next: (response: Date) => {
          if (response) {
            let najdaljiDatum = new Date(response);
            najdaljiDatum.setDate(najdaljiDatum.getDate() + 2);
            this.minDate = najdaljiDatum.toISOString().split('T')[0];
            console.log(this.minDate);
          } else {
            this.minDate = new Date().toISOString().split('T')[0];
          }
        },
        error: (error) => {
          console.error("Greška pri dohvaćanju najudaljenijeg datuma:", error);
          this.minDate = new Date().toISOString().split('T')[0];
        }
      });
    }
  }

  rezervisiTerminSmjestaja() {
    if (this.odabranaUsluga && this.datumPocetka && this.datumKraja) {
      this.terminFunkcije.rezervisiTerminSmjestaja(this.datumPocetka, this.datumKraja, this.logiraniKorisnik.osobaID, this.odabranaUsluga, this.karticnoPlacanje)
      this.odabranaUsluga = null;
      this.datumPocetka = null;
      this.datumKraja = null;
      this.karticnoPlacanje = false;
    } 
    
    else {
      alert("Molimo unesite sve potrebne podatke za rezervaciju.");
    }
  }

}
