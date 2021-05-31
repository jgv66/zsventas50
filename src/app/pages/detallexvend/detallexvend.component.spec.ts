import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetallexvendComponent } from './detallexvend.component';

describe('DetallexvendComponent', () => {
  let component: DetallexvendComponent;
  let fixture: ComponentFixture<DetallexvendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallexvendComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetallexvendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
