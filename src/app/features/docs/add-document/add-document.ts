import {Component, inject, signal} from '@angular/core';
import {DocService} from '../../../core/services/doc.service';
import {FileService} from '../../../core/services/file.service';
import {DocType} from '../../../core/models/doc.models';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {switchMap} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-add-document',
    standalone: true,
    imports: [ReactiveFormsModule, MatIconModule, CommonModule],
    templateUrl: './add-document.html',
    styleUrl: './add-document.scss',
})
export class AddDocument {
    private readonly uploadService = inject(FileService);
    private readonly docService = inject(DocService);
    private readonly snackbar = inject(MatSnackBar);
    private readonly router = inject(Router)
    private readonly fb = inject(NonNullableFormBuilder);
    readonly form = this.fb.group({
        title: ['', Validators.required],
        file: [null as File | null, Validators.required],
        description: ['', Validators.required],
        type: [null as DocType | null, Validators.required],
    });
    submitting = signal(false);
    readonly DocType = DocType;

    onFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            this.form.patchValue({file: target.files[0]});
        }
    }

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        if (this.submitting())
            return;
        this.submitting.set(true);

        const file = this.form.value.file;
        const title = this.form.value.title;
        const description = this.form.value.description;
        const type = this.form.value.type;

        if (!file || !title || !description || !type) return;
        this.uploadService.upload(file)
            .pipe(switchMap((fileIntegrity) => {
                return this.docService.add({
                    fileKey: fileIntegrity.fileKey,
                    eTag: fileIntegrity.eTag,
                    filename: file.name,
                    description: description,
                    title: title,
                    type: type
                })
            })).subscribe({
            next: (doc) => {
                this.snackbar.open('Document added successfully', 'Close', {
                    duration: 2000,
                });
                this.router.navigate(['docs', doc.id])
            },
            error: (err) => {
                console.error(err);
                this.submitting.set(false)
                this.snackbar.open('Failed to add document', 'Close', {
                    duration: 2000,
                })
            },
            complete: () => this.submitting.set(false)
        })
    }
}
