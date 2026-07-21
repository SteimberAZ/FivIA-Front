import { Component } from '@angular/core';

@Component({
  selector: 'app-knowledge-base',
  standalone: true,
  imports: [],
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.css']
})
export class KnowledgeBaseComponent {
  triggerFileInput() {
    const fileInput = document.getElementById('fileUpload');
    if (fileInput) {
      fileInput.click();
    }
  }
}
