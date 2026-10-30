import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityViewDialog } from './city-view-dialog';

describe('CityViewDialog', () => {
  let component: CityViewDialog;
  let fixture: ComponentFixture<CityViewDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityViewDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(CityViewDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
