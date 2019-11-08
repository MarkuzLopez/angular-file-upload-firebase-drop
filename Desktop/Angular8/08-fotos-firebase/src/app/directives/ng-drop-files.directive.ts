import { Directive, EventEmitter, ElementRef, Output, Input, HostListener } from '@angular/core';
import { FileItem } from '../models/file-items';


@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  @HostListener('dragover', ['$event'])
  // cuando el mouse este dentro de la caja de img
  public onDragEnter(event: any) {
    this.mouseSobre.emit(true);
    this._preveniDetener(event);
  }

  @HostListener('dragleave', ['$event'])
  // cuando el mouse este fuera de la caja de img y no se ponga mas azul
  public onDragLeave(event: any) {
    this.mouseSobre.emit(false);
  }

  // * creacion de evento de drop dragable para las imagenes
  @HostListener('drop', ['$event'])
  // cuando el mouse este fuera de la caja de img y no se ponga mas azul
  public onDrop( event: any ) {

    const transferencia = this._getTransferencia(event);
   // console.log(transferencia);
    // sssi no hay transferencia entonces que no haga nada
    if ( !transferencia) {
      return;
    }

    // si existe un archivo en el drop  entonces extraae el archivo,
    // detene el proceso y emite un false
    this._extraerArchivos(transferencia.files);
    this._preveniDetener(event);
    this.mouseSobre.emit(false);
  }

  private _getTransferencia( event: any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _extraerArchivos( archivosLista: FileList) {
   // console.log(archivosLista);
   //  TODO este for funcionaa para barrer los objetos y convertilo aa arrego.
    // tslint:disable-next-line: forin
    for ( const propiedad in Object.getOwnPropertyNames(archivosLista)) {

      const archivoTemporal = archivosLista[propiedad];

      if ( this._archivoPuedeSerCargado(archivoTemporal)) {
        const nuevoArchivo = new FileItem(archivoTemporal);
        this.archivos.push(nuevoArchivo);
      }
    }
    console.log(this.archivos);
  }

  // * Finalizacion de draagable drop.

  // validacion de que puede ya cargarse la imagen si problema alguno
  private _archivoPuedeSerCargado(archivo: File): boolean {

    if (!this._archivoYaFueDroppeado(archivo.name) && this._esImagen(archivo.type)) {
      return true;
    } else {
      return false;
    }
  }

  // validaciones del archivo
  private _preveniDetener(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoYaFueDroppeado(nombreArchivo: string): boolean {
    for (const archivo of this.archivos) {
        if (archivo.nombreArchivo ===  nombreArchivo) {
          console.log('el archivo ' + nombreArchivo + 'existe ya');
          return true;
        }
    }
   /// no existe  imagen
    return false;
  }

  private _esImagen(tipoarchivo: string): boolean {
      return (tipoarchivo === '' || tipoarchivo === undefined) ? false : tipoarchivo.startsWith('image');
  }
}
