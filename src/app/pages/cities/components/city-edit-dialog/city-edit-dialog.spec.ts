import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityEditDialog } from './city-edit-dialog';

describe('CityEditDialog', () => {
  let component: CityEditDialog;
  let fixture: ComponentFixture<CityEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityEditDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(CityEditDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
