import { Component, inject, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: 'delete-dialog.html',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ],
})
export class DeleteDialog {
  data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<DeleteDialog>);
  readonly task = model(this.data.task); // return task object to confirm it should be deleted

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
