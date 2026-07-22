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
    this.uploadMessage = 'Procesando archivo localmente...';
    
    const file = files[0];
    if (!file) return;

    // Solo soportamos archivos de texto por ahora para evitar problemas de binarios
    if (file.type === 'application/pdf') {
       this.isUploading = false;
       this.uploadMessage = 'Sube un archivo de texto (.txt, .md, .csv) por ahora. Soporte PDF próximamente.';
       return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const content = e.target.result;
      
      const payload = {
        filename: file.name,
        mimetype: file.type,
        content: content
      };

      this.uploadMessage = 'Subiendo conocimiento...';
      this.http.post(`${environment.apiUrl}/knowledge/upload`, payload).subscribe({
        next: (res: any) => {
          this.isUploading = false;
          this.uploadMessage = '¡Conocimiento añadido correctamente!';
          this.loadFiles();
          setTimeout(() => this.uploadMessage = '', 3000);
        },
        error: (err) => {
          this.isUploading = false;
          this.uploadMessage = (err.error && err.error.error) ? err.error.error : err.message;
          console.error(err);
        }
      });
    };
    reader.onerror = () => {
      this.isUploading = false;
      this.uploadMessage = 'Error leyendo el archivo localmente.';
    };
    reader.readAsText(file);
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
