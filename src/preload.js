import { contextBridge, ipcRenderer } from "electron";

const api = {
    addProduct: (nameProduct, cantProduct, fechaVencProduct, estadoProduct) => ipcRenderer.invoke('products:add', nameProduct, cantProduct, fechaVencProduct, estadoProduct),
    deleteProduct: (idProduct) => ipcRenderer.invoke('products:delete', idProduct),
    updateProduct: (idProduct, nameProduct, cantProduct, fechaVencProduct, estadoProduct) => ipcRenderer.invoke('products:update', idProduct, nameProduct, cantProduct, fechaVencProduct, estadoProduct),
    getProduct: () => ipcRenderer.invoke('products:getAll'),
}
contextBridge.exposeInMainWorld('api', api)