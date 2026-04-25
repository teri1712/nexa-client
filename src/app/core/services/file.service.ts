import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {from, map, switchMap} from 'rxjs';

export type PresignedUpload = {
    presignedUploadUrl: string;
    fileKey: string;
};
export type PresignedDownload = {
    presignedDownloadUrl: string;
}
export type FileIntegrity = {
    fileKey: string;
    eTag: string;
};

@Injectable({providedIn: 'root'})
export class FileService {
    private http = inject(HttpClient);

    upload(file: File) {
        const filename = file.name;
        const presignUrl = environment.apiUrl + '/files/upload?filename=' + encodeURIComponent(filename);
        return this.http.post<PresignedUpload>(presignUrl, {}, {observe: 'body'}).pipe(
            switchMap((presigned: PresignedUpload) => {
                return from(fetch(presigned.presignedUploadUrl, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': 'application/octet-stream'
                    }
                })).pipe(map((response) => {
                    if (!response.ok)
                        throw new Error('Failed to upload file');
                    const eTag = response.headers.get("ETag");
                    return ({
                        eTag: eTag,
                        fileKey: presigned.fileKey
                    }) as FileIntegrity
                }));
            })
        );
    }

    download(filekey: string) {
        const params = new HttpParams().set('filekey', filekey);
        return this.http.post<PresignedDownload>(
            environment.apiUrl + `/files/download`,
            null,
            {params},
        );
    }
}
