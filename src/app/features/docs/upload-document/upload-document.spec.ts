import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocument } from './upload-document';

import { DocService } from '../../../core/services/doc.service';
import { FileService } from '../../../core/services/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('UploadDocument', () => {
  let component: UploadDocument;
  let fixture: ComponentFixture<UploadDocument>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadDocument],
      providers: [
        { provide: DocService, useValue: {} },
        { provide: FileService, useValue: {} },
        { provide: MatSnackBar, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadDocument);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
