import { ipcMain } from "electron";

export default function setUpHandlers(db){
    ipcMain.handle('products:add',(_, nameProduct, cantProduct, fechaVencProduct)=>{
        return db.addProduct(nameProduct, cantProduct, fechaVencProduct);
    });
    ipcMain.handle('products:delete',(_, idProduct)=>{
        return db.deleteProduct(idProduct);
    });
    ipcMain.handle('products:update',(_, idProduct, nameProduct, cantProduct, fechaVencProduct)=>{
        return db.updateProduct(idProduct, nameProduct, cantProduct, fechaVencProduct);
    });
    ipcMain.handle('products:getAll',()=>{
        return db.getProduct();
    });
}