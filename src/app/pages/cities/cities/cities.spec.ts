import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cities } from './cities';

describe('Cities', () => {
  let component: Cities;
  let fixture: ComponentFixture<Cities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cities],
    }).compileComponents();

    fixture = TestBed.createComponent(Cities);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
