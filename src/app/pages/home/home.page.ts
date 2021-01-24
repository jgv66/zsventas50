// import { Component, HostListener } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  deferredPrompt: any;
  showButton = false;
  showIosInstall: boolean;

  constructor( private router: Router ) {}

  entrar() {
    // this.router.navigate( ['/login'] ) ;
    this.router.navigateByUrl('/login');
  }

  // @HostListener('window:beforeinstallprompt', ['$event'])
  // onbeforeinstallprompt(e) {
  //   console.log(e);
  //   // Prevent Chrome 67 and earlier from automatically showing the prompt
  //   e.preventDefault();
  //   // Stash the event so it can be triggered later.
  //   this.deferredPrompt = e;
  //   this.showButton = true;
  // }

  // addToHomeScreen() {
  //   // hide our user interface that shows our A2HS button
  //   this.showButton = false;
  //   // Show the prompt
  //   this.deferredPrompt.prompt();
  //   // Wait for the user to respond to the prompt
  //   this.deferredPrompt.userChoice
  //     .then((choiceResult) => {
  //       if (choiceResult.outcome === 'accepted') {
  //         console.log('User accepted the A2HS prompt');
  //       } else {
  //         console.log('User dismissed the A2HS prompt');
  //       }
  //       this.deferredPrompt = null;
  //     });
  // }

  // // Detects if device is on iOS
  // isIos() {
  //   const userAgent = localStorage.getItem('userAgent'); // window.navigator.userAgent.toLowerCase();
  //   console.log('userAgent: ', userAgent);
  //   return /iphone|ipad|ipod/.test( userAgent );
  // }
  // // Detects if device is in standalone mode
  // isInStandaloneMode() {
  //   console.log(localStorage.getItem('isInStandaloneMode'));
  //   return localStorage.getItem('isInStandaloneMode') === 'true';
  // }

}
