import { app } from 'electron';
import path from 'node:path';
import Database from 'better-sqlite3';

class AppDatabase{

    constructor(){
        const dbPath = path.join(app.getPath('userData'), 'products.sqlite');
        this.db = new Database(dbPath);
        this.db.pragma('journal_mode = WAL');
        this.setUpDataBase()
    }

    //crear la bd
    setUpDataBase(){
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS products (
            idProduct INTEGER PRIMARY KEY AUTOINCREMENT,
            nameProduct TEXT NOT NULL,
            cantProduct TEXT NOT NULL,
            fechaVencProduct TEXT NOT NULL
            )`)
            console.log("db inicio")
    }

    //agregar producto
    addProduct(nameProduct, cantProduct, fechaVencProduct){
        const stmt = this.db.prepare('INSERT INTO products (nameProduct, cantProduct, fechaVencProduct) VALUES (?, ?, ?)');
        const info = stmt.run(nameProduct, cantProduct, fechaVencProduct);
        return{
            idProduct: info.lastInsertRowid,
            nameProduct: nameProduct,
            cantProduct: cantProduct,
            fechaVencProduct: fechaVencProduct
        }
    }

    //eliminar producto
    deleteProduct(idProduct){
        const stmt = this.db.prepare('DELETE FROM products WHERE idProduct = ?');
        const info = stmt.run(idProduct);
        return info.changes > 0;
    }

    //actualizar producto
    updateProduct(idProduct, nameProduct, cantProduct, fechaVencProduct){
        const stmt = this.db.prepare('UPDATE products SET nameProduct = ?, cantProduct = ?, fechaVencProduct = ?  WHERE idProduct = ?');
        const info = stmt.run(nameProduct, cantProduct, fechaVencProduct, idProduct);
        return info.changes > 0;
    }

    //mostrar productos
    getProduct(){
        const stmt = this.db.prepare('SELECT * from products ORDER BY fechaVencProduct ASC');
        return stmt.all()
    }
    close(){
        this.db.close();
        console.log("db closed");
    }
}
export default AppDatabase;