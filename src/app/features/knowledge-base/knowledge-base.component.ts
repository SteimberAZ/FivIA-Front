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
    // In a real app, this would fetch from a GET /api/knowledge endpoint
    // For now, we will simulate loading the array, or you can add a GET endpoint if you want.
    // Let's add it to the backend soon, but for now just keep local state if uploaded.
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
        // Add to list locally
        for (let i = 0; i < files.length; i++) {
          this.uploadedFiles.push({ filename: files[i].name });
        }
        setTimeout(() => this.uploadMessage = '', 3000);
      },
      error: (err) => {
        this.isUploading = false;
        this.uploadMessage = 'Error al subir los archivos.';
        console.error(err);
      }
    });
  }

  deleteFile(index: number) {
    this.uploadedFiles.splice(index, 1);
  }
}
