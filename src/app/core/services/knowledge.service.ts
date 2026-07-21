import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeService {
  private apiUrl = environment.apiUrl + '/knowledge';

  constructor(private http: HttpClient) {}

  uploadFiles(files: FileList) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
}
