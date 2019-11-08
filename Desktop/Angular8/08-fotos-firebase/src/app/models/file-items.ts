export class FileItem {

    public archivo: File;
    public nombreArchivo: string;
    public url: string;
    public estatusUpload: boolean;
    public progresoCarga: number;

    constructor(archivo: File) {
        this.archivo =  archivo;
        this.nombreArchivo = archivo.name;

        this.estatusUpload = false;
        this.progresoCarga = 0;
    }
}
