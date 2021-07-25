import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss']
})
export class RegisterComponent implements OnInit {
  loading: boolean = false;
  showError: boolean = false;
  errorMessage: string = "";
  register: any = {};
  
  imgSrc: string = "assets/img/null-image.png";
  imgUrl: string = "";
  selectedImage?: string;

  now: number = Date.now();


  constructor(
    private auth: AngularFireAuth,
    private fire: AngularFirestore,
    private router: Router,
    private storage: AngularFireStorage,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
  }

  tapRegister() {
    this.auth.createUserWithEmailAndPassword(
      this.register.email,
      this.register.password
    ).then((resp) => {
      this.router.navigateByUrl('/auth');
      this.register['role'] = 'user';
      this.fire.collection('user').add(this.register);
      this.loading = false;
    }).catch((err) => {
      this.loading = false;
      this.errorMessage = err['message'];
      this.showError = true;
    })
  }

  getImage(url: any) {
    if(url.target.files && url.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (u: any) => this.imgSrc = u.target.result;
      reader.readAsDataURL(url.target.files[0]);
      this.selectedImage! = url.target.files[0];
      this.imgUrl = url.target.files[0]['name'];
    } else {
      this.imgSrc = "assets/img/null-image.png";
      this.selectedImage!;
    }
  }

  simpanData() {
    var filePath = `user/${this.imgUrl.split('.').slice(0, -1).join ('.')}_${new Date().getTime()}`;
    var fileRef = this.storage.ref(filePath);

    this.loading = true;
    this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
      finalize(() => (
        fileRef.getDownloadURL().subscribe((url) => {
          this.register['image_url'] = url;
          this.register['created_at']  = this.datePipe.transform(this.now, 'MMM d, y, h:mm:ss a');

          this.tapRegister();

        })
      ))
    ).subscribe()
  }

  closeAlert() {
    this.showError = false;
  }

}
