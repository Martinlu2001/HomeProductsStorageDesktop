import { contextBridge, ipcRenderer } from "electron";

const api = {
    addProduct: (nameProduct, cantProduct, fechaVencProduct) => ipcRenderer.invoke('products:add', nameProduct, cantProduct, fechaVencProduct),
    deleteProduct: (idProduct) => ipcRenderer.invoke('products:delete', idProduct),
    updateProduct: (idProduct, nameProduct, cantProduct, fechaVencProduct) => ipcRenderer.invoke('products:update', idProduct, nameProduct, cantProduct, fechaVencProduct),
    getProduct: () => ipcRenderer.invoke('products:getAll'),
}
contextBridge.exposeInMainWorld('api', api)