import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { FileItem } from '../models/file-items';

@Injectable({
  providedIn: 'root'
})
export class UploadImagesService {

  private CARPETA_IMAGENES = 'img';

  constructor(private db: AngularFirestore) { }

  cargarImagenesFirebase(imagenes: FileItem[]) {
    // console.log(imagenes);
    const storageRef =  firebase.storage().ref();

    for (const item of imagenes) {
        item.estatusUpload = true;
        if (item.progresoCarga >= 100) {
            continue;
        }

        const uploadTask: firebase.storage.UploadTask =
                          storageRef.child(`${this.CARPETA_IMAGENES}/${item.nombreArchivo}`)
                          .put(item.archivo);

        uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
            // tslint:disable-next-line: max-line-length
            (snapshot: firebase.storage.UploadTaskSnapshot) => item.progresoCarga = (snapshot.bytesTransferred / snapshot.totalBytes ) * 100,
            (error ) => console.error(error),
          () => {
            console.log('imagen cargadaa, y resume ', uploadTask.resume);
            uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl: any) => {
              console.log(downloadUrl);
              item.url = downloadUrl;
              item.estatusUpload = false;
              console.log(item.url);
              this.guardarImagen({
                nombre: item.nombreArchivo,
                url: item.url
              });
            });
            // item.url = uploadTask.snapshot.downloadURL;
          }
        );
    }
  }

  private guardarImagen(imagen: {nombre: string, url: string}) {
    this.db.collection(`/${this.CARPETA_IMAGENES}`).add( imagen );
  }
}
