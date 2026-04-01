import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatSnackBarModule,
  ],
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css'],
})
export class EmployeeEditComponent implements OnInit {
  form: FormGroup;
  loading = false;
  fetchingEmployee = true;
  photoPreview: string | null = null;
  genderOptions = ['Male', 'Female', 'Other'];
  employeeId = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
      employee_photo: [''],
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    this.employeeService.searchEmployeeById(this.employeeId).subscribe({
      next: (emp) => {
        this.photoPreview = emp.employee_photo || null;
        const rawDate = emp.date_of_joining;
        const parsedDate = isNaN(Number(rawDate)) ? new Date(rawDate) : new Date(Number(rawDate));
        this.form.patchValue({
          ...emp,
          date_of_joining: parsedDate,
        });
        this.fetchingEmployee = false;
      },
      error: () => {
        this.fetchingEmployee = false;
        this.snackBar.open('Employee not found', 'Close', { duration: 3000 });
        this.router.navigate(['/employees']);
      },
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
      this.form.patchValue({ employee_photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const formValue = { ...this.form.value };
    if (formValue.date_of_joining instanceof Date) {
      formValue.date_of_joining = formValue.date_of_joining.toISOString();
    }
    formValue.salary = parseFloat(formValue.salary);
    this.employeeService.updateEmployee(this.employeeId, formValue).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Employee updated successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.message || 'Failed to update employee', 'Close', { duration: 4000 });
      },
    });
  }
}
