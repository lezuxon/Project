import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const newUser = this.registerForm.value;

      this.authService.register(newUser).subscribe({
        next: () => {
          alert('რეგისტრაცია წარმატებით დასრულდა, ახლა გაიარეთ ავტორიზაცია.');
          this.router.navigate(['/login']);
        },
        error: (err) => (this.errorMessage = 'რეგისტრაციისას დაფიქსირდა შეცდომა.'),
      });
    }
  }
}
