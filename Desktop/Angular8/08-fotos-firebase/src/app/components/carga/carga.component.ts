import { Component, OnInit } from '@angular/core';
import { UploadImagesService } from '../../services/upload-images.service';
import { FileItem } from '../../models/file-items';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.css']
})
export class CargaComponent implements OnInit {

  estaSobreEleemento = false;
  archivos: FileItem[] = [];

  constructor(private _cargaImagenes: UploadImagesService) { }

  ngOnInit() {
  }

  cargarImagenes() {
    this._cargaImagenes.cargarImagenesFirebase(this.archivos);
  }

  pruebaElemento(event) {
    console.log(event);
  }

  limpiarArchivos() {
    this.archivos = [];
  }

}
