import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseApiService } from 'src/app/networking/firebase-api.service';
import { Festival } from '../../models/festival.interface';
import { Organisation } from 'src/app/models/organisation.interface';
@Component({
  selector: 'app-festivals',
  templateUrl: './festivals.component.html',
  styleUrls: ['./festivals.component.css'],
})
export class FestivalsComponent implements OnInit {
  org: Organisation = {
    ID: undefined,
    naziv: undefined,
    adresa: undefined,
    godinaOsnivanja: undefined,
    logo: undefined,
    kontaktTelefon: undefined,
    email: undefined,
    festivali: undefined,
  };
  festIDs: String;
  orgName: String;
  fests: Array<Festival> = [];
  filteredFests: Array<Festival> = [];
  filterName: string = '';
  filterType: string = '';
  filterTransport: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: FirebaseApiService
  ) {}

  ngOnInit(): void {
    const orgID = this.route.snapshot.params['id'];

    this.apiService.getOrganisation(orgID).subscribe(
      (orgData) => {
        this.org = { ...orgData, ID: orgID };

        this.apiService.getFestivals(this.org.festivali).subscribe(
          (festivals) => {
            for (let id in festivals) {
              const festival = { ...festivals[id], ID: id };
              this.fests.push(festival);
            }
            this.filteredFests = [...this.fests];
          },
          (err) => {
            this.router.navigate(['no-internet']);
            console.log(err);
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }
  festSelected(festID: String) {
    this.router.navigate(['festival', this.org.festivali, festID]);
  }
  filterFests() {
    let filteredArr = [];

    for (let i = 0; i < this.fests.length; i++) {
      if (
        this.fests[i].naziv
          .toUpperCase()
          .includes(this.filterName.toUpperCase()) &&
        this.fests[i].tip
          .toUpperCase()
          .includes(this.filterType.toUpperCase()) &&
        this.fests[i].prevoz
          .toUpperCase()
          .includes(this.filterTransport.toUpperCase())
      ) {
        filteredArr.push(this.fests[i]);
      }
    }
    this.filteredFests = [...filteredArr];
  }
}
