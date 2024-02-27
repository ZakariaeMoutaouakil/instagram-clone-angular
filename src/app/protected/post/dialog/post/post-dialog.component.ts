import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-post-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatFormField,
    MatDialogTitle,
    FormsModule,
    MatDialogActions,
    MatDialogClose,
    MatInput,
    MatButton,
    MatLabel
  ],
  templateUrl: './post-dialog.component.html',
  styleUrl: './post-dialog.component.scss'
})
export class PostDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { description: string, hashtags: string, image: string },
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
