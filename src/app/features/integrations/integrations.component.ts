import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.css']
})
export class IntegrationsComponent {
  showTelegramForm = false;

  toggleTelegramForm() {
    this.showTelegramForm = !this.showTelegramForm;
  }
}
