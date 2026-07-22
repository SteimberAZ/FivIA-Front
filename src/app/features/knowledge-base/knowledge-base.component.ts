import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-knowledge-base',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './knowledge-base.component.html'
})
export class KnowledgeBaseComponent implements OnInit {
  uploadedFiles: any[] = [];
  isUploading = false;
  uploadMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    this.http.get(`${environment.apiUrl}/knowledge/files`).subscribe({
      next: (res: any) => {
        this.uploadedFiles = res;
      },
      error: (err) => {
        console.error('Error fetching files', err);
      }
    });
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.uploadFiles(files);
    }
  }

  uploadFiles(files: FileList) {
    this.isUploading = true;
    this.uploadMessage = 'Subiendo archivos...';
    
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    this.http.post(`${environment.apiUrl}/knowledge/upload`, formData).subscribe({
      next: (res: any) => {
        this.isUploading = false;
        this.uploadMessage = 'Archivos procesados correctamente.';
        this.loadFiles(); // Reload from backend
        setTimeout(() => this.uploadMessage = '', 3000);
      },
      error: (err) => {
        this.isUploading = false;
        this.uploadMessage = (err.error && err.error.error) ? err.error.error : err.message;
        console.error(err);
      }
    });
  }

  deleteFile(file: any) {
    if (!file.id) return;
    this.http.delete(`${environment.apiUrl}/knowledge/files/${file.id}`).subscribe({
      next: () => {
        this.loadFiles();
      },
      error: (err) => {
        console.error('Error deleting file', err);
      }
    });
  }
}
