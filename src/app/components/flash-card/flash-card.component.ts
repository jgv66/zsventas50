import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flash-card',
  templateUrl: './flash-card.component.html',
  styleUrls: ['./flash-card.component.scss'],
})
export class FlashCardComponent implements OnInit {

  flipped = false;
  count   = 0;

  constructor() {}

  ngOnInit() {}

  flip() {
    this.flipped = !this.flipped;
  }

  tapEvent()  {
    this.count++;
    setTimeout(() => {
      if (this.count === 1) {
        this.count = 0;
        console.log('Single Tap');
      }if(this.count > 1) {
        this.count = 0;
        this.flip()
        console.log('Doble Tap');
      }
    }, 250);
  }

}
