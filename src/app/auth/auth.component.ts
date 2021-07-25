import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, AfterViewInit {

  constructor(
    public elementRef: ElementRef,
    private auth: AngularFireAuth,
    private router: Router
  ) {
    auth.authState.subscribe(resp => {
      if (resp) {
        router.navigateByUrl('admin/dashboard')
      }
    })
   }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#f5f5f5";
  }

}
